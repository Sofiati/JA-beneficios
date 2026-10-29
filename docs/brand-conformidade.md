# Conformidade da marca — JA Benefícios × MANUAL JA BENEFICIOS AT1.pdf

Fonte: `C:\Users\elcio.sofiati\Downloads\MANUAL JA BENEFICIOS AT1.pdf` (6 páginas).
Data da validação: 01/10/2026. Escopo: `JA-beneficios/` (principal) + `JA-digital/` (referência).

## 1. Cores padrão (p.3) — HEX derivado do RGB do manual

| Cor | Pantone | RGB manual | HEX | Token |
|---|---|---|---|---|
| Mostarda | 123 C | R255 G199 B44 | `#FFC72C` | `--ja-mostarda` / `--yellow` / `--color-ja-digital-yellow` |
| Uva | 7642 C | R115 G46 B74 | `#732E4A` | `--ja-uva` / `--orange-strong` / `--primary` / `--color-ja-digital-orange` |
| Verde-água | 7465 C | R64 G193 B172 | `#40C1AC` | `--ja-verde` / `chart-3` |
| Cinza texto | Cool Gray 7 C | R151 G153 B155 | `#97999B` | `--ja-cinza` (referência; corpo usa `#333`/`#5C564E` por AA) |

Desvios justificados (registrados, não silenciosos):
- **Ação em uva `#732E4A`** em vez de mostarda/verde para texto/fundo: mostarda sobre branco ≈1,6:1 e
  verde ≈2,1:1 reprovam WCAG; uva sobre creme ≈8,2:1. Amparado por p.5 —
  `aplicar sempre a versão que ofereça melhor legibilidade`.
- **Uva-escuro `#5A2339`** como hover/focus/footer: variação funcional da uva para manter AA em
  estados interativos; nunca como cor de marca isolada.
- **Fundo neutro `#F8F7F3/#F3EFE7` + branco `#fff`**: `#F8F7F3` como base funcional lida a partir do `fundo neutro` da versao positiva (p.2, sem especificacao no manual — extensao, nao cor oficial); branco como neutro de alternancia; `#F3EFE7` restrito à seção alternada (`--color-background-alt`). Ritmo validado 13/10/2026.
- **Preto `#333` no corpo**: `preto não recomendado` refere-se à comunicação da marca; corpo usa
  cinza-escuro por legibilidade, com cinza oficial reservado a detalhes.
- **Borda de controle `#8B857B`** (`--color-border-control`): neutro quente derivado da escala
  `neutral-*`, usado só na fronteira de `<input>`/botão para atender WCAG 1.4.11 (≥3:1 contra
  branco e `#F8F7F3` — mede 3,66:1 e 3,41:1). Separação decorativa continua em `--neutral-200`
  (`#E5E0D6`), fora do escopo de 1.4.11. Registrado em `scripts/audit-cores.mjs` (`FUNCTIONAL`).
- **Tinta de sombra do painel `#24121C`** (`--shadow-panel-ink`): neutro escuro de baixa saturação,
  usado só na sombra do painel do assistente, sobre fundo claro. Substitui o literal `#24121c44` e
  mantém a sombra neutra (sem o viés quente de `--shadow-ink`, reservado às sombras de card).
  Registrado em `scripts/audit-cores.mjs` (`FUNCTIONAL`) e em `EXPECTED_TOKENS`.

## 2. Marca (p.2) — arquivos

| Uso | Arquivo | Regra |
|---|---|---|
| Header / fundo claro | `public/logo-ja-positivo.svg` (JÁ uva + benefícios verde) | positiva sobre neutro |
| Footer / CTA / vida (fundo uva) | `public/logo-ja-negativo.svg` (JÁ mostarda + benefícios verde) | negativa compondo layout |
| Fundo fora do universo / redução ≤5mm | `public/logo-ja-especial-branco.svg` (100% branco) | especial negativa |
| Favicon | `public/logo-ja-monogram.svg` (monograma) | monograma restrito ao favicon |

Regras aplicadas: `BENEFÍCIOS sempre abaixo de JÁ`, sem distorção (`height:auto`), área de
segurança = largura do acento do ã (padding do chip), redução preferencial ≥18,5mm
(`78px/132px` no web atendem), especial só ≤5mm.

## 3. Tipografia (p.4)

- Preferencial: **Nexa Slab** (THIN→BLACK). Requer licença e nenhum arquivo é distribuído aqui;
  enquanto indisponível, títulos usam **Arvo** (Apache-2.0, self-host `public/fonts/`,
  evidência `design-references/font-compare-h1-560x1827.png`) e corpo usa a
  **secundária autorizada para HTML: Trebuchet MS** — `:root --font-body/--font-display`.
- Google Fonts (Sora/Fraunces) removido do `JA-beneficios/index.html`; Arvo é servido
  localmente (nenhum request externo de fonte).
- Corridos com alinhamento à esquerda (hero centralizado = pendência conhecida, ver §5).

## 4. Uso incorreto (p.5) — checklist

- [x] Não mudar ordem (JÁ acima, benefícios abaixo) — SVGs novos.
- [x] Não distorcer — `height:auto`, `viewBox` preservado.
- [x] Não invadir distância mínima — chip com padding.
- [x] Melhor legibilidade — uva para texto/ação, mostarda/verde para marca/grafismo.
- [x] Não trocar cores — tokens mapeados 1:1 do RGB manual.
- [x] Critérios p.2-3 — tabela de versões acima.

## 5. Pendências (próxima iteração)

0. **Desvio de plum nos assets visuais** — o hero (`assets-fonte/hero-clean.png`) e o mockup do
   cartão (`assets-fonte/mockup-cartao-clean.png`) usam um tom ameixa profundo (`#5D013C`,
   `#76043E`) **fora** da uva oficial `#732E4A` (distância de 26 a 94 pontos RGB). Medição
   canônica e plano de correção em `docs/correcao-conformidade-cores.md` §1.2.
1. ~~Vetor oficial da agência~~ **concluído**: lockup extraído em vetor da página 2 do
   manual (`MANUAL JA BENEFICIOS AT1.pdf`, via PyMuPDF) — substituiu o
   `<text>benefícios</text>` provisório por paths oficiais em todos os
   `public/logo-ja-*.svg` (geometria da marca; cores = tokens Pantone).
2. Hero/corridos centralizados → alinhar à esquerda onde for texto corrido.
3. `plastico_AT3.pdf` (cartão) — confrontar mock com arte oficial.
4. ~~Remover `logo-ja.svg` legado + `backup-ja-digital*.zip` do fluxo ativo~~ **concluído**.
5. Adquirir/licenciar Nexa Slab p/ títulos; hoje Arvo (Apache-2.0) como display e
   Trebuchet MS no corpo — conforme §3.

## 6. Ferramenta de verificação

`npm run audit:cores` (integrado ao `npm run check`) audita, de forma reproduzível:

- hexadecimais fora da paleta oficial em `index.html`, `src/styles/base.css`,
  `src/style.css`, `src/components/*.tsx` e `src/mail.ts`;
- contraste WCAG 2.1 dos pares de cor efetivamente usados;
- tokens de cor declarados e nunca consumidos;
- assets de `public/` sem referência no código.

Mapeia-se a esta tabela por meio dos tokens `--ja-mostarda`, `--ja-uva`, `--ja-uva-escuro`,
`--ja-verde`, `--ja-cinza` e dos tokens funcionais. O cinza oficial `--ja-cinza` é
**reservado** (referência de marca), não cor ativa — por isso não é reportado como token
morto. Ver `docs/correcao-conformidade-cores.md` para o plano completo.
