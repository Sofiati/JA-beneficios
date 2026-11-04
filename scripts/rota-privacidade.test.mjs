import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

/**
 * Guarda o head estático de `/privacidade`.
 *
 * O `index.html` do Vite é um só e sempre traz o título/canonical da home; o head da
 * política existe porque `scripts/gerar-rota-privacidade.mjs` clona esse arquivo no
 * fim do build. Se esse passo sair do `npm run build` — ou se alguém mexer no
 * `index.html` sem atualizar as substituições — a página volta a se anunciar como a
 * home para scrapers que não executam JS, sem nenhum erro visível. Este teste falha
 * nesse caso.
 *
 * Requer build prévio: `npm run build` (o `npm run check` já roda na ordem certa).
 */

const POLITICA = new URL("../dist/privacidade/index.html", import.meta.url);
const HOME = new URL("../dist/index.html", import.meta.url);

const TITULO_POLITICA = "Política de Privacidade – JÁ Benefícios";
const CANONICAL_POLITICA = "https://jadigital.com.br/privacidade";

function lerHtml(url, rotulo) {
  assert.ok(
    existsSync(url),
    `${rotulo} não encontrado. Rode \`npm run build\` antes deste teste (` +
      "`dist/privacidade/index.html` é gerado no fim do build).",
  );
  return readFileSync(url, "utf8");
}

/** Valor capturado pelo grupo 1, ou `undefined` quando a tag não existe. */
function capturar(html, padrao) {
  return html.match(padrao)?.[1];
}

test("/privacidade publica título e canonical próprios no HTML estático", () => {
  const html = lerHtml(POLITICA, "dist/privacidade/index.html");

  assert.equal(
    capturar(html, /<title>([^<]*)<\/title>/),
    TITULO_POLITICA,
    "o <title> de /privacidade perdeu o próprio texto",
  );

  assert.equal(
    capturar(html, /<link rel="canonical" href="([^"]*)"/),
    CANONICAL_POLITICA,
    "o canonical de /privacidade não aponta para a própria URL",
  );

  // Scrapers de WhatsApp/LinkedIn leem OpenGraph, não o runtime.
  assert.equal(
    capturar(html, /<meta property="og:url" content="([^"]*)"/),
    CANONICAL_POLITICA,
    "og:url de /privacidade diverge do canonical",
  );

  assert.equal(
    capturar(html, /<meta property="og:title" content="([^"]*)"/),
    TITULO_POLITICA,
    "og:title de /privacidade perdeu o próprio texto",
  );
});

test("/privacidade não herda os metadados da home", () => {
  const politica = lerHtml(POLITICA, "dist/privacidade/index.html");
  const home = lerHtml(HOME, "dist/index.html");

  const tituloHome = capturar(home, /<title>([^<]*)<\/title>/);
  const canonicalHome = capturar(home, /<link rel="canonical" href="([^"]*)"/);

  assert.ok(tituloHome, "dist/index.html está sem <title>");
  assert.ok(canonicalHome, "dist/index.html está sem canonical");

  assert.notEqual(
    capturar(politica, /<title>([^<]*)<\/title>/),
    tituloHome,
    "/privacidade está anunciando o título da home",
  );

  assert.notEqual(
    capturar(politica, /<link rel="canonical" href="([^"]*)"/),
    canonicalHome,
    "/privacidade está declarando a home como canônica",
  );
});
