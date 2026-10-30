import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createFaqSearch } from "./faq-search.mjs";

const faq = JSON.parse(readFileSync(new URL("../public/faq.json", import.meta.url), "utf8"));
const search = createFaqSearch(faq);
const item = (id) => {
  const entry = faq.find((entry) => entry.id === id);
  assert.ok(entry, id);
  return entry;
};
const flat = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

test("base tem IDs e perguntas únicos, campos tipados e nenhum metadado interno", () => {
  assert.equal(new Set(faq.map((entry) => entry.id)).size, faq.length);
  const phrases = new Map();
  for (const entry of faq) {
    assert.equal(typeof entry.id, "string");
    assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const field of ["grupo", "pergunta", "resposta"]) assert.ok(typeof entry[field] === "string" && entry[field].trim());
    assert.equal(typeof entry.exibirNoSite, "boolean");
    assert.ok(Array.isArray(entry.equivalentes));
    assert.deepEqual(Object.keys(entry).sort(), ["id", "grupo", "pergunta", "resposta", "equivalentes", "exibirNoSite"].sort());
    for (const phrase of [entry.pergunta, ...entry.equivalentes]) {
      assert.equal(typeof phrase, "string");
      const previous = phrases.get(flat(phrase));
      assert.ok(!previous || previous === entry.id, `Equivalente ambíguo: ${phrase}: ${previous} / ${entry.id}`);
      phrases.set(flat(phrase), entry.id);
    }
  }
});

for (const entry of faq) {
  test(`canônica e equivalentes retornam a mesma resposta: ${entry.id}`, () => {
    for (const phrase of [entry.pergunta, ...entry.equivalentes]) {
      const result = search(phrase);
      assert.equal(result?.answer, entry.resposta, phrase);
      assert.equal(result.path, "faq_exact");
      assert.equal(result.handoff, false);
      assert.equal(result.suggestions, undefined);
    }
  });
}

test("normalização ignora acentos e pontuação também nos equivalentes", () => {
  assert.equal(search("ONDE VEJO MEU SALDO!!!")?.answer, item("app-saldo").resposta);
});

test("perguntas parecidas preservam acesso, erro, consulta de senha e senha de transação", () => {
  const cases = [
    ["Como fazer login com CPF?", "app-acesso"],
    ["Não consigo fazer login", "app-erro-acesso"],
    ["Esqueci a senha do cartão", "cartao-senha"],
    ["Qual senha uso para comprar?", "senha-transacao"],
    ["Meu cartão não passa", "cartao-pagamento-recusado"],
    ["Tenho saldo mas pagamento não passou", "saldo-compra-recusada"],
    ["Roubaram meu cartão", "cartao-perda"],
  ];
  for (const [question, id] of cases) assert.equal(search(question)?.answer, item(id).resposta, question);
});

test("aliases de um item não geram sugestões duplicadas", () => {
  const result = search("aplicativo");
  assert.ok(result?.suggestions?.length > 1);
  assert.equal(new Set(result.suggestions).size, result.suggestions.length);
});

test("tópicos de suporte ficam fora da seleção comercial, mas o assistente os responde", () => {
  const visible = faq.filter((entry) => entry.exibirNoSite);
  assert.equal(visible.length, 17);
  assert.ok(!visible.includes(item("app-acesso")));
  assert.ok(!visible.includes(item("app-saldo")));
  assert.equal(search("Onde vejo meu saldo?")?.handoff, false);
});

test("base pública exclui dados históricos e referências de atendimento", () => {
  const text = JSON.stringify(faq);
  assert.doesNotMatch(text, /CHAT-\d+|R\$\s*25|8h às 18h|8h às 14h|seis dígitos|aguardando_validacao|revisao_editorial/);
  assert.doesNotMatch(item("cartao-aceitacao").resposta, /qualquer estabelecimento/);
});

test("CPF e cartão são bloqueados antes de procurar equivalentes, inclusive no fallback local", () => {
  for (const suffix of ["123.456.789-00", "4111 1111 1111 1111"]) {
    const result = search(`Onde vejo meu saldo? ${suffix}`);
    assert.equal(result?.path, "blocked");
    assert.equal(result.handoff, true);
  }
});

test("procedimentos pendentes não viram respostas por similaridade", () => {
  for (const question of ["Qual o horário de atendimento?", "Posso fazer PIX do saldo?", "Posso usar refeição no atacado?", "Como redefinir a senha do app?"]) {
    assert.equal(search(question), null, question);
  }
});
