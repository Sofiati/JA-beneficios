<!-- BEGIN:agent-rules -->

# Project conventions

Este é o **projeto principal** do repositório: uma landing page em **Vite 5 + React 19 +
TypeScript estrito + CSS puro**. O markup é composto por componentes React em `src/components/`
(a partir de `index.html` → `src/main.tsx` → `src/App.tsx`), os design tokens e estilos base em
`src/styles/base.css`, os estilos de seção em `src/style.css` e o assistente flutuante em
`src/chat.css`. Não há Tailwind, shadcn, CSS-in-JS nem SSR — nada de classes utilitárias.

Sempre rode `npm run check` antes de dar uma tarefa como concluída.

<!-- END:agent-rules -->

# JA-beneficios — convenções

**Sem afiliação** com a empresa
original — não copie conteúdo proprietário novo (imagens, vídeos, logos de terceiros) além do que já
está versionado.

## Stack e comandos

- **Build/dev:** Vite 5 (+ `@vitejs/plugin-react`) — `npm run dev` (porta 5173), `npm run build`,
  `npm run preview`
- **Checagens:** `npm run typecheck` (tsc --noEmit) e `npm run check` (typecheck + build +
  `npm run audit:cores`)
- **Auditoria de cores:** `npm run audit:cores` valida paleta, contraste WCAG, tokens sem uso e
  assets órfãos. Flags: `-- --asset <png>` (cores dominantes) e `-- --find <png> <#HEX>`
  (medição de um tom específico). Decodificador PNG próprio em `scripts/lib/png.mjs` —
  sem dependências de imagem.
- **Deploy:** `npm run deploy:zip` → `deploy.zip` com o conteúdo de `dist/` na raiz
- **Node:** >= 24 (`.nvmrc`, `engines` no `package.json`)

## Estrutura

```
index.html              # shell HTML com <div id="root"> + <script type="module" src="/src/main.tsx">
src/main.tsx            # entrypoint React (createRoot + import de style.css)
src/App.tsx             # composição das seções + navegação home/privacidade por hash
src/components/         # 13 componentes de seção (Header, Hero, Prova, Ecossistema, ...)
src/mail.ts             # envio de lead via Web3Forms (fetch JSON, modo demo sem chave)
src/styles/base.css     # design tokens em :root, @font-face, reset, foco, skip link
src/style.css           # estilos de componentes e seções (importa base.css)
src/chat.css            # estilos do assistente flutuante (importado por FloatingActions)
.env.example            # modelo da VITE_WEB3FORMS_KEY (real em .env.local, fora do Git)
public/logo-ja-positivo.svg  # lockup JÁ uva + benefícios verde (fundo claro)
public/logo-ja-negativo.svg  # lockup JÁ mostarda + benefícios verde (fundo uva)
public/logo-ja-especial-branco.svg  # versão especial 100% branca (fora do universo / ≤5mm)
public/logo-ja-monogram.svg  # monograma JÁ (uva) — somente favicon
public/hero01-mobile.png    # arte do hero no mobile (816×941) — recorte emoldurado no cartão e nos rostos
public/faq.json         # fonte única da FAQ (consumida pela UI e pelo chat-worker)
chat-worker/            # Cloudflare Worker do Assistente JÁ (ver chat-worker/README)
assets-fonte/           # PNGs fonte lossless (fora de `public/`, não vão ao dist): hero01, hero-clean,
                        # aceito, colaborador, rh, mockup-cartao-clean — ver assets-fonte/README.md
scripts/deploy-zip.mjs  # empacota dist/ em deploy.zip
scripts/audit-cores.mjs # auditoria de conformidade de cores (paleta, WCAG, assets órfãos)
scripts/gerar-hero-mobile.mjs # recorta public/hero01-mobile.png a partir de assets-fonte/hero01.png (npm run hero:mobile)
scripts/lib/png.mjs     # decodificador PNG sem dependências (usado pela auditoria)
docs/correcao-conformidade-cores.md # plano de correção de conformidade de cores
docs/design-references/ # evidências visuais (screenshots de crítica/QA)
```

## Evidências visuais (screenshots)

- Screenshots de QA/crítica **ficam dentro do projeto**, em `docs/design-references/` — nunca em
  `Downloads`, na raiz do repositório ou em pasta temporária (mesma convenção do
  `../JA-digital/docs/design-references/`).
- Nome em kebab-case minúsculo descrevendo tela + viewport medido, **sem timestamp**:
  `hero-logo-oficial-1366x768.png`, `hero-arvo-390x844.png`.
- Ao capturar via Playwright/MCP, aponte o destino para essa pasta (`downloadsDir`/`outputPath`) e
  remova o sufixo de data que a ferramenta acrescenta ao nome.

## Regras de código

- **TypeScript estrito, sem `any`.** Funções utilitárias recebem tipo de retorno explícito.
- **React com componentes funcionais e hooks.** Cada seção da página é um componente em
  `src/components/`; estado local com `useState`/`useRef` e efeitos com `useEffect`. Não acesse o
  DOM por `document.getElementById` fora do `src/main.tsx` (montagem do root) — prefira `ref` e
  estado. Interface de props sempre tipada (`interface Props`), sem `React.FC`.
- **Sem framework de UI.** Não introduza Tailwind, shadcn, CSS-in-JS, jQuery, GSAP etc. O CSS é
  puro, com tokens. `dependencies`/`devDependencies` novas exigem justificativa no PR.
- 2 espaços de indentação; aspas duplas; ponto e vírgula ao fim das instruções.
- CSS: kebab-case, variações com `--` (`hero-form--center`), tokens sempre via `var(--token)`
  — evite cores/espaçamentos hardcoded novos; reaproveite os tokens de `:root` (`src/styles/base.css`).
  Design system e estilos de seção vivem em arquivos separados: não volte a engordar um único CSS.
- Animações: use o atributo `[data-animate]` + classe `.visible` com `IntersectionObserver`;
  qualquer animação nova precisa continuar respeitando `prefers-reduced-motion`.

## Regras de conteúdo e marca

- Marca: **JA Benefícios** (nome), `JA BENEFÍCIOS` (uso em maiúsculas/wordmark) e `ja-beneficios` em
  identificadores, classes e nomes de arquivo.
- Copy em **pt-BR**, direta e próxima; sem claims com números sem fonte comprovada
  coerentes com as seções vizinhas.
- **Logo:** use os SVGs existentes: `logo-ja-positivo.svg` sobre fundo neutro e
  `logo-ja-negativo.svg` sobre uva. Preserve proporções e o nome acessível. Os SVGs são o
  vetor oficial extraído do manual de marca (p.2) — não recolorir nem reconstruir o wordmark.
  Consulte `docs/design-system.md` para limitações.

## Design principles

- **Fidelidade ao alvo** — espaçamento, cores e tipografia seguem a referência; nada de mudança
  estética pessoal sem pedido explícito.
- **Cor primeiro, texto depois** — a marca é a **uva `#732E4A`** (Pantone 7642 C); mostarda
  `#FFC72C` e verde-água `#40C1AC` são apoio. A laranja `#FE6600` e o amarelo `#F4AD00`
  pertencem à marca anterior e **não existem mais** no design system.
- **Toda cor nova passa por token** — não introduza hexadecimais literais em `index.html`,
  `src/styles/base.css`, `src/style.css`, `src/components/*.tsx` ou `src/mail.ts`; use
  `var(--token)`. O comando `npm run audit:cores` valida isso e roda dentro de `npm run check`.
- **Mobile-first** — valide sempre os breakpoints de 900px e 520px (`@media` no fim do CSS).
