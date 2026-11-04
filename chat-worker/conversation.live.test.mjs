import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Executa o mesmo Worker, sem substituir fetch: este teste consome a API real.
const source = readFileSync(new URL("./index.js", import.meta.url), "utf8");
const faq = readFileSync(new URL("../src/faq.json", import.meta.url), "utf8");
const code = source.replace('import faq from "../src/faq.json";', `const faq = ${faq};`)
  .replace('"../src/faq-search.mjs"', JSON.stringify(new URL("../src/faq-search.mjs", import.meta.url).href));
if (code === source) throw new Error("Import da FAQ não localizado no Worker");
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

for (let run = 1; run <= 3; run++) {
  await test(`Gemini real conduz relato, continuação e encaminhamento (${run}/3)`, {
    skip: !process.env.GEMINI_API_KEY && "GEMINI_API_KEY indisponível; conversa real não validada",
  }, async (t) => {
    const paths = [];
    const log = console.log.bind(console);
    t.mock.method(console, "log", (...args) => {
      if (args[0] === "Assistente JÁ: resposta") paths.push(args[1].path);
      log(...args);
    });
    const origin = "https://jadigital.com.br";
    const env = { ALLOWED_ORIGINS: origin, GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      GEMINI_MODEL: process.env.GEMINI_MODEL };
    const history = [];
    const ask = async (message) => {
      const response = await worker.fetch(new Request("https://worker.example", {
        method: "POST",
        headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      }), env);
      assert.equal(response.status, 200);
      const data = await response.json();
      history.push({ role: "user", text: message }, { role: "bot", text: data.answer });
      return data;
    };

    const first = await ask("Tenho R$ 250 de saldo, fui comprar no supermercado, mas a maquininha recusou. Ontem consegui usar normalmente.");
    assert.ok(first.handoff === false, "Relato coberto pela FAQ deve receber orientação");
    assert.ok((first.answer.match(/\?/g) || []).length === 1, "Deve pedir um esclarecimento por vez");
    assert.ok(/carteira/i.test(first.answer), "Deve esclarecer a carteira ainda não informada");

    const second = await ask("Está na carteira Alimentação e a compra era de R$ 100.");
    assert.ok(second.handoff === false, "Continuação deve usar o contexto");
    assert.ok(!/qual carteira|em que carteira|em qual carteira/i.test(second.answer), "Não deve repetir a pergunta respondida");

    const last = await ask("Quero falar com um atendente humano sobre essa recusa.");
    assert.ok(last.handoff === true, "Pedido de atendimento deve encaminhar");
    assert.equal(paths.at(-1), "ai_handoff", "A IA deve decidir pelo atendimento; erro ou timeout não comprovam essa decisão");
  });
  // Distribui as 9 chamadas reais: não transformar a bateria em uma rajada de cota.
  if (run < 3 && process.env.GEMINI_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
}
