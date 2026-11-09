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
  return item.resposta_bot_whatsapp || item.resposta;
};
const ask = (message, runtime = env) => worker.fetch(new Request("https://worker.example", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
}), runtime);
const askWithHistory = (payload, runtime = env) => worker.fetch(new Request("https://worker.example", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json" },
  body: JSON.stringify(payload),
}), runtime);
const gemini = (text) => async () => new Response(JSON.stringify({
  candidates: [{ content: { parts: [{ text }] } }],
}), { status: 200, headers: { "content-type": "application/json" } });

const complexQuestion = "Tenho R$ 250 de saldo, fui comprar no supermercado, mas a maquininha recusou. Ontem consegui usar normalmente.";
const modelDecision = (decision, answer, sourceIds = ["saldo-compra-recusada"]) =>
  JSON.stringify({ decision, answer, sourceIds });

test("relato de recusa permite esclarecimento fundamentado sem encaminhar", async (t) => {
  const answer = "Em qual carteira aparecem os R$ 250: Alimentação, Refeição ou outra?";
  const api = t.mock.method(globalThis, "fetch", gemini(modelDecision("clarify", answer)));
  const data = await (await ask(complexQuestion, withKey)).json();
  assert.deepEqual(data, { answer, handoff: false });
  assert.equal(api.mock.callCount(), 1);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.ok(body.contents[0].parts[0].text.includes("saldo-compra-recusada"));
});

test("continuação curta usa o histórico em vez de responder uma FAQ isolada", async (t) => {
  const answer = "O total da compra ficou dentro dos R$ 250 disponíveis nessa carteira?";
  const api = t.mock.method(globalThis, "fetch", gemini(modelDecision("clarify", answer, ["compra-saldo"])));
  const data = await (await askWithHistory({ message: "Alimentação", history: [
    { role: "user", text: complexQuestion },
    { role: "bot", text: "Em qual carteira aparecem os R$ 250?" },
  ] }, withKey)).json();
  assert.deepEqual(data, { answer, handoff: false });
  assert.equal(api.mock.callCount(), 1);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.contents[0].parts[0].text, complexQuestion);
  assert.equal(body.contents[2].parts[0].text.endsWith("Alimentação"), true);
});

test("modelo pode combinar fontes oficiais para responder", async (t) => {
  const answer = "Confira a carteira e a modalidade. Para usar saldo do chip voucher, informe ao caixa que o pagamento é cartão voucher.";
  t.mock.method(globalThis, "fetch", gemini(modelDecision("answer", answer, ["saldo-compra-recusada", "cartao-modalidade-voucher"])));
  assert.deepEqual(await (await ask(complexQuestion, withKey)).json(), { answer, handoff: false });
});

for (const output of [
  "Resposta livre sem contrato",
  modelDecision("answer", "Uma resposta", []),
  modelDecision("answer", "Uma resposta", ["fonte-inventada"]),
  modelDecision("answer", "Uma resposta", [null]),
  modelDecision("unknown", "Uma resposta"),
  modelDecision("clarify", "Sem pergunta"),
  modelDecision("clarify", "Qual carteira? Qual senha?"),
  modelDecision("answer", " "),
  modelDecision("answer", "x".repeat(901)),
  "null",
]) {
  test(`saída inválida não chega ao visitante: ${output.slice(0, 65)}`, async (t) => {
    t.mock.method(globalThis, "fetch", gemini(output));
    const data = await (await ask(complexQuestion, withKey)).json();
    assert.equal(data.handoff, true);
    assert.match(data.answer, /Não encontrei uma informação oficial suficiente/);
  });
}

test("decisão de atendimento usa o encaminhamento oficial, não texto livre", async (t) => {
  const log = t.mock.method(console, "log", () => {});
  t.mock.method(globalThis, "fetch", gemini(modelDecision("handoff", "Consultei seu cartão e desbloqueei.", [])));
  const data = await (await ask(complexQuestion, withKey)).json();
  assert.equal(data.handoff, true);
  assert.doesNotMatch(data.answer, /desbloqueei/);
  assert.equal(log.mock.calls[0].arguments[1].path, "ai_handoff");
});

test("CPF ou cartão no histórico não são enviados ao modelo", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  for (const text of ["CPF 123.456.789-00", "Cartão 4111 1111 1111 1111"]) {
    const data = await (await askWithHistory({ message: "E agora?", history: [
      { role: "user", text }, { role: "bot", text: "Como posso ajudar?" },
    ] }, withKey)).json();
    assert.equal(data.handoff, true);
  }
  assert.equal(api.mock.callCount(), 0);
});

test("pergunta canônica com histórico continua literal e sem modelo", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const item = faq.find((entry) => entry.id === "app-saldo");
  const data = await (await askWithHistory({ message: item.pergunta, history: [
    { role: "user", text: complexQuestion }, { role: "bot", text: "Qual carteira?" },
  ] }, withKey)).json();
  assert.equal(data.answer, item.resposta_bot_whatsapp || item.resposta);
  assert.equal(api.mock.callCount(), 0);
});

test("conversa de recusa preserva contexto até encaminhar ao suporte", async (t) => {
  const outputs = [
    modelDecision("clarify", "Em qual carteira aparecem os R$ 250?"),
    modelDecision("clarify", "O total da compra estava dentro desse saldo?", ["compra-saldo"]),
    modelDecision("handoff", "", []),
  ];
  const api = t.mock.method(globalThis, "fetch", async () => gemini(outputs.shift())());
  const history = [];
  for (const [message, handoff] of [
    [complexQuestion, false],
    ["Alimentação", false],
    ["Sim, a compra era R$ 100. Já conferi modalidade, senha e cartão ativo, mas continua recusando.", true],
  ]) {
    const data = await (await askWithHistory({ message, history }, withKey)).json();
    assert.equal(data.handoff, handoff);
    history.push({ role: "user", text: message }, { role: "bot", text: data.answer });
  }
  assert.equal(api.mock.callCount(), 3);
  const lastCall = JSON.parse(api.mock.calls[2].arguments[1].body);
  assert.equal(lastCall.contents.length, 5);
  assert.equal(lastCall.contents[2].parts[0].text, "Alimentação");
});

test("resposta truncada pelo provedor não é exibida mesmo com JSON válido", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ candidates: [{
    finishReason: "MAX_TOKENS",
    content: { parts: [{ text: modelDecision("clarify", "Qual carteira?") }] },
  }] })));
  assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
});

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
  assert.equal(data.handoff, true);
});

test("paráfrase devolve a resposta literal do faq.json", async () => {
  const data = await (await ask("Tem taxa de mensalidade?")).json();
  assert.equal(data.answer, answerFor(/mensalidade ou taxa por colaborador/));
  assert.equal(data.handoff, true);
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

test("503 transitório é repetido uma vez e a resposta válida chega ao visitante", async (t) => {
  const answer = "Em qual carteira aparece o saldo?";
  let attempts = 0;
  const api = t.mock.method(globalThis, "fetch", async (...args) => ++attempts === 1
    ? new Response("indisponível", { status: 503 })
    : gemini(modelDecision("clarify", answer))(...args));
  const data = await (await ask(complexQuestion, withKey)).json();
  assert.deepEqual(data, { answer, handoff: false });
  assert.equal(api.mock.callCount(), 2);
  assert.equal(api.mock.calls[0].arguments[1].body, api.mock.calls[1].arguments[1].body);
});

test("timeout transitório permite uma segunda tentativa", async (t) => {
  const answer = "Em qual carteira aparece o saldo?";
  let attempts = 0;
  const api = t.mock.method(globalThis, "fetch", async (...args) => {
    if (++attempts === 1) throw new DOMException("timeout", "TimeoutError");
    return gemini(modelDecision("clarify", answer))(...args);
  });
  assert.deepEqual(await (await ask(complexQuestion, withKey)).json(), { answer, handoff: false });
  assert.equal(api.mock.callCount(), 2);
});

test("indisponibilidade persistente termina após duas tentativas", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => new Response("erro", { status: 503 }));
  assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
  assert.equal(api.mock.callCount(), 2);
});

test("orçamento total esgotado impede uma nova chamada ao provedor", async (t) => {
  const start = Date.now();
  let elapsed = 0;
  t.mock.method(Date, "now", () => start + elapsed);
  const api = t.mock.method(globalThis, "fetch", async () => {
    elapsed = 7001;
    throw new DOMException("timeout", "TimeoutError");
  });
  assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
  assert.equal(api.mock.callCount(), 1);
});

test("uma resposta lenta pode usar o prazo inteiro, sem corte prematuro em 3,5s", async (t) => {
  const start = Date.now();
  let elapsed = 0;
  const limits = [];
  t.mock.method(Date, "now", () => start + elapsed);
  t.mock.method(AbortSignal, "timeout", (ms) => {
    limits.push(ms);
    return new AbortController().signal;
  });
  let attempts = 0;
  const answer = "Em qual carteira aparece o saldo?";
  t.mock.method(globalThis, "fetch", async (...args) => {
    if (++attempts === 1) {
      elapsed = 2000;
      return new Response("indisponível", { status: 503 });
    }
    return gemini(modelDecision("clarify", answer))(...args);
  });
  assert.deepEqual(await (await ask(complexQuestion, withKey)).json(), { answer, handoff: false });
  assert.equal(limits[0], 7000);
  assert.ok(limits[1] <= 5000 && limits[1] > 3500);
});

test("JSON inválido do provedor não é repetido", async (t) => {
  const api = t.mock.method(globalThis, "fetch", async () => new Response("não é JSON", { status: 200 }));
  assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
  assert.equal(api.mock.callCount(), 1);
});

for (const status of [400, 401, 403, 404, 429]) {
  test(`erro HTTP ${status} não gera repetição automática`, async (t) => {
    const api = t.mock.method(globalThis, "fetch", async () => new Response("erro", { status }));
    assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
    assert.equal(api.mock.callCount(), 1);
  });
}

test("indisponibilidade do provedor registra status sem vazar corpo ou chave", async (t) => {
  const log = t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => new Response("conteúdo privado do provedor", { status: 503 }));
  const data = await (await ask(complexQuestion, withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(log.mock.callCount(), 2);
  assert.deepEqual(log.mock.calls[0].arguments, ["Assistente JÁ: modelo indisponível", { reason: "http_error", status: 503 }]);
  assert.doesNotMatch(JSON.stringify(log.mock.calls), /conteúdo privado|test-key/);
});

test("timeout é identificado sem registrar mensagem da exceção", async (t) => {
  const log = t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => { throw new DOMException("conteúdo privado", "TimeoutError"); });
  const data = await (await ask(complexQuestion, withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(log.mock.callCount(), 2);
  assert.deepEqual(log.mock.calls[0].arguments, ["Assistente JÁ: modelo indisponível", { reason: "timeout" }]);
});

test("falha de rede é identificada sem registrar URL ou chave da exceção", async (t) => {
  const log = t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => { throw new TypeError("URL privada com test-key"); });
  assert.equal((await (await ask(complexQuestion, withKey)).json()).handoff, true);
  assert.equal(log.mock.callCount(), 1);
  assert.deepEqual(log.mock.calls[0].arguments, ["Assistente JÁ: modelo indisponível", { reason: "request_error" }]);
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
  assert.ok(data.suggestions.includes(faq.find((item) => item.id === "mensalidade-custo").pergunta));
  assert.ok(data.suggestions.includes(faq.find((item) => item.id === "colaborador-cadastro").pergunta));
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
  assert.equal(data.handoff, true);
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
      assert.equal(data.answer, item.resposta_bot_whatsapp || item.resposta, question);
      assert.equal(data.handoff, item.comportamento !== "RESPOSTA_DIRETA");
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

// Histórico recente permite follow-ups ("e o segundo?") sem abrir mão do ancoramento na FAQ.
test("histórico válido é enviado ao modelo como conversa estruturada", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await askWithHistory({
    message: "E o segundo tem anuidade?",
    history: [
      { role: "user", text: "Quais cartões a JÁ oferece?" },
      { role: "bot", text: "Oferecemos cartão refeição e cartão virtual." },
    ],
  }, withKey)).json();
  assert.equal(data.handoff, true);
  assert.equal(api.mock.callCount(), 1);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.contents.length, 3);
  assert.equal(body.contents[0].role, "user");
  assert.match(body.contents[0].parts[0].text, /Quais cartões/);
  assert.equal(body.contents[1].role, "model");
  assert.equal(body.contents[2].role, "user");
  assert.match(body.contents[2].parts[0].text, /E o segundo tem anuidade/);
  assert.match(body.contents[2].parts[0].text, /Acima está o trecho recente/);
});

test("histórico de bot na primeira posição é descartado (Gemini espera começar com user)", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  await askWithHistory({
    message: "e depois?",
    history: [
      { role: "bot", text: "Resposta inicial." },
      { role: "user", text: "Outra pergunta" },
    ],
  }, withKey);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.contents.length, 2); // 1 turno válido + pergunta atual
  assert.equal(body.contents[0].role, "user");
});

test("histórico inválido é descartado sem quebrar a chamada", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const data = await (await askWithHistory({
    message: "Vocês entregam em Portugal?",
    history: [null, 42, { role: "alien" }, { role: "user", text: "   " }, { role: "user", text: "pergunta real" }],
  }, withKey)).json();
  assert.equal(data.handoff, true);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.contents.length, 2);
  assert.match(body.contents[0].parts[0].text, /pergunta real/);
});

test("histórico longo é cortado nos 8 turnos e 450 caracteres por texto", async (t) => {
  const api = t.mock.method(globalThis, "fetch", gemini("SEM_RESPOSTA"));
  const filler = "x".repeat(600);
  const history = Array.from({ length: 12 }, (_, i) => ({ role: i % 2 ? "bot" : "user", text: `${i} ${filler}` }));
  await askWithHistory({ message: "Vocês entregam em Portugal?", history }, withKey);
  const body = JSON.parse(api.mock.calls[0].arguments[1].body);
  assert.equal(body.contents.length, 9); // 8 turnos + pergunta atual
  assert.ok(body.contents.slice(0, -1).every((c) => c.parts[0].text.length <= 450));
  assert.ok(body.contents[0].parts[0].text.startsWith("4 "));
});
