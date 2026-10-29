# Design system — JA Benefícios

Revisão: 06/10/2026. Escopo: `JA-beneficios`, página principal e estilos compartilhados
da página de privacidade. Fonte: `MANUAL JA BENEFICIOS AT1.pdf`, seis páginas,
lido diretamente. A página 3 também foi inspecionada visualmente.

## Origem das decisões

O manual define identidade visual, não uma biblioteca de interface. Cores e famílias
tipográficas abaixo vêm das páginas 3 e 4. Estados, fundos, raios, espaçamentos e
breakpoints são extensões digitais do projeto, não regras atribuídas ao manual.

| Primitivo oficial | RGB / HEX | Aplicação digital |
| --- | --- | --- |
| `--ja-mostarda` | 255, 199, 44 / `#FFC72C` | Destaques e botão com texto uva escuro |
| `--ja-uva` | 115, 46, 74 / `#732E4A` | Ação primária, links e títulos de destaque |
| `--ja-verde` | 64, 193, 172 / `#40C1AC` | Marca e decoração; não texto pequeno em branco |
| `--ja-cinza` | 151, 153, 155 / `#97999B` | Referência institucional; não corpo sobre fundo claro |

O cinza oficial não oferece contraste suficiente para texto pequeno em branco.
O corpo usa `--color-text` e o texto secundário `--color-text-muted`.
Essas são adaptações de acessibilidade, não novas cores oficiais da marca.

`--ja-cinza` está **ativo** em `src/style.css` como `--ja-cinza:#97999B` (Cool Gray 7 C).

Declaração oficial do manual: cor institucional para detalhes. `npm run audit:cores`
continua a reportá-lo como ativo (não token morto). Contraste sobre branco: 2,86:1 (mínimo
3:1 para gráficos não-textuais). Uso admissível: detalhes gráficos (ícones, bordas,
divisores, estados de interface). Não usar para texto corrido em corpo pequeno em branco.

## Fonte de verdade e uso

`src/styles/base.css`, bloco `:root`, mantém três níveis:

1. Primitivos: cores oficiais, neutros, extensões digitais (inclui `--shadow-ink`,
   `--shadow-panel-ink`, `--whatsapp`/`--whatsapp-ink` como exceção consciente de marca, e
   `--backdrop-ink`).
2. Semânticos: `--color-primary`, `--color-text`, `--color-text-muted`,
   `--color-surface`, `--color-on-dark-muted`, `--color-focus` e afins.
3. Componentes: `--button-bg`, `--button-fg`, `--button-hover-bg`,
   `--card-bg`, `--card-radius`, `--input-radius`, `--footer-bg` e `--section-space`.

Famílias de tokens (todas com os valores medidos da interface — nenhuma é nova):

- **Espaçamento** `--space-2/3/4/5/6/8/10/12/16` (8/12/16/20/24/32/40/48/64px).
- **Raios** `--radius-card` (24px, base) + outliers nomeados `--radius-card-sm` (18px),
  `--radius-card-md` (20px), `--radius-panel` (22px), `--radius-control` (40px),
  `--radius-input` (12px), `--radius-device` (36px), `--radius-device-screen` (28px).
  A unificação dos outliers no base 24px é trabalho da Fase 2.
- **Motion** `--t-fast` (.2s), `--t-base` (.25s), `--t-mid` (.3s), `--t-nav` (.35s),
  `--t-slow` (.45s), `--t-enter` (.7s).
- **Elevação** `--shadow-sm`, `--shadow`, `--shadow-hover`,
  `--shadow-whatsapp`, `--shadow-whatsapp-hover` — alpha via `color-mix`, sem `rgba` crus.
- **z-index** `--z-fab` (49), `--z-nav` (49), `--z-header` (50).
- **Tipografia** `--text-body`, `--text-h1`, `--text-h2`, `--text-h3`, `--text-lead`
  (clamps medidos; o H1 do hero é exceção documentada e continua em `cqw` da arte 16:9).

Os aliases antigos (`--orange`, `--brown`, `--cream`, `--bg`, `--ink`, `--pill` etc.)
foram **removidos** em 14/10/2026 após migração para os tokens semânticos — não recriá-los.
As categorias usam a mesma base uva; nomes e ícones continuam distinguindo-as.
Não há significado de negócio documentado para as cores antigas das categorias.

## Tipografia e composição

- Nexa Slab é a família preferencial do manual. Nenhum arquivo dessa fonte é distribuído aqui
  (requer licença).
- Enquanto a Nexa Slab não for licenciada, títulos usam **Arvo** (Apache-2.0, self-host em
  `public/fonts/arvo-{regular,bold}.woff2`, sem request a terceiros). Escolha por ser a
  slab serifada livre mais próxima da Nexa Slab; evidência em
  `design-references/font-compare-h1-560x1827.png`.
- Trebuchet MS é a alternativa autorizada para HTML no corpo. Verdana/sans-serif são fallbacks
  técnicos quando as fontes não estão instaladas; não garantem fidelidade tipográfica.
- Títulos usam `--font-display` (Arvo); corpo usa `--font-body`.
- Parágrafos de apresentação e depoimentos ficam à esquerda. Títulos e ações podem
  permanecer centralizados. Texto incorporado às imagens não é controlado pelo CSS.
- Mantidos raios de 24px em cards e 40px em botões, container de 1200px (`--max`) e
  espaçamento fluido de seção. São escolhas existentes da interface, não medidas do manual.
- Breakpoints existentes: 1150px (menu), 1100px (logos/hero médio), 900px (grades),
  767px (hero mobile) e 520px (header e formulário).

## Componentes e estados

| Componente | Padrão | Interação |
| --- | --- | --- |
| Botão primário | Uva / branco | Hover uva escuro; pressionado sem deslocamento |
| Botão de destaque | Mostarda / uva escuro | Hover clareado; foco visível |
| Botão desabilitado | Opacidade reduzida | Sem clique; envio mantém estado existente |
| Campo de e-mail | Superfície branca | Foco uva, validação HTML nativa |
| Categorias | Mistura suave de uva e branco | Hover eleva; não são controles clicáveis |
| Cards | Superfície branca / texto escuro | Raio e sombra compartilhados |
| Rodapé | Uva escuro / texto claro | Links e foco contrastantes |
| Retorno do formulário | Sucesso claro / erro rosa claro | Texto e roles existentes distinguem o estado |

Foco usa uva em superfícies claras, mostarda em seções escuras e uva dentro do
formulário branco. Movimento reduzido continua respeitado. Nenhum envio, regra de
negócio, navegação ou conteúdo jurídico foi alterado.

## Marca e limites da conformidade

O manual exige proporção original, área livre equivalente à largura do acento e
expressão BENEFÍCIOS abaixo de JÁ. As medidas de 18,5mm (preferencial) e 5mm
(especial) são mínimos impressos; não comprovam legibilidade em pixels.

Os SVGs de `public/logo-ja-*.svg` são o **vetor oficial**, extraído da página 2 do
manual (MANUAL JA BENEFICIOS AT1.pdf): geometria original da marca — monograma e
wordmark como paths, sem `<text>` — com cores aplicadas pelos tokens Pantone.
Não reconstruir o wordmark em CSS nem recolorir os arquivos. A versão especial reduzida
da página 3 não deve ser confundida automaticamente com o lockup inteiro branco.

As artes PNG existentes têm texto, cores e marcas incorporados e precisam de auditoria
própria. A presente correção cobre os elementos HTML/CSS e não certifica essas artes.
O projeto secundário `JA-digital` não faz parte desta revisão.

## Validação reproduzível

A seção `#custo-zero` mantém a composição da referência com os tokens existentes:
`--text-h2` e `--text-h3` nos títulos, com a família `--font-display`.
O card ocupa até 80% de `--max` (960px), com padding `--space-12` no desktop.
Campos usam superfície branca, borda `--color-text-muted` e altura mínima de
`--space-12` (48px). Rótulos e notas usam `--text-small`; controles e descrição,
`--text-body`. A grade usa `--space-6` entre linhas e `--space-8` entre colunas.
Manter a composição da referência sem comprimir a escala do design system:
duas colunas acima de 520px e uma no celular, com padding responsivo.
Evidências: `design-references/custo-zero-ds-amplo-{1200,390}.png`.

A composição de aceitação Visa usa a fotografia quadrada `aceito.png` na coluna
esquerda e todo o conteúdo HTML na direita acima de 900px; abaixo disso, as colunas
se empilham. Títulos e parágrafos seguem a tipografia compartilhada; rótulos usam
`1rem`, texto uva/escuro sobre superfície clara e mostarda apenas no detalhe
decorativo. Espaçamentos e raios reutilizam os tokens compartilhados.
A fotografia continua sujeita à auditoria própria das artes PNG descrita acima.

Executar `npm run check` dentro de `JA-beneficios`. Conferir a página em desktop e
mobile, navegação por teclado, menu móvel e contraste dos pares de tokens. Evidências
visuais ficam em `docs/design-references/design-system-*.png`.
