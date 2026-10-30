// Assistente JÁ — híbrido:
// 1) pergunta parecida com a FAQ de public/faq.json -> resposta LITERAL do JSON, sem modelo;
// 2) sem correspondência confiável -> o modelo responde usando SOMENTE os itens do JSON
//    como contexto (ele não tem outra fonte e devolve SEM_RESPOSTA quando não há base);
// 3) sem chave, erro ou SEM_RESPOSTA -> FALLBACK + encaminhamento humano.
// O JSON é importado no build (fonte única): editar a FAQ e rodar `wrangler deploy` atualiza.
import faq from "../public/faq.json";

import { createFaqSearch, FAQ_FALLBACK } from "../src/faq-search.mjs";

const FALLBACK = FAQ_FALLBACK;
const NO_ANSWER = "SEM_RESPOSTA";
const SYSTEM = [
  "Você é o Assistente JÁ Benefícios.",
  "Responda em português do Brasil de forma clara e direta (máximo 3 frases ou tópicos curtos), usando exclusivamente as informações dos itens de FAQ fornecidos.",
  "Não invente preços, taxas, prazos, regras, nomes, números ou condições.",
  "Se os itens não responderem à pergunta, responda somente SEM_RESPOSTA.",
  "Não peça CPF, senha, dados de cartão ou dados pessoais.",
  "Não fale sobre outras empresas.",
].join(" ");
const CONTEXT = faq.map((item, i) => `[${i + 1}] Categoria: ${item.grupo || "Geral"}\nP: ${item.pergunta}\nR: ${item.resposta}`).join("\n\n");
const searchFaq = createFaqSearch(faq);

// Segunda camada: modelo ancorado no JSON. Sem chave/erro/timeout devolve null.
async function askModel(question, env) {
  if (!env.GEMINI_API_KEY) return null;
  const model = env.GEMINI_MODEL || "gemini-3.8-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: `${CONTEXT}\n\nPergunta do visitante: ${question}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 300 },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts || []).map(p => p?.text).filter(Boolean).join(" ").trim();
  if (!text || text.includes(NO_ANSWER)) return null;
  return text.slice(0, 900);
}

// Tempo de processamento no Worker (Server-Timing), sem incluir a rede até o navegador.
function response(payload, status, origin, allow, timing) {
  const headers = {"content-type":"application/json; charset=utf-8", "cache-control":"no-store", "x-content-type-options":"nosniff"};
  if (timing) headers["server-timing"] = Object.entries(timing).filter(([,v]) => Number.isFinite(v)).map(([k,v]) => `${k};dur=${v}`).join(", ");
  if (allow) { headers["access-control-allow-origin"] = origin; headers["vary"] = "Origin"; headers["access-control-allow-methods"] = "POST, OPTIONS"; headers["access-control-allow-headers"] = "Content-Type"; headers["access-control-expose-headers"] = "server-timing"; }
  return new Response(status === 204 ? null : JSON.stringify(payload), {status,headers});
}

export default { async fetch(request, env) {
  const t0 = Date.now();
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s=>s.trim()).filter(Boolean);
  const permit = allowed.includes(origin);
  // O log não inclui a pergunta (privacidade): serve para medir acerto da busca e latência.
  const reply = (payload, path, timing = {}) => {
    const total = Date.now() - t0;
    console.log("Assistente JÁ: resposta", { path, totalMs: total, ...timing });
    return response(payload, 200, origin, true, { ...timing, total });
  };
  if (request.method === "OPTIONS") return permit ? response({},204,origin,true) : response({error:"origin_not_allowed"},403,origin,false);
  if (request.method !== "POST") return response({error:"method_not_allowed"},405,origin,permit);
  if (!permit) return response({error:"origin_not_allowed"},403,origin,false);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return response({error:"content_type"},415,origin,true);
  if (Number(request.headers.get("content-length") || 0) > 4096) return response({error:"too_large"},413,origin,true);
  let body;
  try { body = await request.json(); } catch { return response({error:"invalid_json"},400,origin,true); }
  const question = typeof body?.message === "string" ? body.message.trim() : "";
  if (!question || question.length > 450) return response({error:"invalid_message"},400,origin,true);

  // Intenções conversacionais simples não devem consultar a FAQ nem consumir Gemini.
  // Exige a mensagem inteira: evita confundir "Olá, qual o valor?" com uma saudação isolada.
  const hit = searchFaq(question);
  if (hit) {
    const { path, ...payload } = hit;
    return reply(payload, path);
  }

  const t1 = Date.now();
  let answer = null;
  try { answer = await askModel(question, env); } catch { answer = null; }
  const model = Date.now() - t1;
  if (answer) return reply({answer,handoff:false}, "ai", {model});
  return reply({answer:FALLBACK,handoff:true}, "fallback", {model});
}};
