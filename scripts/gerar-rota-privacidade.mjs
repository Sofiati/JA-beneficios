/**
 * Gera `dist/privacidade/index.html` — a política com head próprio.
 *
 * Por quê: `/privacidade` é uma rota do SPA (`src/App.tsx`), então o `index.html`
 * do Vite sempre traz o título e o canonical da home. Crawlers de rede social e
 * buscadores que não executam JS leriam os metadados errados. Este passo clona o
 * HTML buildado e troca só as tags de SEO da rota, mantendo o mesmo bundle.
 *
 * Roda no fim de `npm run build`. Se alguma tag esperada sumir do `index.html`,
 * o build falha em vez de publicar a página com o título da home.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const ENTRADA = `${RAIZ}dist/index.html`;
const SAIDA = `${RAIZ}dist/privacidade/index.html`;

const TITULO = "Política de Privacidade – JÁ Benefícios";
const DESCRICAO =
  "Saiba como a JÁ Benefícios coleta, utiliza, armazena e protege seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).";
const URL_POLITICA = "https://jadigital.com.br/privacidade";

/** Cada par precisa existir no `dist/index.html`; senão o build para. */
const TROCAS = [
  {
    de: "<title>JÁ Benefícios: todos os benefícios em um só cartão</title>",
    para: `<title>${TITULO}</title>`,
  },
  {
    de: '<meta name="description" content="Mais autonomia para colaboradores e praticidade para o RH. Centralize refeição, alimentação, mobilidade e saúde no cartão JÁ Benefícios.">',
    para: `<meta name="description" content="${DESCRICAO}">`,
  },
  {
    de: '<link rel="canonical" href="https://jadigital.com.br/">',
    para: `<link rel="canonical" href="${URL_POLITICA}">`,
  },
  {
    de: '<meta property="og:title" content="JÁ Benefícios – Todos os benefícios do seu time em um só cartão">',
    para: `<meta property="og:title" content="${TITULO}">`,
  },
  {
    de: '<meta property="og:description" content="Mais autonomia para colaboradores e praticidade para o RH. Centralize refeição, alimentação, mobilidade e saúde no cartão JÁ Benefícios.">',
    para: `<meta property="og:description" content="${DESCRICAO}">`,
  },
  {
    de: '<meta property="og:url" content="https://jadigital.com.br/">',
    para: `<meta property="og:url" content="${URL_POLITICA}">`,
  },
  {
    de: '<meta name="twitter:title" content="JÁ Benefícios – Todos os benefícios do seu time em um só cartão">',
    para: `<meta name="twitter:title" content="${TITULO}">`,
  },
  {
    de: '<meta name="twitter:description" content="Mais autonomia para colaboradores e praticidade para o RH. Centralize refeição, alimentação, mobilidade e saúde no cartão JÁ Benefícios.">',
    para: `<meta name="twitter:description" content="${DESCRICAO}">`,
  },
];

let html = readFileSync(ENTRADA, "utf8");

for (const troca of TROCAS) {
  if (!html.includes(troca.de)) {
    throw new Error(
      `gerar-rota-privacidade: tag não encontrada em dist/index.html:\n  ${troca.de}\n` +
        "Atualize este script junto com o index.html.",
    );
  }
  html = html.split(troca.de).join(troca.para);
}

mkdirSync(`${RAIZ}dist/privacidade`, { recursive: true });
writeFileSync(SAIDA, html);
console.log(`dist/privacidade/index.html: ${(html.length / 1024).toFixed(1)} KB — head da política`);
