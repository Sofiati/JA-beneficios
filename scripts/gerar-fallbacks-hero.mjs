/**
 * Gera os fallbacks do hero para navegadores sem WebP.
 *
 * Por quê: o `<picture>` do Hero serve WebP primeiro. O fallback antigo era PNG —
 * formato errado para foto, que rendia 1,8 MB (desktop) e 1,6 MB (mobile) para um
 * público residual. Em JPEG, mesma arte e mesma resolução de exibição, o par fica
 * em ~120 KB e continua abrindo em qualquer navegador.
 *
 * O master lossless permanece em `assets-fonte/hero01.png`; aqui só se reduz a
 * cópia servida. Requer `ffmpeg` no PATH (as mesmas versões servem ao `og:image`).
 *
 * Uso: node scripts/gerar-fallbacks-hero.mjs
 *
 * Saídas:
 *   public/hero01.jpg         1040×585  (fallback desktop)
 *   public/hero01-mobile.jpg   600×692  (fallback do recorte mobile)
 */

import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const SRC = `${RAIZ}assets-fonte/hero01.png`;

/** Mesmo recorte do mobile usado por `gerar-hero-mobile.mjs`. */
const CORTE_MOBILE = { x0: 706, largura: 816 };

const SAIDAS = [
  {
    arquivo: "public/hero01.jpg",
    filtro: "scale=1040:585:flags=lanczos",
    dimensoes: "1040×585",
  },
  {
    arquivo: "public/hero01-mobile.jpg",
    filtro: `crop=${CORTE_MOBILE.largura}:941:${CORTE_MOBILE.x0}:0,scale=600:692:flags=lanczos`,
    dimensoes: "600×692",
  },
];

function rodarFfmpeg(argumentos, saida) {
  try {
    execFileSync("ffmpeg", argumentos, { stdio: ["ignore", "ignore", "pipe"] });
  } catch (erro) {
    if (erro.code === "ENOENT") {
      throw new Error(
        "ffmpeg não encontrado no PATH.\n" +
          "Instale (https://ffmpeg.org/download.html) ou pule este passo: os JPEGs já\n" +
          "versionados em public/ continuam válidos e o build não depende deles.",
      );
    }
    const detalhe = erro.stderr ? erro.stderr.toString().trim() : "";
    throw new Error(`ffmpeg falhou ao gerar ${saida}: ${detalhe || erro.message}`);
  }
}

for (const saida of SAIDAS) {
  rodarFfmpeg(
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      SRC,
      "-vf",
      saida.filtro,
      "-q:v",
      "3",
      `${RAIZ}${saida.arquivo}`,
    ],
    saida.arquivo,
  );
  const kb = Math.round(statSync(`${RAIZ}${saida.arquivo}`).size / 1024);
  console.log(`${saida.arquivo}: ${saida.dimensoes}, ${kb} KB`);
}
