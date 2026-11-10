# Plano — composição do hero em ultrawide

## Objetivo e diagnóstico

Corrigir o afastamento entre texto e fotografia acima de 1920px, integrando a nova
arte ajustada no desktop largo e preservando o texto e o comportamento mobile.
O CSS atual limita a imagem a aproximadamente 1440×810px, mas prende sua posição
à borda da tela; o texto usa um contêiner centralizado de 1440px.

## Solução proposta e alcance

Limitar o palco visual completo (`.hero-banner`) a aproximadamente 1920px e
centralizá-lo dentro de `.hero`, cujo fundo uva continua ocupando a tela inteira.
Manter o contêiner textual de 1440px e limitar a escala da nova fotografia. Acima do
limite, texto e imagem devem deslocar-se juntos, sem aumentar sua distância.
A largura de 1920px é o ponto de partida para preservar a referência validada;
a aprovação visual deve considerar a junção da fotografia com as margens externas.

- Alterações: regras desktop em `src/style.css`, seleção por `<picture>` em
  `src/components/Hero.tsx`, geração em `scripts/gerar-fallbacks-hero.mjs`,
  fonte `assets-fonte/hero-wide.png` e derivados `public/hero-wide.webp` e `.jpg`.
- Consumidores a conferir: `Hero.tsx` (`picture`, overlay, título e CTA), header,
  seção de prova imediatamente seguinte e controles flutuantes.
- Evidências: `docs/design-references/`, em WebP, com nomes sem timestamp.
- A nova arte foi autorizada na sequência da análise. Tokens globais, textos,
  diferenciais, chat, navegação e dependências permanecem iguais.

## Etapas de implementação

1. [x] Registrar o antes em 1920×1080 e 3440×1440, com viewport confirmado por
   `innerWidth/innerHeight`; medir posição e dimensões da imagem, texto e CTA.
2. [x] Limitar e centralizar o palco visual por CSS, reaproveitando o markup.
   Preservar as regras abaixo de 1440px e a combinação desktop de baixa altura.
3. [x] Conferir a junção arte/fundo nas duas laterais. Ajustar apenas a transição
   necessária com os recursos existentes, sem esconder rostos ou cartão. Se a arte
   exigir novo asset ou mudança relevante da referência, registrar o impedimento
   e apresentar a alternativa antes de ampliar o escopo.
4. [x] Validar no navegador e executar `npm run check`; guardar o depois dos dois
   viewports de referência e o par antes/depois em 1366×768 e 390×844. Registrar
   resultados reais e qualquer limitação da validação.

## Critérios de conclusão e riscos

- Em 2560×1440, 3440×1440 e 3840×2160, a escala da imagem e a posição horizontal
  relativa entre texto e fotografia permanecem constantes, com tolerância de 2px
  para arredondamento. Apenas as margens externas aumentam.
- Em 1920×1080, título e CTA preservam a escala; a fotografia usa o novo enquadramento.
- Sem regressão em 1366×768 e nas transições 1439/1440 e 1919/1920/1921px;
  conferir também desktop com altura de 768px.
- Conferir 901/900/899, 768/767 e 521/520/519px de largura, além de 390×844:
  sem rolagem horizontal, colisão, texto cortado ou mudança do recorte mobile.
- CTA visível na primeira dobra dos desktops avaliados, foco por teclado visível,
  link para o formulário funcional e movimento reduzido preservado.
- Sem nova emenda visual abrupta no encontro da arte com o fundo. O recorte original
  à direita é o principal risco ao deixar de coincidir com a borda da tela.
- A sobreposição do assistente à foto em 1366×768 é preexistente e fica fora desta
  correção; verificar que ela não piora nem passa a cobrir título, CTA ou cartão.
- `npm run check` passa. Sem bloqueio conhecido para iniciar; acesso de gravação
  das capturas pelo navegador deve ser verificado na primeira etapa.

## Resultado da integração

- Arte nova selecionada a partir de 1440px; fonte anterior mantida de 768 a 1439px
  e recorte mobile até 767px. Altura segue a proporção 1920/810 em desktop largo;
  a regra existente de telas baixas continua ativa. Na passagem 1439→1440px,
  enquadramento e altura mudam deliberadamente com a troca da composição.
- 19 viewports verificados de 390×844 a 3840×2160: fonte correta, CTA na primeira
  dobra, sem rolagem horizontal. Em ultrawide, palco de 1920px e posição relativa
  do texto constante. Conferência visual em 1440×900, 1920×1080, 1920×768 e 3440×1440.
- Capturas antes/depois `docs/design-references/hero-gemini-*`; os pares de mobile
  e 1366×768 não mudaram. Evidências totais do projeto: aproximadamente 33 MiB.
- JPEG decodificado no navegador em 1920×810. WebP lossless comparado por pixels
  à fonte: idêntico, preservando o fundo uva. Peso atual: 551 KiB (antes: 170 KiB).
- CTA levou ao formulário; foco por teclado confirmado com outline sólido de 2px;
  modo de movimento reduzido conferido. Sem erros ou avisos no console da página.
- `npm run check` executado; geração dos formatos por `npm run hero:fallbacks`.
- Não inclui alinhamento do cabeçalho, mudança da tipografia, teste de conversão
  ou medição de desempenho em rede lenta. Sem deploy.

## Refinamento do cartão e da identidade

- Cartão e pegada corrigidos por IA usando a frente cinza do plástico fornecido
  como referência. Área cinza medida: aproximadamente 130×183px antes e 97×149px
  depois; largura 25% menor e proporção largura/altura mais próxima da referência.
- Grafismo atrás do casal composto a partir de `logo-ja-negativo.svg` oficial,
  em 18% de opacidade, sem redesenhar o vetor. Incorporado à fonte PNG para manter
  a mesma composição em WebP e JPEG. Receita: `assets-fonte/hero-wide-edicao.txt`.
- Saída `output/imagegen/hero-cartao-marca-1920x810.png`; fonte integrada em
  `assets-fonte/hero-wide.png`. Margens esquerda de 45% e direita de 8% verificadas
  em RGB #732E4A, WebP lossless idêntico à fonte e JPEG decodificado em 1920×810.
- Rodada final no navegador: 1440×900, 1920×1080, 3440×1440, 1366×768 e 390×844;
  CTA visível, sem rolagem horizontal e sem erros/avisos no console. Fontes mobile
  e notebook não foram alteradas. Pequenas diferenças entre capturas dessas telas
  se restringem ao cabeçalho/controles do navegador, não à troca da arte desktop.
- Comparação atual: `hero-gemini-depois-*` (antes deste refinamento) contra
  `hero-cartao-marca-depois-*` em `docs/design-references/`. Capturas mais antigas
  `hero-gemini-antes-*` arquivadas em `_quarantine/design-references/`.
- `npm run hero:fallbacks`, `npm run check` e `git diff --check` executados.
  Sem deploy, teste de rede lenta ou alteração nas bordas dos cards de outras seções.
