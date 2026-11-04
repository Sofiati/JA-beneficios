/**
 * Gera a imagem de compartilhamento (Open Graph / Twitter) a partir da arte do hero.
 *
 * Por quê: WhatsApp, LinkedIn e Telegram não executam JavaScript, então a miniatura
 * precisa ser um arquivo estático servido pelo `index.html` — não dá para montar via
 * `useSEO`. O recorte é 1:1 na arte 1672×941 (sem reamostragem): pega a faixa da
 * direita, onde estão o casal e o cartão, e descarta a coluna de plum reservada ao
 * texto da headline (que ficaria vazia na miniatura).
 *
 * O recorte é feito pelo decodificador/encoder PNG do projeto; a compactação final
 * usa o `ffmpeg` (JPEG ~150 KB contra 1,5 MB do PNG). Miniatura de WhatsApp acima de
 * ~300 KB costuma falhar, e é justamente esse o canal que o arquivo atende — por isso
 * o ffmpeg é obrigatório aqui. Nenhuma dependência é adicionada ao bundle: só gera
 * o asset versionado em `public/`.
 *
 * Uso: node scripts/gerar-og-image.mjs [x0] [y0]
 *   x0  coluna inicial do recorte 1200×630 na arte 1672×941 (padrão 472 = alinhado à direita)
 *   y0  linha inicial do recorte (padrão 155 = centralizado na vertical)
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodePng } from "./lib/png.mjs";
import { encodePng } from "./lib/png-encode.mjs";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const SRC = `${RAIZ}assets-fonte/hero01.png`;
const OUT = `${RAIZ}public/og-image.jpg`;

const LARGURA = 1200;
const ALTURA = 630;

const x0 = Number(process.argv[2] ?? 472);
const y0 = Number(process.argv[3] ?? 155);

const { width, height, pixels } = decodePng(readFileSync(SRC));
if (x0 < 0 || y0 < 0 || x0 + LARGURA > width || y0 + ALTURA > height) {
  throw new Error(
    `Janela inválida: x0=${x0} y0=${y0} ${LARGURA}x${ALTURA} (arte tem ${width}x${height}).`,
  );
}

const out = new Uint8Array(LARGURA * ALTURA * 3);
for (let y = 0; y < ALTURA; y += 1) {
  const src = (y0 + y) * width * 3 + x0 * 3;
  const dst = y * LARGURA * 3;
  for (let x = 0; x < LARGURA * 3; x += 1) {
    out[dst + x] = pixels[src + x];
  }
}

const pastaTemp = mkdtempSync(join(tmpdir(), "og-image-"));
const png = join(pastaTemp, "recorte.png");

try {
  writeFileSync(png, encodePng(out, LARGURA, ALTURA));

  try {
    // -q:v 3 ≈ qualidade 90 do JPEG do ffmpeg; fica em ~150 KB (limite prático do WhatsApp).
    execFileSync(
      "ffmpeg",
      ["-hide_banner", "-loglevel", "error", "-y", "-i", png, "-q:v", "3", OUT],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
  } catch (erro) {
    const motivo = erro instanceof Error ? erro.message : String(erro);
    throw new Error(
      `ffmpeg indisponível para compactar o JPEG de compartilhamento (${motivo}).\n` +
        "Instale o ffmpeg no PATH e rode de novo: o PNG de 1200×630 fica em ~1,5 MB, " +
        "acima do limite prático de prévia do WhatsApp.",
    );
  }
} finally {
  rmSync(pastaTemp, { recursive: true, force: true });
}

const kb = Math.round(statSync(OUT).size / 1024);
console.log(
  `og-image.jpg: ${LARGURA}x${ALTURA}, ${kb} KB (recorte x∈[${x0}, ${x0 + LARGURA}], y∈[${y0}, ${y0 + ALTURA}])`,
);
