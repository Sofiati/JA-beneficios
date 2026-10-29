# Crítica e correção do header

Evidência "antes": barra superior colhida em viewport de 1600px (captura enviada na revisão).
Evidências numéricas: medição de largura das etiquetas com as fontes reais da stack
(`Trebuchet MS` → `Verdana`, script PIL medindo `font.getlength` em 200px e escalando).

## 1. Achados (antes)

1. **A linha nunca cabia — não era bug de breakpoint.** `--max:1160px` − padding 48 = 1112px
   úteis; logo (98) + 8 itens (6 links + 2 pills) precisavam de ~1120px+ e, com o rótulo longo,
   **1137px em Verdana**. Resultado: 4 itens quebrados em 2 linhas em *todo* viewport ≥901px
   (inclusive 1600px), pills com a cápsula destruída e "demonstração" órfão.
2. **Altura fixa × conteúdo elástico**: `.header-inner{height:76px}` com conteúdo que crescia
   até ~66px — folga de 10px, sem `overflow` declarado.
3. **Breakpoint errado**: hamburger só em ≤900px; entre 901–~1300px o header vivia degradado.
4. **Menu invisível focável**: fechado usava só `transform:translateY(-130%)` → links saíam do
   tab order; `aria-label` estático ("Abrir menu" mesmo aberto); sem `aria-controls`,
   sem `Escape`, sem lock de scroll.
5. **Âncoras × sticky**: sem `scroll-padding-top` → os 76px do header cobriam o título da
   seção de destino em todos os links internos.
6. **IA/conteúdo**: "Blog" e "Conteúdo" apontavam para `#midia` (duplicado); "Portal da
   Empresa" era `href="#"` **e** pill (concorrendo com o CTA); "Início" → `#topo` de baixo valor.
7. **Hierarquia**: CTA primário em `.85rem` (menor que os links `.92rem`); outline pill uva
   colado no solid pill uva; sem estado ativo; hover só com mudança de cor.

## 2. Medidas (px)

| Item | Trebuchet | Verdana (fallback) |
|---|---:|---:|
| Início | 37,9 | 42,7 |
| Benefícios (rótulo curto) | 71,6 | 79,1 |
| Benefícios Corporativos (rótulo longo) | 164,5 | 184,2 |
| JA-Digital Vida | 102,9 | 114,9 |
| Conteúdo | 66,5 | 75,0 |
| Central de ajuda | 117,5 | 130,6 |
| Portal da Empresa | 127,7 | 143,9 |
| CTA "Quero uma demonstração" (bold) | 231,9 c/ padding | 270,9 c/ padding |

Configuração final (6 links + CTA, gaps 16):

| Fonte | Total | Slack @1112 | Viewport mínimo |
|---|---:|---:|---:|
| Trebuchet | 966,0 | **+146,0** | 1014px |
| Verdana | 1066,9 | **+45,1** | 1115px |

Rótulo longo + "Início" + CTA completo em Verdana dava **1172,2px (−60)** → estourava sempre;
por isso o rótulo virou **"Benefícios"** e "Blog" saiu.

## 3. Decisões

- **Itens**: Início, Benefícios, JA-Digital Vida, Conteúdo, Central de ajuda + Portal da
  Empresa como **link de texto** (utilitário, vai para o painel mobile). Blog removido.
- **Breakpoint 1150px** (dentro da faixa 1100–1200 planejada): garante a linha cheia em
  ≥1151px mesmo com fallback largo.
- **nowrap** em `.main-nav>a` e `.btn-sm`; gaps 16/16/14; CTA em `.92rem` (igual à nav).
- **Agrupamento**: `space-between` no desktop (3 blocos); `margin-left:auto` em
  `.header-actions` no mobile (nav sai do fluxo).
- **CTA fora do painel** → permanece visível com o menu fechado no mobile; rótulo curto
  "Demonstração" em ≤520px (medido: 360px exigia logo 66px + gaps 10px).
- **A11y**: `visibility:hidden` no painel fechado, `aria-controls`, `aria-label` dinâmico,
  `Escape` + devolução de foco, lock de scroll, `max-height` + `overflow-y` no painel.
- **`scroll-padding-top:90px`** (76px + 14 de respiro).
- **Scroll-spy** (`IntersectionObserver`, faixa −45%/−50%) → `.active` + `aria-current="location"`.

## 4. Logo do header "tímido" (revisão pós-correção)

Captura pós-correção: marca renderizada em 78px parecia pequena ao lado do pill de 232px.
Medição do SVG (`public/logo-ja-positivo.svg`, viewBox `200×145`):

- Caixa renderizada: 78×56,5px; **arte real: ~63×43px** (menor que um item de nav de 117px).
- ~32% da caixa é margem morta: direita 18,8% (arte termina em x≈162), topo 14% (y≈20,4),
  base 18,4% (baseline do texto em y≈118).
- Bug latente: o `<text>` renderiza 162px em Trebuchet e **184px em Verdana** (+14%) —
  a proporção do logo variava conforme a máquina do usuário.

### Decisão: opção A

1. SVG: `viewBox="0 18 162 103"` (recorte para a arte + 2px de folga) e
   `textLength="118" lengthAdjust="spacingAndGlyphs"` no `<text>` (largura do wordmark
   determinística em qualquer SO — a área de segurança do manual p.3 segue garantida pelo
   padding do chip `.brand--header`).
2. `.brand-logo`: 78→**90px** (`index.html` e `style.css` atualizados; aspect novo 162/103).
3. Resultado: tinta visível **63×43 → ~88×56px (+40%/+30%)**; custo **+12px de largura**
   (folga: Verdana 45→33; Trebuchet 146→134); header continua 76px e offsets globais
   (`inset`, `scroll-padding-top`) inalterados.

Descartadas por ora: **B** (header 88px + box ~112px; folga Verdana cairia a ~10px e mexeria
em 4 offsets) — empilhável depois sobre este recorte; **C** (chip com fundo — competiria com
o pill uva do CTA). O `logo-ja-negativo.svg` do rodapé (132px) não foi tocado.

## 5. Verificação

- `npm run build` (tsc `strict` + `noUnusedLocals`): ok.
- Preview servido e HTML/CSS/JS conferidos (marcadores `header-actions`, `aria-controls`,
  `scroll-padding-top`, regra `@media (max-width:1150px)`).
- Pendência conhecida: sem screenshot automatizado (MCP do Playwright indisponível na sessão);
  alinhamento/larguras derivam de medição de fonte, não de render real.
