/**
 * Retonalização do hero — Fase 3 do plano de conformidade de cores.
 *
 * Lê assets-fonte/hero-clean.png (plum profundo), mapeia tons de plum para a uva
 * oficial #732E4A, e gera variantes A (atual) e B (retonalizada) em 1440 px
 * e 390 px de largura, salvando em docs/design-references/.
 *
 * Sem dependências de imagem: usa scripts/lib/png.mjs (decode) e
 * scripts/lib/png-encode.mjs (encode), ambos sobre node:zlib + node:fs.
 *
 * Uso:
 *   node scripts/retonalizar-hero.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { decodePng } from "./lib/png.mjs";
import { encodePng } from "./lib/png-encode.mjs";

/* ------------------------------------------------------------------ */
/* Cores de referência                                                */
/* ------------------------------------------------------------------ */

// Tons de plum observados no hero (da auditoria)
const PLUM_TONS = [
  { hex: "#43022D", uva: "#5A2339" }, // plum escuro  -> uva-escuro
  { hex: "#5C013B", uva: "#732E4A" }, // plum médio   -> uva oficial
  { hex: "#5D013C", uva: "#732E4A" }, // plum medida  -> uva oficial
  { hex: "#76043E", uva: "#732E4A" }, // plum claro   -> uva oficial
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function distEuclidiana(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/* ------------------------------------------------------------------ */
/* Retonalização de um pixel                                          */
/* ------------------------------------------------------------------ */

/**
 * Se o pixel estiver próximo de um tom de plum, retorna o tom de uva
 * correspondente. Senão, retorna null (mantém o pixel original).
 */
function retonalizarPixel(r, g, b, tolerancia = 40) {
  let melhorDist = Infinity;
  let melhorUva = null;

  for (const t of PLUM_TONS) {
    const [pr, pg, pb] = hexToRgb(t.hex);
    const d = distEuclidiana(r, g, b, pr, pg, pb);
    if (d < melhorDist) {
      melhorDist = d;
      melhorUva = t.uva;
    }
  }

  if (melhorDist <= tolerancia) {
    return hexToRgb(melhorUva);
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Downscale simples (amostragem por média de bloco)                  */
/* ------------------------------------------------------------------ */

function downscale(pixels, w, h, targetW) {
  const targetH = Math.max(1, Math.round((h * targetW) / w));
  const out = new Uint8Array(targetW * targetH * 3);

  const xScale = w / targetW;
  const yScale = h / targetH;

  for (let ty = 0; ty < targetH; ty += 1) {
    const sy0 = Math.floor(ty * yScale);
    const sy1 = Math.min(h, Math.ceil((ty + 1) * yScale));
    for (let tx = 0; tx < targetW; tx += 1) {
      const sx0 = Math.floor(tx * xScale);
      const sx1 = Math.min(w, Math.ceil((tx + 1) * xScale));

      let r = 0, g = 0, b = 0, n = 0;
      for (let y = sy0; y < sy1; y += 1) {
        for (let x = sx0; x < sx1; x += 1) {
          const i = (y * w + x) * 3;
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          n += 1;
        }
      }
      const oi = (ty * targetW + tx) * 3;
      out[oi] = Math.round(r / n);
      out[oi + 1] = Math.round(g / n);
      out[oi + 2] = Math.round(b / n);
    }
  }

  return { pixels: out, w: targetW, h: targetH };
}

/* ------------------------------------------------------------------ */
/* Leitura / gravação                                                 */
/* ------------------------------------------------------------------ */

function lerPNG(caminho) {
  const buf = readFileSync(caminho);
  return decodePng(buf);
}

function salvarPNG(pixels, w, h, caminho) {
  const png = encodePng(pixels, w, h);
  writeFileSync(caminho, png);
  const mb = (png.length / 1048576).toFixed(2);
  console.log(`  salvo: ${caminho} (${w}x${h}, ${mb} MB)`);
}

/* ------------------------------------------------------------------ */
/* Geração de variantes                                               */
/* ------------------------------------------------------------------ */

function gerarVariante(pixels, w, h, nomeBase, targetW, retonalizar = false) {
  const { pixels: ds, w: dw, h: dh } = downscale(pixels, w, h, targetW);

  let finais = ds;
  if (retonalizar) {
    finais = new Uint8Array(ds.length);
    let modificados = 0;
    for (let i = 0; i < ds.length; i += 3) {
      const nova = retonalizarPixel(ds[i], ds[i + 1], ds[i + 2]);
      if (nova) {
        finais[i] = nova[0];
        finais[i + 1] = nova[1];
        finais[i + 2] = nova[2];
        modificados += 1;
      } else {
        finais[i] = ds[i];
        finais[i + 1] = ds[i + 1];
        finais[i + 2] = ds[i + 2];
      }
    }
    console.log(`    pixels retonalizados: ${modificados} / ${ds.length / 3}`);
  }

  salvarPNG(finais, dw, dh, `docs/design-references/${nomeBase}-${targetW}.png`);
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  const SRC = "assets-fonte/hero-clean.png";
  const TAMANHOS = [1440, 390];

  console.log(`== Lendo ${SRC} ==`);
  const { width, height, pixels } = lerPNG(SRC);
  console.log(`  original: ${width}x${height}`);

  // Garante diretório de saída
  await new Promise((res, rej) => {
    import("node:fs/promises").then((fs) => {
      fs.mkdir("docs/design-references", { recursive: true }).then(res).catch(rej);
    });
  });

  for (const targetW of TAMANHOS) {
    console.log(`\n== Variante A (atual, sem retonalização) — ${targetW}px ==`);
    gerarVariante(pixels, width, height, "hero-varianteA-atual", targetW, false);

    console.log(`\n== Variante B (retonalizada para uva #732E4A) — ${targetW}px ==`);
    gerarVariante(pixels, width, height, "hero-varianteB-uva", targetW, true);
  }

  console.log("\n== Pronto. Variantes geradas em docs/design-references/ ==");
  console.log("  - hero-varianteA-atual-1440.png / -390.png");
  console.log("  - hero-varianteB-uva-1440.png   / -390.png");
}

main().catch((err) => {
  console.error("ERRO:", err);
  process.exit(1);
});
