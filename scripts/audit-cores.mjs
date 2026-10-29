/**
 * Auditoria de conformidade de cores — JA Benefícios.
 *
 * Verifica três frentes:
 *  1. Paleta: hexadecimais hardcoded fora dos tokens autorizados (com exceções
 *     justificadas em `docs/brand-conformidade.md`).
 *  2. Contraste WCAG 2.1 dos pares de foreground/background realmente usados.
 *  3. Assets: cor dominante de PNGs, confrontada com a paleta oficial.
 *
 * Uso:
 *   node scripts/audit-cores.mjs
 *   node scripts/audit-cores.mjs --asset assets-fonte/hero-clean.png
 *
 * Sai com código 1 se houver violações (integrável ao `npm run check`).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { decodePng } from "./lib/png.mjs";

/** Cores oficiais (MANUAL JA BENEFICIOS AT1.pdf, p.3). */
const BRAND = {
  mostarda: "#FFC72C",
  uva: "#732E4A",
  verde: "#40C1AC",
  cinza: "#97999B",
};

/** Cores funcionais derivadas, registradas em `docs/brand-conformidade.md` §1. */
const FUNCTIONAL = {
  "uva-escuro": "#5A2339",
  "uva-100": "#E9D9E0",
  "border-control": "#8B857B",
  "neutral-white": "#FFFFFF",
  "neutral-black": "#000000",
  "neutral-50": "#F8F7F3",
  "neutral-100": "#F3EFE7",
  "neutral-200": "#E5E0D6",
  "neutral-700": "#5C564E",
  "neutral-900": "#333333",
  "error-100": "#FFC9C9",
  "shadow-ink": "#3C280A",
  "shadow-panel-ink": "#24121C",
  "backdrop-ink": "#2B1920",
  whatsapp: "#128C7E",
  "whatsapp-ink": "#07463E",
  "whatsapp-bubble": "#25D366",
};

/**
 * Hexadecimais permitidos fora dos tokens, com a justificativa registrada.
 * `texto: false` = uso apenas gráfico (exige 3:1, não 4.5:1).
 */
const ALLOWED = {
  "#25D366": { motivo: "cor oficial do WhatsApp (bolha do FAB)", texto: false },
};

const ALL_ALLOWED = new Set([
  ...Object.values(BRAND),
  ...Object.values(FUNCTIONAL),
  ...Object.keys(ALLOWED),
]);

/**
 * Pares de contraste avaliados. `min` segue WCAG 2.1:
 * 4.5 para texto normal, 3 para texto grande (>=18.66px bold / 24px).
 * `texto: false` = componente gráfico/UI (exige 3:1).
 */
const CONTRAST_PAIRS = [
  { fg: "#333333", bg: "#FFFFFF", uso: "corpo de texto sobre branco", min: 4.5 },
  { fg: "#333333", bg: "#F8F7F3", uso: "corpo de texto sobre fundo base", min: 4.5 },
  { fg: "#333333", bg: "#F3EFE7", uso: "corpo de texto sobre seção alternada", min: 4.5 },
  { fg: "#5C564E", bg: "#FFFFFF", uso: "texto secundário sobre branco", min: 4.5 },
  { fg: "#5C564E", bg: "#F8F7F3", uso: "texto secundário sobre fundo base", min: 4.5 },
  { fg: "#5C564E", bg: "#F3EFE7", uso: "texto secundário sobre seção alternada", min: 4.5 },
  { fg: "#FFFFFF", bg: "#732E4A", uso: "texto/ícone de botão primário sobre uva", min: 4.5 },
  { fg: "#FFFFFF", bg: "#5A2339", uso: "texto do footer e CTA sobre uva-escuro", min: 4.5 },
  { fg: "#E9D9E0", bg: "#5A2339", uso: "texto secundário do footer", min: 4.5 },
  { fg: "#E9D9E0", bg: "#732E4A", uso: "texto secundário sobre uva", min: 4.5 },
  { fg: "#5A2339", bg: "#FFC72C", uso: "texto sobre mostarda", min: 4.5 },
  { fg: "#5A2339", bg: "#40C1AC", uso: "texto sobre verde-água", min: 4.5 },
  { fg: "#333333", bg: "#FFC72C", uso: "texto sobre mostarda (chamada)", min: 4.5 },
  { fg: "#FFC9C9", bg: "#5A2339", uso: "erro de form sobre fundo escuro", min: 4.5 },
  { fg: "#8B857B", bg: "#FFFFFF", uso: "borda de controle (input/botão) sobre branco", min: 3, texto: false },
  { fg: "#8B857B", bg: "#F8F7F3", uso: "borda de controle (input/botão) sobre fundo base", min: 3, texto: false },
  { fg: "#128C7E", bg: "#FFFFFF", uso: "ícone do WhatsApp", min: 3, texto: false },
  { fg: "#07463E", bg: "#FFFFFF", uso: "texto do WhatsApp", min: 4.5 },
  { fg: "#40C1AC", bg: "#732E4A", uso: "marca sobre uva (gráfico)", min: 3, texto: false },
  { fg: "#FFC72C", bg: "#732E4A", uso: "marca sobre uva (gráfico)", min: 3, texto: false },
  { fg: "#FFC72C", bg: "#5A2339", uso: "marca sobre uva-escuro (gráfico)", min: 3, texto: false },
  { fg: "#40C1AC", bg: "#5A2339", uso: "marca sobre uva-escuro (gráfico)", min: 3, texto: false },
];

/*
 * Dois pares saíram da lista nesta rodada, ambos por escopo — não por cor:
 *  - `#97999B` (cinza oficial) nunca é consumido por `var(--ja-cinza)`; é um token
 *    reservado como referência de marca (`RESERVED_TOKENS`), logo não há par "em uso".
 *  - `#E5E0D6` (`--color-border`) só separa conteúdo (borda de card, divisor de
 *    lista, linha do rodapé do form). WCAG 1.4.11 cobre fronteira de componente
 *    e gráfico informativo, e nenhum dos dois se aplica a divisor decorativo.
 * As fronteiras reais de controle passaram a usar `--color-border-control` (#8B857B),
 * avaliado acima como par normativo.
 */

/** Arquivos de código varridos em busca de cores hardcoded e assets. */
const SCANNED_FILES = [
  "index.html",
  "src/styles/base.css",
  "src/style.css",
  "src/chat.css",
  "src/main.tsx",
  "src/App.tsx",
  "src/mail.ts",
  "src/components/Header.tsx",
  "src/components/Hero.tsx",
  "src/components/Proof.tsx",
  "src/components/Ecossistema.tsx",
  "src/components/Vantagens.tsx",
  "src/components/CustoZero.tsx",
  "src/components/Suporte.tsx",
  "src/components/FaqSection.tsx",
  "src/components/CtaFinal.tsx",
  "src/components/Footer.tsx",
  "src/components/PrivacyPolicy.tsx",
  "src/components/FloatingActions.tsx",
];

/**
 * Assets de `public/` sem referência no código, mas mantidos por decisão
 * documentada. A chave é o nome do arquivo; o valor é a justificativa.
 */
const ALLOWED_ORPHANS = {
  "LICENSE-arvo-apache-2.0.txt": "licença da fonte Arvo — deve acompanhar a fonte",
  "logo-ja-especial-branco.svg": "versão especial da marca (≤5mm) — `brand-conformidade.md` §2",
  "visa.svg": "marca de terceiros — manter no repositório",
  "preview.html": "galeria de ícones — referência de design",
  "robots.txt": "lido por crawlers, nunca referenciado no código — precisa ser servido em `/robots.txt`",
  "hero01-mobile.png": "fonte lossless do recorte mobile gerado por `npm run hero:mobile` (`scripts/gerar-hero-mobile.mjs`); o `.webp` em uso é derivado dele",
  "privacidade.html": "stub de compatibilidade: redireciona links antigos para `/#privacidade` (`PrivacyPolicy.tsx`)",
};

/**
 * Ícones em `public/icones/` aguardando aprovação de design: mantidos no
 * repositório, mas sem uso no fluxo atual.
 */
const PENDING_ICON_DIR = "public/icones/";

/**
 * Tokens de cor declarados e não consumidos, mantidos por decisão
 * documentada (referência da marca, não cor ativa).
 */
const RESERVED_TOKENS = {
  "--ja-cinza": "cinza oficial Cool Gray 7 C — reservado a detalhes (`brand-conformidade.md` §1)",
};

/**
 * Tokens de cor que devem existir em `:root` — usados para detectar tokens
 * declarados e nunca consumidos (dead token).
 */
const EXPECTED_TOKENS = [
  "--ja-mostarda",
  "--ja-uva",
  "--ja-uva-escuro",
  "--ja-verde",
  "--ja-cinza",
  "--neutral-white",
  "--neutral-black",
  "--neutral-50",
  "--neutral-100",
  "--neutral-200",
  "--neutral-700",
  "--neutral-900",
  "--uva-100",
  "--error-100",
  "--whatsapp",
  "--whatsapp-ink",
  "--shadow-panel-ink",
  "--backdrop-ink",
  "--shadow-ink",
];

/* ------------------------------------------------------------------ */
/* Utilidades de cor                                                   */
/* ------------------------------------------------------------------ */

/** Converte `#RGB`/`#RRGGBB` em [r, g, b]. */
function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Luminância relativa (WCAG 2.1). */
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores (1 a 21). */
export function contrastRatio(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Normaliza hex para caixa alta, expandindo a forma curta. */
function normalizeHex(hex) {
  let h = hex.replace("#", "").toUpperCase();
  if (h.length === 3) {
    h = h.split("").map((c) => c + c).join("");
  }
  return `#${h}`;
}

/** Distância euclidiana entre duas cores no espaço RGB. */
function colorDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return Math.sqrt(a.reduce((acc, v, i) => acc + (v - b[i]) ** 2, 0));
}


/* ------------------------------------------------------------------ */
/* Verificações                                                        */
/* ------------------------------------------------------------------ */

/** Procura hexadecimais fora da paleta nos arquivos de código. */
function auditPalette() {
  const violations = [];
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;

  for (const file of SCANNED_FILES) {
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const match of line.matchAll(hexPattern)) {
        const hex = normalizeHex(match[0]);
        if (hex.length !== 7 && hex.length !== 9) {
          continue;
        }
        if (ALL_ALLOWED.has(hex)) {
          continue;
        }
        const allowed = ALLOWED[hex];
        violations.push({
          file,
          linha: index + 1,
          hex,
          justificativa: allowed?.motivo ?? null,
        });
      }
    });
  }
  return violations;
}

/**
 * Mede a cobertura de um hex alvo dentro de um PNG.
 * Usado para reproduzir a medição canônica de plum do hero (#5D013C).
 *
 * @param {string} path
 * @param {string} hexAlvo
 * @param {number} tolerancia raio de tolerância no espaço RGB
 */
export function measureColor(path, hexAlvo, tolerancia = 8) {
  const { width, height, pixels } = decodePng(readFileSync(path));
  const alvo = hexToRgb(normalizeHex(hexAlvo));

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let n = 0;
  let exato = 0;
  let melhor = { d: Infinity, hex: null, x: 0, y: 0 };

  for (let i = 0; i < pixels.length; i += 3) {
    const d = Math.hypot(
      pixels[i] - alvo[0],
      pixels[i + 1] - alvo[1],
      pixels[i + 2] - alvo[2],
    );
    if (d < melhor.d) {
      const p = i / 3;
      melhor = {
        d,
        hex: normalizeHex(
          `#${[pixels[i], pixels[i + 1], pixels[i + 2]]
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("")}`,
        ),
        x: p % width,
        y: Math.floor(p / width),
      };
    }
    if (d === 0) {
      exato += 1;
    }
    if (d <= tolerancia) {
      const p = i / 3;
      const x = p % width;
      const y = Math.floor(p / width);
      n += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return {
    path,
    width,
    height,
    alvo: normalizeHex(hexAlvo),
    tolerancia,
    totalPixels: width * height,
    dentro: n,
    proporcao: n / (width * height),
    exatos: exato,
    bbox: n > 0 ? { minX, maxX, minY, maxY } : null,
    pixelMaisProximo: melhor,
  };
}

/**
 * Detecta assets de `public/` não referenciados por nenhum arquivo de código.
 * `@param {string[]} ignorados nomes de arquivo tratados como órfãos intencionais
 * @returns {{ path: string, kb: number }[]}
 */
function auditOrphanAssets() {
  const refs = [];
  for (const file of SCANNED_FILES) {
    try {
      refs.push(readFileSync(file, "utf8"));
    } catch {
      // arquivo ausente: segue sem a referência
    }
  }
  const corpus = refs.join("\n");

  let entries = [];
  try {
    entries = readdirSync("public", { withFileTypes: true, recursive: true });
  } catch {
    return [];
  }

  const orphans = [];
  const pendingIcons = [];
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    const rel = `public/${entry.parentPath.replace(/\\/g, "/")}/${entry.name}`.replace(
      "public/public/",
      "public/",
    );
    const nome = entry.name;
    if (ALLOWED_ORPHANS[nome]) {
      continue;
    }
    // Não considera referência o próprio nome do arquivo em outro asset.
    if (corpus.includes(rel) || corpus.includes(nome)) {
      continue;
    }
    // Ícones em `public/icones/` aguardam aprovação de design: são pendentes,
    // não órfãos — ficam em uma lista à parte.
    if (rel.startsWith(PENDING_ICON_DIR)) {
      pendingIcons.push({ path: rel, kb: Math.round(statSync(rel).size / 1024) });
      continue;
    }
    orphans.push({
      path: rel,
      kb: Math.round(statSync(rel).size / 1024),
    });
  }
  return { orphans: orphans.sort((a, b) => b.kb - a.kb), pendingIcons };
}

/**
 * Detecta tokens de cor declarados em `:root` e nunca consumidos.
 * Retorna a lista de tokens mortos.
 */
function auditUnusedTokens() {
  // O design system vive em `src/styles/base.css`; os estilos de seção em
  // `src/style.css` e os do assistente em `src/chat.css`. A declaração e o consumo
  // podem estar em arquivos distintos, então a análise roda sobre o CSS concatenado.
  const CSS_FILES = ["src/styles/base.css", "src/style.css", "src/chat.css"];
  let css = "";
  for (const file of CSS_FILES) {
    try {
      css += `${readFileSync(file, "utf8")}\n`;
    } catch {
      // Arquivo ausente não invalida a auditoria dos demais.
    }
  }
  if (!css) {
    return [];
  }

  const declared = [...css.matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*#[0-9a-fA-F]{3,8}\b/g)].map(
    (m) => m[1],
  );
  const unique = [...new Set(declared)];

  // Remove a própria linha de declaração para não contar o uso no `:root`.
  const semDeclaracoes = css.replace(/(--[a-zA-Z0-9-]+)\s*:\s*#[0-9a-fA-F]{3,8}\b/g, "");

  const tokens = unique.filter((token) => !semDeclaracoes.includes(`var(${token})`));
  return {
    mortos: tokens.filter((t) => !RESERVED_TOKENS[t]),
    reservados: tokens.filter((t) => RESERVED_TOKENS[t]),
  };
}

/** Avalia os pares de contraste definidos em `CONTRAST_PAIRS`. */
function auditContrast() {
  return CONTRAST_PAIRS.map((pair) => {
    const ratio = contrastRatio(pair.fg, pair.bg);
    return { ...pair, ratio, aprovado: ratio >= pair.min };
  });
}

/**
 * Mede as cores dominantes de um PNG e confronta com a paleta oficial.
 * Agrupa por canal de 8 bits para não fragmentar o histograma.
 */
export function auditAsset(path, topN = 8) {
  const { width, height, pixels } = decodePng(readFileSync(path));
  const counts = new Map();
  const total = width * height;

  for (let i = 0; i < pixels.length; i += 3) {
    const key =
      ((pixels[i] >> 3) << 10) | ((pixels[i + 1] >> 3) << 5) | (pixels[i + 2] >> 3);
    const entry = counts.get(key);
    if (entry) {
      entry.r += pixels[i];
      entry.g += pixels[i + 1];
      entry.b += pixels[i + 2];
      entry.n += 1;
    } else {
      counts.set(key, {
        r: pixels[i],
        g: pixels[i + 1],
        b: pixels[i + 2],
        n: 1,
      });
    }
  }

  const ranked = [...counts.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, topN)
    .map((entry) => {
      const hex = normalizeHex(
        `#${[entry.r, entry.g, entry.b]
          .map((v) => Math.round(v / entry.n).toString(16).padStart(2, "0"))
          .join("")}`,
      );
      const palette = Object.entries(BRAND).map(([name, brandHex]) => ({
        nome: name,
        hex: brandHex,
        dist: colorDistance(hex, brandHex),
      }));
      const nearest = palette.sort((a, b) => a.dist - b.dist)[0];
      return {
        hex,
        proporcao: entry.n / total,
        corMaisProxima: nearest.nome,
        hexOficial: nearest.hex,
        distancia: nearest.dist,
      };
    });

  return { path, width, height, cores: ranked };
}

/* ------------------------------------------------------------------ */
/* Relatório                                                           */
/* ------------------------------------------------------------------ */

function formatRatio(value) {
  return `${value.toFixed(2)}:1`;
}

function printPalette(violations) {
  console.log("\n== 1. Paleta — hexadecimais fora dos tokens ==");
  if (violations.length === 0) {
    console.log("  OK — nenhum hex fora da paleta oficial ou das exceções registradas.");
    return 0;
  }
  console.log(`  ${violations.length} ocorrência(s) não autorizada(s):`);
  for (const v of violations) {
    const nota = v.justificativa
      ? `justificativa: ${v.justificativa}`
      : "SEM justificativa registrada";
    console.log(`  - ${v.file}:${v.linha} ${v.hex} — ${nota}`);
  }
  return violations.length;
}

function printContrast(results) {
  console.log("\n== 2. Contraste WCAG 2.1 dos pares em uso ==");
  let failures = 0;
  let notes = 0;
  for (const r of results) {
    const status = r.aprovado ? "OK  " : r.normativo === false ? "AVISO" : "FALHA";
    const tipo = r.texto === false ? "gráfico" : "texto";
    console.log(
      `  [${status}] ${formatRatio(r.ratio).padEnd(8)} (min ${r.min}) ${tipo.padEnd(8)} ${r.uso}`,
    );
    if (!r.aprovado) {
      if (r.normativo === false) {
        notes += 1;
      } else {
        failures += 1;
      }
    }
  }
  if (notes > 0) {
    console.log(
      `  (${notes} aviso(s) informativo(s): pares fora de WCAG, mas sem função normativa.)`,
    );
  }
  return failures;
}

function printUnusedTokens({ mortos, reservados }) {
  console.log("\n== 3. Tokens de cor declarados e nunca usados ==");
  if (mortos.length === 0) {
    console.log("  OK — nenhum token de cor declarado ficou sem uso.");
  } else {
    console.log(`  ${mortos.length} token(s) morto(s):`);
    for (const t of mortos) {
      console.log(`  - ${t}`);
    }
  }
  if (reservados.length > 0) {
    console.log(`  ${reservados.length} token(s) reservado(s) por decisão documentada:`);
    for (const t of reservados) {
      console.log(`  - ${t} — ${RESERVED_TOKENS[t]}`);
    }
  }
  return mortos.length;
}

function printOrphans({ orphans, pendingIcons }) {
  console.log("\n== 4. Assets de public/ sem referência no código ==");
  if (orphans.length === 0) {
    console.log("  OK — nenhum asset órfão em public/.");
  } else {
    const totalMb = orphans.reduce((acc, o) => acc + o.kb, 0) / 1024;
    console.log(`  ${orphans.length} asset(s) órfão(s), ${totalMb.toFixed(1)} MB sem uso:`);
    for (const o of orphans) {
      console.log(`  - ${o.path} (${o.kb} KB)`);
    }
  }
  if (pendingIcons.length > 0) {
    console.log(
      `  ${pendingIcons.length} ícone(s) pendente(s) de aprovação de design (não removíveis):`,
    );
    for (const p of pendingIcons) {
      console.log(`  - ${p.path}`);
    }
  }
  return orphans.length;
}

function printAsset(report) {
  console.log(`\n== 3. Asset — ${report.path} (${report.width}x${report.height}) ==`);
  for (const c of report.cores) {
    const pct = (c.proporcao * 100).toFixed(2).padStart(6);
    const match =
      c.distancia <= 12
        ? `≈ ${c.corMaisProxima} ${c.hexOficial}`
        : `distante de ${c.corMaisProxima} ${c.hexOficial} (d=${c.distancia.toFixed(0)})`;
    console.log(`  ${pct}%  ${c.hex}  ${match}`);
  }
}

/* ------------------------------------------------------------------ */
/* Entrada                                                             */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const assetIndex = args.indexOf("--asset");
const findIndex = args.indexOf("--find");

if (findIndex !== -1) {
  const target = args[findIndex + 1];
  const hexAlvo = args[findIndex + 2];
  if (!target || !hexAlvo) {
    console.error("Uso: node scripts/audit-cores.mjs --find <caminho.png> <#HEX>");
    process.exit(2);
  }
  const m = measureColor(target, hexAlvo);
  console.log(`\n== Medição — ${m.path} (${m.width}x${m.height}) ==`);
  console.log(`  Alvo: ${m.alvo}  tolerância: ${m.tolerancia} (RGB euclidiano)`);
  console.log(
    `  Pixels no alvo: ${m.dentro} de ${m.totalPixels} (${(m.proporcao * 100).toFixed(2)}%)`,
  );
  console.log(`  Pixels exatamente iguais: ${m.exatos}`);
  console.log(
    `  Pixel mais próximo: ${m.pixelMaisProximo.hex} (d=${m.pixelMaisProximo.d.toFixed(2)}) em (${m.pixelMaisProximo.x}, ${m.pixelMaisProximo.y})`,
  );
  if (m.bbox) {
    console.log(
      `  BBox da ocorrência: x ${m.bbox.minX}..${m.bbox.maxX}, y ${m.bbox.minY}..${m.bbox.maxY}`,
    );
  }
  process.exit(0);
}

if (assetIndex !== -1) {
  const target = args[assetIndex + 1];
  if (!target) {
    console.error("Uso: node scripts/audit-cores.mjs --asset <caminho.png>");
    process.exit(2);
  }
  printAsset(auditAsset(target));
  process.exit(0);
}

const paletteViolations = printPalette(auditPalette());
const contrastFailures = printContrast(auditContrast());
const unusedTokens = printUnusedTokens(auditUnusedTokens());
const orphans = printOrphans(auditOrphanAssets());

console.log(
  `\nResumo: ${paletteViolations} violação(ões) de paleta, ${contrastFailures} falha(s) de contraste, ${unusedTokens} token(s) sem uso, ${orphans} asset(s) órfão(s).`,
);

process.exit(paletteViolations + contrastFailures > 0 ? 1 : 0);


