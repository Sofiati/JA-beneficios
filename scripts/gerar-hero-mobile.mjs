/**
 * Gera a arte vertical do hero para mobile a partir do banner 16:9.
 *
 * Por quê: o hero desktop é uma arte 1672×941 cuja composição reserva a
 * esquerda em plum para o texto. Mostrar esse banner inteiro no mobile
 * encolhe o casal para ~220px de altura (ilegível). A alternativa — cortar a
 * foto no mobile via `object-fit:cover` — deixa o enquadramento a cargo de
 * `object-position`, que muda conforme a proporção da tela.
 *
 * A saída é um recorte vertical FRAMADO no sujeito (mão + cartão + os dois
 * rostos), com a proporção igual à da caixa mobile. Assim o `cover` não corta
 * nada em nenhuma largura de tela.
 *
 * Uso: node scripts/gerar-hero-mobile.mjs [x0] [largura]
 *   x0      coluna inicial do recorte na arte 1672×941 (padrão 706)
 *   largura largura do recorte em px (padrão 816)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { decodePng } from "./lib/png.mjs";
import { encodePng } from "./lib/png-encode.mjs";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
// Fonte lossless fora de `public/` (não vai ao dist); saída em `public/` vira .webp.
const SRC = `${RAIZ}assets-fonte/hero01.png`;
const OUT = `${RAIZ}public/hero01-mobile.png`;

const x0 = Number(process.argv[2] ?? 706);
const largura = Number(process.argv[3] ?? 816);

const { width, height, pixels } = decodePng(readFileSync(SRC));
if (x0 < 0 || x0 + largura > width) {
  throw new Error(`Janela inválida: x0=${x0} largura=${largura} (arte tem ${width}px).`);
}

const out = new Uint8Array(largura * height * 3);
for (let y = 0; y < height; y += 1) {
  const src = y * width * 3;
  const dst = y * largura * 3;
  for (let x = 0; x < largura; x += 1) {
    const s = src + (x0 + x) * 3;
    const d = dst + x * 3;
    out[d] = pixels[s];
    out[d + 1] = pixels[s + 1];
    out[d + 2] = pixels[s + 2];
  }
}

writeFileSync(OUT, encodePng(out, largura, height));
console.log(`hero01-mobile.png: ${largura}x${height} (recorte x∈[${x0}, ${x0 + largura}])`);
