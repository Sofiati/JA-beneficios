# Crítica de hero — JA-beneficios × JA-digital

Data: 2026-09-30 · Autor: revisão de QA/crítica visual + auditoria de contraste/a11y
Evidências "antes/depois" (`hero-critique-*` e `hero-proposta-*`) foram removidas no
saneamento de 2026-10-06 — screenshots obsoletos da evolução do hero; os achados e a
validação numérica seguem abaixo.
Detalhe do mock: `../design-references/hero-card-mock-detail-1366x768.png`

## 1. Achados (antes)

1. **CTA fora da primeira dobra (JA-digital)** — o mock do cartão vinha antes do
   formulário; no mobile 390×664 a CTA caía para ~900px, exigindo scroll.
2. **Contrastes abaixo de 4,5:1 para texto normal:**
   - `#FE6600` (laranja de marca) sobre creme `#F8F7F3` ≈ **1,81:1**
     (eyebrow, `.hl`, links, textos de destaque);
   - `#F4AD00` (amarelo) sobre creme ≈ **2,95:1** (eyebrow amarela, tags);
   - `#FE6600` como anel de foco / borda sobre fundo claro ≈ **2,75:1**
     (falha WCAG 1.4.11, que exige 3:1 para indicador de foco).
3. **Sobreposição no mock do cartão (JA-beneficios)** — `.card-number`
   (`bottom:44px`) × `.card-tag` (`bottom:82px`, `font-size:.6rem`) colavam em
   larguras estreitas; bbox rotacionado (`rotate(-6deg)`) gerava falso positivo
   de colisão em auditoria automatizada, mas o respiro real era < 8px.
4. **Foco invisível** — `outline:none` no input do hero sem `:focus-visible`
   de reposição (falha WCAG 2.4.7).
5. **Mock lido por leitor de tela** — `.hero-art` / cartão decorativo sem
   `aria-hidden`, poluindo a árvore de acessibilidade (o conteúdo real já está
   nas seções de categorias/benefícios).
6. **Sem `prefers-reduced-motion`** — flutuação do cartão (`cardFloat 6s
   infinite`) e `scroll-behavior:smooth` sem respeito à preferência do sistema.

## 2. Correções aplicadas (itens 1–4)

| # | Correção | JA-beneficios | JA-digital |
|---|----------|---------------|------------|
| 1 | Contraste: token escurecido `--orange-strong:#B34700` (≈ **5,1:1** com rótulo branco; texto sobre creme ≥ 4,5:1). Laranja de marca restrito a decorativo (gradientes/brilhos, só 3:1) | `src/style.css` | `src/styles/globals.css` (`--color-ja-digital-orange-strong`), `App.tsx`, `lead-form.tsx`, `site-header.tsx`, `testimonials.tsx` |
| 2 | Conversão antes do mock no JA-digital (form `mt-9` antes do cartão; cartão `h-44/sm:h-52`) | n/a (form já primeiro) | `src/App.tsx` |
| 3 | `:focus-visible` global (anel 2px `var(--orange-strong)` / `var(--ring)`), `aria-hidden="true"` nos mocks, bloco `prefers-reduced-motion` no CSS + `main.ts` respeitando a preferência no carrossel automático e no `scrollIntoView` | `src/style.css`, `src/main.ts`, `index.html` | `src/styles/globals.css`, `src/App.tsx` |
| 4 | Respiro `.card-number`/`.card-tag` (número com `padding-bottom:34px` + tag `margin-top:8px`, `line-height:1.3`; medição sem rotação) + `min-width` do input 180px→200px | `src/style.css` | — |
| 5 | Resíduos re-scan: `dash-foot`/`quote footer span` → `--orange-strong`; hover de link no rodapé escuro → `--cream`; eyebrow pill `bg-primary/10` → `orange-strong/10`; `<u>` do H2 escuro → `.hl-underline` (mesmo amarelo decorativo, sem semântica de link) | `src/style.css`, `index.html` | `App.tsx` |

Detalhes: `.eyebrow--yellow` e destaques amarelos viraram `--brown`
(`#99440A`); `.form-ok` no CTA final (fundo `--brown-dark`) virou `--cream`
(antes `--yellow`, ~2,9:1 sobre escuro → agora ≥ 9:1); `--ring` do JA-digital
virou `#b34700` (≥ 3:1 contra o fundo).

## 3. Validação

- `npm run check` passa nos dois projetos (JA-beneficios: Vite build ~80–130ms;
  JA-digital: `tsc --noEmit` + Vite build).
- Re-capturas desktop 1366×768 e mobile 390×664 com sufixo `-after` nas pastas
  `docs/design-references/` de cada projeto (convenção documentada em
  `JA-beneficios/AGENTS.md` e `JA-digital/AGENTS.md`). Medições pós-fix
  (preview build, 01/10/2026): JA-beneficios CTA desktop top 541px /
  mobile botão top 514px com cartão só em 959px (conversão antes do mock);
  JA-digital form top 386px / CTA top 446px desktop e 520px mobile, com
  anel de foco `rgb(179,71,0) 2px` nos dois inputs.
- Nenhum screenshot em `Downloads` ou na raiz do repositório.
