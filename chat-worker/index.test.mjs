import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
// Executa o Worker sem dependências externas: substitui o import JSON no teste.
const source = readFileSync(new URL("./index.js", import.meta.url), "utf8");
const faqSource = readFileSync(new URL("../src/faq.json", import.meta.url), "utf8");
const code = source.replace('import faq from "../src/faq.json";', `const faq = ${faqSource};`)
  .replace('"../src/faq-search.mjs"', JSON.stringify(new URL("../src/faq-search.mjs", import.meta.url).href));
if (code === source) throw new Error("Import da FAQ não localizado no Worker");
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
const faq = JSON.parse(readFileSync(new URL("../src/faq.json", import.meta.url), "utf8"));
const origin = "https://jadigital.com.br";
const env = { ALLOWED_ORIGINS: origin };
const withKey = { ...env, GEMINI_API_KEY: "test-key" };
const answerFor = (re) => {
  const item = faq.find((i) => re.test(i.pergunta));
  assert.ok(item, `FAQ sem item que case com ${re}`);
  return item.resposta;
};
const ask = (message, runtime = env) => worker.fetch(new Request("https://worker.example", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
}), runtime);
const gemini = (text) => async () => new Response(JSON.stringify({
  candidates: [{ content: { parts: [{ text }] } }],
}), { status: 200, headers: { "content-type": "application/json" } });

test("preflight autorizado retorna 204 sem corpo e permite o POST JSON", async () => {
  const response = await worker.fetch(new Request("https://worker.example", {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type",
    },
  }), env);
  assert.equal(response.status, 204);
  assert.equal(response.body, null);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.equal(response.headers.get("access-control-allow-methods"), "POST, OPTIONS");
  assert.equal(response.headers.get("access-control-allow-headers"), "Content-Type");
  assert.equal(response.headers.get("vary"), "Origin");
});

test("preflight de origem desconhecida continua bloqueado", async () => {
  const response = await worker.fetch(new Request("https://worker.example", {
    method: "OPTIONS", headers: { Origin: "https://unknown.example" },
  }), env);
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.deepEqual(await response.json(), { error: "origin_not_allowed" });
});

test("POST autorizado preserva resposta JSON e cabeçalhos CORS", async () => {
  const response = await worker.fetch(new Request("https://worker.example", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ message: "" }),
  }), env);
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.deepEqual(await response.json(), { error: "invalid_message" });
});

test("pergunta idêntica devolve a resposta literal do faq.json", async () => {
  const response = await ask("A implantação tem algum custo?");
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.answer, answerFor(/A implantação tem algum custo/));
  assert.equal(data.handoff, false);
});

test("paráfrase devolve a resposta literal do faq.json", async () => {
  const data = await (await ask("Tem taxa de mensalidade?")).json();
  assert.equal(data.answer, answerFor(/mensalidade ou taxa por colaborador/));
  assert.equal(data.handoff, false);
});

// Primeira camada não gasta token: com match na FAQ, nenhuma chamada externa.
test("match na FAQ não chama o modelo", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("o modelo não deveria ser chamado");
  });
  await ask("Tem taxa de mensalidade?", withKey);
  await ask("A implantação tem algum custo?", withKey);
  assert.equal(api.mock.callCount(), 0);
});

test("sem match, a resposta SEM_RESPOSTA do modelo ativa atendimento humano", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("Vocês entregam em Portugal?", withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("sem chave, o modelo não é chamado e cai no fallback", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("sem chave não deveria haver chamada externa");
  });
  const data = await (await ask("Vocês entregam em Portugal?")).json();
  assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  assert.equal(data.handoff, true);
  assert.equal(api.mock.callCount(), 0);
});

test("erro do provedor cai no fallback com encaminhamento", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("erro", { status: 500 }));
  const data = await (await ask("Vocês entregam em Portugal?", withKey)).json();
  assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  assert.equal(data.handoff, true);
});

test("modelo sem base na FAQ (SEM_RESPOSTA) cai no fallback", async (t) => {
  t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("Vocês entregam em Portugal?", withKey)).json();
  assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  assert.equal(data.handoff, true);
});

// A resposta da FAQ cobre senha do cartão; o Worker não pode bloquear a pergunta.
test("pergunta sobre senha é respondida pela FAQ", async () => {
  const data = await (await ask("Esqueci a senha do cartão")).json();
  assert.equal(data.answer, answerFor(/Como consultar a senha do cartão/));
  assert.equal(data.handoff, false);
});

// Regressão: "for" dentro de "conformidade"/"fornecedor" puxava a FAQ errada.
test("palavra curta não casa por substring em outra palavra", async () => {
  const data = await (await ask("E se o funcionário for demitido?")).json();
  assert.doesNotMatch(data.answer, /PAT|FA000031/);
});

// Fuzzy é para erro de digitação, não para adivinhar assunto: sem base, não casa.
test("pergunta fora da FAQ continua sem match mesmo com fuzzy", async () => {
  const data = await (await ask("E se o funcionário for demitido?")).json();
  assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  assert.equal(data.handoff, true);
});

test("erro de digitação em palavra longa ainda encontra a FAQ", async () => {
  const data = await (await ask("Como funciona o cartao virtal?")).json();
  assert.equal(data.answer, answerFor(/Existe cartão virtual/));
  assert.equal(data.handoff, false);
});

// "funcionalidades" estava como stopword e a pergunta caía no fallback.
test("funcionalidades encontra o item do aplicativo", async () => {
  const data = await (await ask("funcionalidades")).json();
  assert.equal(data.answer, answerFor(/Quais funcionalidades/));
  assert.equal(data.handoff, false);
});

test("app é tratado como aplicativo", async () => {
  const data = await (await ask("app")).json();
  const other = await (await ask("aplicativo")).json();
  assert.deepEqual(data, other);
  assert.ok(data.suggestions?.length > 0);
  assert.equal(data.handoff, false);
});

// Termo genérico não recebe resposta inventada: lista os assuntos oficiais.
test("termo genérico lista os assuntos da FAQ", async () => {
  const data = await (await ask("cartão")).json();
  assert.match(data.answer, /Encontrei mais de um assunto/);
  assert.ok(Array.isArray(data.suggestions) && data.suggestions.length > 0);
  assert.equal(data.handoff, false);
});

// A lista vem com as perguntas para o cliente renderizar como botões.
test("lista de assuntos traz sugestões clicáveis", async () => {
  const data = await (await ask("cartão")).json();
  assert.ok(Array.isArray(data.suggestions));
  assert.ok(data.suggestions.length > 0);
  assert.equal(data.handoff, false);
});

test("resposta literal não traz sugestões", async () => {
  const data = await (await ask("Tem taxa de mensalidade?")).json();
  assert.equal(data.suggestions, undefined);
});

// Plural em -ões precisa cair no mesmo tratamento do singular (termo genérico), e não
// casar por acidente com o item de prazo de entrega.
test("plural cartões tem o mesmo comportamento de cartão", async () => {
  const data = await (await ask("cartões")).json();
  assert.match(data.answer, /Encontrei mais de um assunto/);
  assert.ok(Array.isArray(data.suggestions) && data.suggestions.length > 0);
  assert.equal(data.handoff, false);
});

test("plural benefícios continua listando assuntos", async () => {
  const data = await (await ask("benefícios")).json();
  assert.match(data.answer, /Encontrei mais de um assunto/);
  assert.equal(data.handoff, false);
});

// "Colaboradores" empata entre custo por colaborador (item 2) e inclusão de colaborador (15).
test("empate devolve os dois itens oficiais, sem escolher pela ordem do arquivo", async () => {
  const data = await (await ask("Colaboradores")).json();
  assert.ok(data.answer.includes(answerFor(/mensalidade ou taxa por colaborador/)));
  assert.ok(data.answer.includes(answerFor(/Como incluir um colaborador/)));
  assert.ok(Array.isArray(data.suggestions) && data.suggestions.length > 0);
  assert.equal(data.handoff, false);
});

test("empate não chama o modelo", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("o modelo não deveria ser chamado");
  });
  await ask("Colaboradores", withKey);
  assert.equal(api.mock.callCount(), 0);
});

test("palavra única sem empate continua respondendo pela FAQ", async () => {
  const data = await (await ask("Mensalidade")).json();
  assert.equal(data.answer, answerFor(/mensalidade ou taxa por colaborador/));
  assert.equal(data.handoff, false);
});

// Sanidade de custo: 500 perguntas com match devem resolver em poucos segundos.
test("busca com fuzzy continua barata", async () => {
  const start = performance.now();
  for (let i = 0; i < 500; i++) await ask("Tem taxa de mensalidade?");
  const elapsed = performance.now() - start;
  assert.ok(elapsed < 5000, `500 buscas levaram ${Math.round(elapsed)}ms`);
});

// Documento/cartão não é enviado ao provedor: encaminha direto para o humano.
test("pergunta com CPF ou cartão não vai para o modelo", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("dado sensível não deveria sair do Worker");
  });
  const data = await (await ask("Meu CPF é 123.456.789-00, e agora?", withKey)).json();
  assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  assert.equal(data.handoff, true);
  assert.equal(api.mock.callCount(), 0);
});

test("Server-Timing traz total e o tempo do modelo quando ele é usado", async (t) => {
  t.mock.method(globalThis, "fetch", gemini("Resposta ancorada na FAQ."));
  const response = await ask("Vocês entregam em Portugal?", withKey);
  const timing = response.headers.get("server-timing") || "";
  assert.match(timing, /total;dur=\d+/);
  assert.match(timing, /model;dur=\d+/);
});

// Regressões de segurança para o novo critério de busca.
test("pergunta com negação não recebe correspondência fuzzy automática", async (t) => {
  const f = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("A implantação não tem custo?", withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(f.mock.callCount(), 1);
});

test("pergunta com dois temas não escolhe uma resposta isolada", async (t) => {
  const f = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("Implantação e mensalidade", withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(f.mock.callCount(), 1);
});

test("CPF dentro de pergunta idêntica à FAQ não passa pela busca nem pelo Gemini", async (t) => {
  const f = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("A implantação tem algum custo? CPF 123.456.789-00", withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(f.mock.callCount(), 0);
});

test("pergunta sobre frete por cidade não ganha preço inventado por fuzzy", async () => {
  const data = await (await ask("Quanto custa entregar 150 cartões para Campinas?")).json();
  assert.equal(data.handoff, true);
});

// Saudações e gentilezas devem ser imediatas e não consumir Gemini.
for (const msg of ["Olá", "olá!", "OI", "Bom dia", "Boa tarde", "Boa noite", "Tudo bem"]) {
  if (msg === "Tudo bem") continue; // saudação isolada coberta pelas expressões explícitas acima
  test(`saudação ${JSON.stringify(msg)} não chama IA nem gera handoff`, async (t) => {
    const external = t.mock.method(globalThis, "fetch", async () => { throw new Error("IA não deve ser chamada"); });
    const resp = await ask(msg, withKey);
    const data = await resp.json();
    assert.equal(resp.status, 200);
    assert.equal(data.handoff, false);
    assert.match(data.answer, /Sou o Assistente JÁ/);
    assert.equal(external.mock.callCount(), 0);
  });
}
test("pergunta iniciada com saudação segue para processamento normal", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => { throw new Error("FAQ deveria responder"); });
  const response = await ask("Olá, a implantação tem algum custo?", withKey);
  const data = await response.json();
  assert.doesNotMatch(data.answer, /Sou o Assistente JÁ/);
  assert.equal(api.mock.callCount(), 0);
});
test("agradecimento é tratado sem IA", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => { throw new Error("IA não deve ser chamada"); });
  const data = await (await ask("Obrigado!", withKey)).json();
  assert.equal(data.handoff, false);
  assert.match(data.answer, /Por nada/);
  assert.equal(api.mock.callCount(), 0);
});

test("equivalentes do suporte retornam literalmente a base sem consultar IA", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => { throw new Error("Equivalente não deve consultar IA"); });
  for (const item of faq) {
    for (const question of item.equivalentes) {
      const data = await (await ask(question, withKey)).json();
      assert.equal(data.answer, item.resposta, question);
      assert.equal(data.handoff, false);
    }
  }
  assert.equal(api.mock.callCount(), 0);
});

test("modelo recebe só a base consolidada, sem histórico nem referências internas", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await ask("Qual o horário de atendimento?", withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(api.mock.callCount(), 1);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  const context = body.contents[0].parts[0].text;
  assert.ok(context.includes(faq.find((item) => item.id === "app-saldo").resposta));
  assert.doesNotMatch(context, /CHAT-\d+|R\$\s*25|8h às 18h|revisao_editorial|Referências internas/);
});
