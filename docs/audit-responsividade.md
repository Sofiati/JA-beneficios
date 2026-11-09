# Audit de Responsividade Aprimorada — JA-benefícios

Rastreio do audit executado com o prompt **Frontend Developer Agent Role**
(prompts.chat `cmmx2v9se0008il0457s2rkgz`), adaptado às regras do projeto
(CSS puro com tokens, breakpoints 900/520, verificação via `npm run check`).

Método: Vite dev + Playwright em 15 viewports (320→2560) — overflow horizontal,
alvos de toque, texto cortado, `scrollWidth` da página, screenshots de evidência
em `docs/design-references/audit-*.png`.

## Contexto
- Stack: Vite 5 + React 19 + CSS puro (tokens em `src/styles/base.css`)
- Verificação: `npm run check` (typecheck + build + auditoria de cores)

## Itens encontrados e corrigidos (FE-ITEM-1.x)

- [x] **FE-ITEM-1.1 Header estoura a viewport em 320px** (`src/style.css`)
  - Sintoma: `scrollWidth` 322px vs 305px úteis; hamburger cortado (flex reduzia o `.nav-toggle` a 24px).
  - Fix: `flex-shrink:0` no toggle + compactação em `≤360px` (gaps 8px, logo 56px, padding do CTA 14px, seta `btn-arrow` oculta).
- [x] **FE-ITEM-1.2 Alvos de toque < 44px no header e footer** (`src/style.css`)
  - Busca do header 38px → área invisível `::after` até 44px; links do painel de nav 41→49px (`padding:11px 0`); links do footer 36→44px; ícones sociais + `::after` (44px); links do rodapé inferior com `::after` de −10px (áreas 20px afastadas, sem sobreposição).
- [x] **FE-ITEM-1.3 Link inline do consentimento < 24px** (WCAG 2.5.8)
  - "Política de Privacidade" 16px → `::after{inset:-6px}` ⇒ alvo 30×155px, sem mudar o fluxo do texto.
- [x] **FE-ITEM-1.4 Inputs < 16px causam zoom automático no iOS ao focar**
  - Todos os campos (e-mail hero, formulário Custo Zero, CTA final, busca e input do Assistente JÁ) agora `font-size:1rem/16px`; `.cta-input` ganhou `min-height:48px`.
- [x] **FE-ITEM-1.5 FABs ignoravam a área segura do iPhone** (`src/style.css`, `src/chat.css`, `index.html`)
  - `env(safe-area-inset-bottom)` somado aos deslocamentos de `.whatsapp-fab`, `.ja-chat-launch`, `.ja-chat-panel` e `.to-top`; `viewport-fit=cover` no meta viewport.

## Não corrigido (intencional)
- `.zero-art--left` com `left:-4%`: arte decorativa sangrada, contida por `overflow:hidden` em `#custo-zero`.
- Mask do hero em ≥1440px (`left:-15px`): fade proposital da arte.
- "Assistente JÁ" fixo sobrepondo conteúdo no meio da página: comportamento de widget flutuante; o projeto já o recua sobre formulário e faixa de links do rodapé.
- Breakpoints existentes fora da dupla 900/520 (1150/767/640/600/345): outliers já documentados no CSS; unificação ficou fora do escopo deste audit.

## Verificação (QA Task Checklist)
- [x] Overflow horizontal = 0 em 320/345/360/390/520/600/640/768/900/1024/1150/1280/1440/1680/2560
- [x] Alvos de toque < 24px: apenas checkbox cujo `<label>` de linha inteira é o alvo
- [x] Menu mobile: links ≥ 44px de altura
- [x] `npm run check` verde: typecheck + build + 0 violação de paleta/contraste/tokens/assets
- [x] Evidências visuais em `docs/design-references/audit-*.png` (320px e 360px, antes/depois)
