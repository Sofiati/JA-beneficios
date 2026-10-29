---
name: JA Benefícios
description: Landing institucional de benefícios corporativos — convite acolhedor na paleta uva do manual JA
colors:
  uva-profunda: "#732E4A"
  uva-escuro: "#5A2339"
  uva-claro: "#E9D9E0"
  mostarda-solar: "#FFC72C"
  verde-agua: "#40C1AC"
  cinza-institucional: "#97999B"
  fundo-neutro: "#F8F7F3"
  superficie-branca: "#FFFFFF"
  tinta: "#333333"
  tinta-suave: "#5C564E"
  borda-suave: "#E5E0D6"
  erro-claro: "#FFC9C9"
  tinta-sombra: "#3C280A"
  tinta-backdrop: "#2B1920"
  whatsapp-teal: "#128C7E"
typography:
  display:
    fontFamily: "Arvo, 'Trebuchet MS', Verdana, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Arvo, 'Trebuchet MS', Verdana, sans-serif"
    fontSize: "clamp(1.7rem, 3.6vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Arvo, 'Trebuchet MS', Verdana, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Trebuchet MS', 'Nexa Slab', Verdana, sans-serif"
    fontSize: "clamp(15px, 0.95rem + 0.2vw, 17px)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Trebuchet MS', Verdana, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  card: "24px"
  card-sm: "18px"
  control: "40px"
  input: "12px"
spacing:
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.uva-profunda}"
    textColor: "{colors.superficie-branca}"
    rounded: "{rounded.control}"
    padding: "14px 30px"
  button-primary-hover:
    backgroundColor: "{colors.uva-escuro}"
    textColor: "{colors.superficie-branca}"
    rounded: "{rounded.control}"
  button-accent:
    backgroundColor: "{colors.mostarda-solar}"
    textColor: "{colors.uva-escuro}"
    rounded: "{rounded.control}"
    padding: "14px 30px"
  card:
    backgroundColor: "{colors.superficie-branca}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card-sm}"
  input-email:
    backgroundColor: "{colors.superficie-branca}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
---

# Design System: JA Benefícios

## Overview

**Creative North Star: "O Convite Acolhedor"**

Esta é uma landing de persuasão: o visitante decide e age, e o design é o produto
julgado. Cada seção é um convite — a oferta precisa ser inteligível e desejável em
uma leitura, a ação primária ("Quero JÁ!") precisa estar sempre visível, e o leitor
precisa encontrar ordem de leitura clara. A estrutura é a de uma marca corporativa
de RH: sóbria, confiável, sem cerimônia. O calor vem da cor (uva Pantone 7642 C)
e de uma voz de copy direta e próxima, não de enfeite.

O sistema obedece ao manual de marca JA (seis páginas, lido diretamente). As
quatro cores oficiais são primitivos intocáveis; estados, fundos, raios e
espaçamentos são extensões digitais documentadas, não invenções. A tipografia
display é **Arvo**, substituta livre e self-hosted da Nexa Slab licenciada; o
corpo é **Trebuchet MS**, alternativa autorizada pelo manual.

O que este sistema rejeita explicitamente: o visual da marca anterior (laranja
`#FE6600` e amarelo `#F4AD00` não existem mais), claims com números sem fonte
comprovada, o cinza oficial como texto corrido sobre claro, dependências de UI
novas (é HTML/CSS/TS puro), e qualquer mudança estética sem pedido explícito.

**Key Characteristics:**

- Paleta Pantone do manual aplicada por tokens semânticos em `:root`
- Slab serif (Arvo) nos títulos, humanista (Trebuchet MS) no corpo
- Ações em cápsula tátil (raio 40px) que sobem no hover; superfícies de canto generoso
- Movimento discreto e tokenizado (`--t-*`), sempre com `prefers-reduced-motion`
- Mobile-first, validado em 900px e 520px
- Acessibilidade construída: `:focus-visible` universal, contraste WCAG auditado

## Colors

Paleta quente e institucional: uva comanda a ação, mostarda e verde-água apoiam,
neutros quentes sustentam a leitura.

### Primary

- **Uva Profunda** (#732E4A): Pantone 7642 C — a cor da ação primária, dos links,
  dos títulos de destaque e do foco em superfícies claras. É a identidade da marca
  e o motivo pelo qual a página é reconhecível em uma dobra.

### Secondary

- **Mostarda Solar** (#FFC72C): Pantone 123 C — destaque de conversão (CTA amarelo,
  sublinhados `u`) e cor de foco em seções escuras. Sempre com
  texto uva-escuro sobre ela, nunca branco.

### Tertiary

- **Verde-Água** (#40C1AC): Pantone 7465 C — marca e decoração. Proibido como
  texto pequeno sobre branco; é cor de detalhe gráfico, não de leitura.

### Neutral

- **Fundo Neutro** (#F8F7F3): fundo padrão da página — off-white quente medido do
  layout existente.
- **Superfície Branca** (#FFFFFF): cards, formulário e superfícies elevadas.
- **Tinta** (#333333): corpo de texto — nunca cinza oficial.
- **Tinta Suave** (#5C564E): texto secundário e `lead`.
- **Borda Suave** (#E5E0D6): divisores e bordas de superfície.
- **Cinza Institucional** (#97999B): Cool Gray 7 C — detalhes gráficos apenas
  (2,86:1 sobre branco). Nunca texto corrido.
- **Uva Escuro** (#5A2339): estados hover da ação primária e fundo do rodapé.
- **Uva Claro** (#E9D9E0): texto sobre superfícies uva (rodapé, seções escuras).
- **Erro Claro** (#FFC9C9): texto de erro sobre fundo escuro. Em superfície
  clara vira faixa (`color-mix` 55% sobre a superfície) com texto Tinta — ver
  "A Regra do Erro na Superfície Clara".
- **Teal WhatsApp** (#128C7E) e **Tinta Sombra** (#3C280A, alfa via `color-mix`):
  exceções conscientes — identidade do canal de terceiro e tinta quente das sombras.

### Named Rules

**A Regra da Uva.** Uva é a única cor de ação primária da interface. Laranja e
amarelo da marca anterior estão proibidos em qualquer arquivo novo. Se a página
parece da marca anterior, a uva sumiu — corrija a uva, não acrescente cor.

**A Regra do Cinza.** O cinza oficial nunca é texto corrido sobre fundo claro
(2,86:1). Corpo usa Tinta; secundário usa Tinta Suave. Cinza é detalhe gráfico.

**A Regra da Exceção WhatsApp.** Teal e verde WhatsApp existem somente no FAB do
canal. Nunca migre essas cores para outro componente "porque combinam".

## Typography

**Display Font:** Arvo (fallback: Trebuchet MS, Verdana, sans-serif) — self-host,
Apache-2.0, em `public/fonts/`.
**Body Font:** Trebuchet MS (fallback: Nexa Slab, Verdana, sans-serif).
**Label Font:** Trebuchet MS em maiúsculas com tracking largo.

**Character:** A slab serif dá peso institucional aos títulos; o corpo humanista
mantém a leitura conversacional. O contraste entre as duas é a hierarquia — não
adicionar uma terceira família.

### Hierarchy

- **Display** (700, clamp(2.2rem, 5vw, 3.6rem), 1.15): H1 da página. Exceção
  documentada: o H1 do hero mede em `cqw` da arte 16:9 — não "corrigir" para clamp.
- **Headline** (700, clamp(1.7rem, 3.6vw, 2.5rem), 1.15): H2 de seção.
- **Title** (700, 1.2rem, 1.15): H3 de card e subseção.
- **Body** (400, clamp(15px, .95rem + .2vw, 17px), 1.6): leitura corrida; `lead`
  em 1.1rem na cor Tinta Suave.
- **Label** (600, .8rem, letter-spacing .12em, uppercase): eyebrows acima dos H2.

### Named Rules

**A Regra da Slab.** Títulos são sempre Arvo. A Nexa Slab do manual não é
distribuída aqui por licença; Verdana/sans-serif são fallback técnico, nunca
fidelidade. Não reconstruir o wordmark em CSS.

## Layout

Container central de 1200px (`--max`) com respiro fluido (`clamp(16px, 4vw, 24px)`);
coluna estreita de 760px para texto corrido. Ritmo de seção fluido
`clamp(56px, 9vw, 90px)`. Escala de espaçamento 8–64px em base 4/8. Parágrafos de
apresentação à esquerda; títulos e ações podem centralizar.

Mobile-first com pontos de quebra observados: 1150px (menu), 1100px (logos/hero
médio), 900px (grade de categorias 3 → 2 colunas e a foto do cartão passa para o
lado do texto), 767px (hero mobile), 640px (foto do cartão abaixo do texto) e
520px (header, formulário e categorias em duas colunas compactas, só ícone + nome). A arte do hero muda de arquivo (desktop `hero01.png`,
mobile `hero01-mobile.png`) — troca de asset, não recorte CSS.

**A Regra da Dobra.** Em notebook de tela baixa (altura ≤820px) o hero abandona a
proporção 16:9 e ocupa a altura útil (`100svh` − header, mínimo 540px): a linha de
benefícios não pode nascer abaixo da dobra. A foto perde um pouco das laterais
(margem morta da arte); o texto desce um passo, nunca o contrário.

## Elevation & Depth

O sistema é **plano no descanso e reage no toque**: superfícies descansam com
sombra quase imperceptível e ganham profundidade apenas como resposta a estado
(hover, elevação, foco). As sombras são quentes, tinta da própria paleta
(`--shadow-ink`), aplicadas via `color-mix` — sem `rgba` crus.

### Shadow Vocabulary

- **Repouso de card** (`box-shadow: 0 8px 24px color-mix(in srgb, #3C280A 5%, transparent)`): cards e superfícies leves em repouso.
- **Interação** (`box-shadow: 0 14px 34px color-mix(in srgb, #3C280A 10%, transparent)`): hover de cards — acompanha o lift de -3px.
- **Canal WhatsApp** (`0 10px 24px` / hover `0 14px 30px` em teal a 30%/38%): exclusiva do FAB.

Profundidade estrutural usa z-index nomeado: 49 (FABs e painel de nav), 50
(header sticky). Valores arbitrários como 999 ou 9999 são proibidos.

### Named Rules

**A Regra do Toque.** Sombra nunca é decoração permanente: muda apenas como
resposta a estado. Se um elemento ganhou sombra nova sem motivo de estado, ela
não pertence ao sistema.

## Shapes

Forma linguagem de cantos generosos e controles-cápsula. Raios observados:
card base 24px; card compacto de categoria 18px; controle/botão 40px (cápsula
completa); input interno 12px; artes de dispositivo 36px/28px. Os outliers
`--radius-card-md` (20px) e `--radius-panel` (22px) existem nomeados e aguardam
unificação no base 24px (Fase 2) — não crie novos outliers.

Bordas: botões com 2px na cor da ação; cards de categoria com 1px quente
(`--shadow-ink` a 8%) mais filete superior de 4px que revela acento uva no hover.

### Named Rules

**A Regra da Cápsula.** Ação é cápsula (40px); superfície é retângulo generoso
(18–24px). Inputs herdam a cápsula quando vivem dentro do pílula de formulário.

## Components

### Buttons

Cápsulas táteis e confiantes: borda 2px, raio 40px, padding óptico 14px±.08em /
30px, peso 600. Transição de 250ms cobre todas as variantes.

- **Primário (`btn-solid`)**: uva com texto branco; hover sobe -2px e vira uva-escuro.
- **Destaque (`btn-yellow`)**: mostarda com texto uva-escuro; hover eleva e clareia.
- **Creme (`btn-cream`)**: off-white para seções escuras.
- **Foco:** `:focus-visible` outline uva 2px com offset 3px (mostarda em fundo
  escuro, uva dentro do formulário). `:active` sem deslocamento; `:disabled`
  com opacidade reduzida e sem clique.

### Hero Form (assinatura)

Pílula branca de captura de e-mail: fundo `--color-surface`, raio 40px, padding
16px, input sem borda embutido (padding 14px 20px) e CTA primário dentro da
própria cápsula. Em telas estreitas o botão ocupa a largura total. Foco uva,
validação HTML nativa, retorno de sucesso/erro/estado-demo abaixo do pílula.

### Cards / Containers

- **Categorias (`cat-group` + `cat-card`)**: três famílias (alimentação / bem-estar
  / reconhecimento) separadas por 48px, cada uma com título, uma linha de argumento
  e grade de 3 colunas (2 no tablet, 1 no celular). Card branco, raio 18px, filete
  superior transparente que vira acento uva 25% no hover; eleva -3px com sombra de
  interação. Hover só dentro de `@media (hover:hover)`: no toque o `:hover` fica
  preso depois do tap e a ficha sobe como se tivesse sido escolhida. Não são
  controles clicáveis: o resumo no card é a informação completa — não há modal
  (o texto do modal repetia o resumo).
- **Seções escuras** (hero/artefato, CTA final, rodapé): superfícies uva com
  texto Uva Claro; foco troca para mostarda automaticamente.

### Inputs / Fields

Campos vivem dentro do pílula do formulário: superfície branca, texto Tinta,
sem borda própria (a cápsula é a fronteira). Foco visível uva 2px. Estados de
retorno: sucesso em fundo claro, erro em rosa-claro (`--error-100`) sobre uva —
sempre com `role` e texto distinguível, nunca só cor.

**A Regra do Erro na Superfície Clara.** Em card branco o erro não usa texto
rosa (1,45:1). A faixa é `--error-100` a 55% sobre a superfície, com texto Tinta
(10,3:1) e `aria-invalid` no campo; o resumo usa `role="alert"` e recebe o foco.
Vale para o formulário de benefícios e para qualquer retorno de validação novo.

### Navigation

Header sticky de 76px em superfície branca com sombra de repouso, z-index 50.
Logo à esquerda (SVG oficial), links à direita, CTA `btn-sm` com `nowrap`. Abaixo
de 1150px vira painel de menu com toggle de 44px (alvo tátil). Skip link uva
aparece no foco de teclado.

Item sem destino (hoje, "Portal da Empresa") não vira link: fica como texto em
Tinta Suave a 100% de opacidade (7,25:1) com o sufixo visível `em preparação` em
caixa alta menor. A indisponibilidade é dita a quem enxerga, não só ao leitor de
tela — e não se usa `cursor: not-allowed` num elemento que não é controle.

### WhatsApp FAB (assinatura)

Canal de terceiro com identidade própria: círculo fixo de 56px em teal oficial
do WhatsApp (branco 4,14:1 — o verde `#25D366` foi medido e reprovado a 1,98:1),
sombra dedicada, hover eleva -3px. Exceção consciente à paleta JA.

O FAB recua (`opacity 0` + `visibility: hidden`) em duas situações: quando um link
do rodapé cai na faixa dele e enquanto o formulário de proposta está na tela — o
card já oferece o mesmo canal e a bolha cobria o select de colaboradores e o CTA.

### Footer

Superfície Uva Escuro com texto Uva Claro; títulos de coluna em branco; links
clareiam no hover; foco mostarda.

## Do's and Don'ts

### Do:

- **Do** usar sempre `var(--token)` — nenhuma cor, espaçamento ou duração nova em
  literal; `npm run audit:cores` valida isso dentro de `npm run check`.
- **Do** adicionar qualquer cor nova como token com passo por `audit:cores`
  (paleta, contraste WCAG, tokens órfãos) antes de commitar.
- **Do** manter `:focus-visible` universal uva (mostarda em fundo escuro, uva no
  formulário) — é WCAG 2.4.7 e já é o comportamento do sistema.
- **Do** respeitar `prefers-reduced-motion` — a regra global zera animações; toda
  animação nova depende dela.
- **Do** validar mobile-first nos breakpoints 900px e 520px antes de considerar
  qualquer mudança pronta.
- **Do** guardar evidências de QA/crítica em `docs/design-references/` em
  kebab-case, sem timestamp.
- **Do** preservar os SVGs oficiais de `public/logo-ja-*.svg` como estão — vetor
  extraído do manual, proporção e cores intocáveis.

### Don't:

- **Don't** escrever hexadecimais literais em `index.html`, `src/styles/base.css`,
  `src/style.css`, `src/components/*.tsx` ou `src/mail.ts` — a auditoria reprova.
- **Don't** reintroduzir laranja `#FE6600` ou amarelo `#F4AD00` da marca
  anterior, nem os aliases antigos (`--orange`, `--brown`, `--cream`, `--bg`,
  `--ink`, `--pill`) removidos em 14/10/2026.
- **Don't** usar o cinza oficial `#97999B` como texto corrido sobre claro.
- **Don't** reconstruir o wordmark em CSS nem recolorir os SVGs do manual.
- **Don't** animar propriedades de layout (`height`, `top`, `margin`) — apenas
  `transform` e `opacity` compõem na GPU.
- **Don't** publicar claims com números sem fonte comprovada nas seções vizinhas.
- **Don't** introduzir frameworks ou dependências de UI (React, Tailwind, GSAP):
  o projeto é Vite + TypeScript estrito + HTML/CSS puro.
