# JA-beneficios — projeto principal (React + TypeScript)

Landing page **JA Benefícios** em React 19 + Vite 5 + TypeScript estrito.
É o **projeto principal** do repositório: o clone fiel da página de benefícios corporativos,
com o conteúdo que vai para produção e total conformidade com o design system da marca JÁ Benefícios.

## Stack

- **Framework:** React 19 + Vite 5 (`@vitejs/plugin-react`)
- **Linguagem:** TypeScript estrito (`strict`, `noUnusedLocals`, `noUnusedParameters`), target ES2022
- **UI:** React componentes + CSS puro com design tokens em `:root`
- **Interações:** React hooks + IntersectionObserver para animações on-scroll
- **Fontes:** Trebuchet MS para HTML; Nexa Slab preferencial quando instalada. Sem download de fontes.
- **Node:** >= 24 (`.nvmrc`)

## Comandos

```bash
npm install
npm run dev          # servidor de desenvolvimento (http://0.0.0.0:5173)
npm run build        # tsc --noEmit && vite build  → dist/
npm run preview      # serve o dist/ localmente
npm run typecheck    # apenas o TypeScript (tsc --noEmit)
npm run check        # typecheck + build + auditoria de cores (rode antes de commitar)
npm run audit:cores  # paleta, contraste WCAG, tokens sem uso e assets órfãos
npm run deploy:zip   # build + gera deploy.zip com o conteúdo de dist/ na raiz
```

## Estrutura

```
index.html              # shell HTML com root div do React
src/main.tsx            # ponto de entrada do React (createRoot + import do CSS global)
src/App.tsx             # componente principal da aplicação e navegação de páginas
src/mail.ts             # envio de lead por e-mail (Web3Forms, fetch JSON)
src/styles/base.css     # design tokens em :root, @font-face, reset, foco e skip link
src/style.css           # estilos de componentes e seções (importa base.css)
src/chat.css            # estilos do assistente flutuante
src/components/
  ├── Header.tsx           # navegação principal e menu mobile
  ├── Hero.tsx             # banner principal do hero e benefícios em destaque
  ├── Proof.tsx            # prova social e métricas rápidas
  ├── Ecossistema.tsx      # vitrine do cartão e 16 categorias em 3 grupos
  ├── Vantagens.tsx        # rede aceita Visa e aplicativo móvel
  ├── CustoZero.tsx        # serviços com taxa zero e formulário de lead
  ├── Suporte.tsx          # cards para colaborador e RH com etapas
  ├── FaqSection.tsx       # central de dúvidas com accordion interativo
  ├── CtaFinal.tsx         # chamada final para contato commercial
  ├── Footer.tsx           # rodapé completo com links legais e institucionais
  ├── PrivacyPolicy.tsx    # visualização da política de privacidade do serviço
  └── FloatingActions.tsx  # botão voltar ao topo, FAB do WhatsApp e Assistente JÁ
public/                 # logos SVGs, imagens WebP, faq.json, chat-config.json, robots.txt
chat-worker/            # Cloudflare Worker do Assistente JÁ (FAQ + busca lexical + Gemini fallback)
assets-fonte/           # PNGs fonte lossless (fora de public/ — não vão ao dist; ver README local)
docs/                   # design system, conformidade de marca e evidências visuais
scripts/audit-cores.mjs # auditoria de conformidade de cores (paleta, WCAG, assets órfãos)
tsconfig.json           # TS estrito, react-jsx, noEmit, types: vite/client
vite.config.ts          # plugin React, porta 5173, outDir dist, sourcemap
```

## Design tokens

Definidos em `:root` no topo de `src/style.css` e reutilizados por todo o CSS:

| Token | Valor | Uso |
| --- | --- | --- |
| `--ja-mostarda` | `#FFC72C` | Marca/grafismo, destaques, underline |
| `--ja-uva` | `#732E4A` | Ação primária, botões, links, títulos |
| `--ja-uva-escuro` | `#5A2339` | Hover/sombra e faixas escuras |
| `--ja-verde` | `#40C1AC` | Segurança/placa no lockup e grafismo |
| `--ja-cinza` | `#97999B` | Cinza oficial |
| `--neutral-50` / `--neutral-100` | `#F8F7F3` / `#F3EFE7` | Fundos claro e alternado |
| `--neutral-900` | `#333333` | Texto principal |

## Envio de e-mail (Web3Forms)

O formulário do CTA final e de benefícios envia o lead por e-mail via [Web3Forms](https://web3forms.com) (API serverless com CORS no cliente, sem backend).
A lógica vive em `src/mail.ts` (`sendLeadEmail()`), integrada nos componentes React.
