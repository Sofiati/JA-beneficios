# Revisão de pré-lançamento — 26/10/2026

## Objetivo e escopo

Preservar o desenho e corrigir inconsistências comprovadas na comunicação e no formulário.
Áreas: index.html, public/faq.json, src/main.tsx, src/App.tsx, src/components/, src/mail.ts e README.md.
Etapas: confrontar conteúdo e fontes oficiais; aplicar correções; validar build,
FAQ estática/dinâmica, validação de campos e antispam; registrar limites.
Critério de conclusão técnica: checagens aprovadas e nenhum sucesso no bloqueio antispam.
O lançamento depende das confirmações comerciais abaixo.

## Correções

- Retirada a associação de Cultura ao PAT na introdução, no selo e nas duas versões da FAQ.
- A distribuição de categorias por chip foi encaminhada à confirmação comercial,
  sem deduzir regras do produto a partir da legislação.
- CTA e assunto do e-mail passaram a solicitar contato comercial.
- O honeypot preenchido agora apresenta erro sem enviar ou fingir sucesso.
- A descrição de busca deixou de prometer custo zero de forma geral.
- Resumos de Alimentação, Refeição e Educação foram condensados para reservar os
  exemplos de uso ao detalhamento. Os demais ainda podem receber revisão editorial.

## Fontes oficiais

- PAT: https://www.gov.br/trabalho-e-emprego/pt-br/servicos/empregador/programa-de-alimentacao-do-trabalhador-pat
- Vale-Cultura: https://www.gov.br/cultura/pt-br/assuntos/acoes-programas-e-politicas/vale-cultura
- Lei 12.761/2012: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12761.htm

Essas fontes distinguem os programas; não comprovam a habilitação da empresa.

## Pendências para divulgação

- Confirmar registro PAT FA000031 e vínculo com o CNPJ informado. A busca pública
  realizada não encontrou confirmação; isso não prova inexistência do registro.
  **Desde 28/10 o número está na faixa de prova pós-hero** (antes só no FAQ):
  é o dado mais visível da página e precisa de confirmação documental antes do
  lançamento.
- Confirmar a oferta de Vale-Cultura e o credenciamento correspondente.
- Fornecer regras de aceitação Visa, voucher/multisaldo e distribuição por chip.
  A promessa de aceitação universal ainda precisa de revisão com base nessas regras.
- Confirmar segunda via, serviços adicionais, demais taxas e alcance de “sem taxas de gestão”.
- Demonstrar planilhas, financeiro e múltiplos CNPJs no portal.
- Fornecer URLs reais do Portal da Empresa. Instagram e LinkedIn foram removidos do
  rodapé até os perfis existirem (eram `href="#"`, um link morto).
- Validar dados cadastrais e canais de atendimento com a empresa.
- Autorizar envio de teste com destinatário controlado e confirmar recebimento na caixa postal.
  Nenhum contato real foi enviado nesta revisão. Resposta positiva da API não prova entrega
  na caixa postal. Falhas de rede/API e modo demo exigem ensaio controlado separado.

## Limites

Não foram inventadas taxas, funcionalidades ou regras de aceitação. O layout foi preservado.
As mensagens de demo e erro são distintas no código; o sucesso normal exige HTTP válido
e success=true. A validação de consentimento usa o campo obrigatório do navegador.

## Validação executada

- `npm run check`: typecheck, build e auditoria de cores aprovados; dois avisos
  informativos preexistentes sobre cores decorativas permanecem.
- `git diff --check`: sem erros.
- Navegador: campos válidos passam na validação; sem consentimento o formulário é inválido.
- Regressão antispam: checkbox oculto preenchido resulta em erro visível, sucesso oculto,
  dados preservados, botão habilitado e zero requisições ao serviço de envio.
- Estados de sucesso, erro e demonstração começam ocultos; honeypot tem display:none.
- As seis CTAs de marca verificadas apontam para #cta-final.
- Resposta revisada da FAQ idêntica no HTML, JSON e DOM carregado; Cultura sem selo PAT.
- Formulário inspecionado visualmente a 520px, sem transbordamento horizontal.
- Não foram testados envio real, entrega na caixa postal, falha de rede/API nem execução
  do modo demo nesta rodada. A inspeção desses caminhos foi apenas de código.
