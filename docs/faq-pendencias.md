# FAQ — pendências de confirmação comercial

A FAQ tem 17 itens em `public/faq.json` (fallback em `index.html`; o Worker importa o
mesmo arquivo no build, sem cópia). As respostas foram redigidas sem inventar valores ou
regras: onde o dado depende da operação, o texto remete à proposta ou ao atendimento.

Antes de divulgar, confirmar com a área comercial:

| Item da FAQ | O que precisa ser confirmado |
|---|---|
| A implantação tem algum custo? / Existe mensalidade ou taxa por colaborador? | Que não existe mensalidade nem taxa por colaborador além do frete e dos créditos |
| Quanto custa a segunda via do cartão? | Se a segunda via é cobrada e qual o valor por motivo (perda, roubo, defeito) |
| Qual o prazo de emissão e entrega dos cartões? | SLA de emissão e de entrega por região |
| Como funcionam as 16 categorias no mesmo cartão? | Regra de distribuição das categorias entre os chips voucher e multisaldo |
| Cada categoria tem saldo separado? | Se o saldo é controlado por categoria e se há remanejamento entre elas |
| Existe cartão virtual? | Se o cartão virtual é um produto próprio ou apenas os dados do cartão no app |
| Perdi o cartão ou esqueci a senha | Fluxo oficial de bloqueio, reemissão e redefinição de senha |
| Como migro do meu fornecedor atual? | Se a migração é aceita em qualquer estágio do contrato atual e quem cuida do calendário |
| Como incluir um colaborador ou desligar quem saiu da empresa? | Regra do saldo remanescente em desligamento (expira, volta para a empresa, permanece no cartão) |
| Como funciona o atendimento | Horário de atendimento e prazo de resposta dos canais |
| O JÁ Benefícios atua em conformidade com o PAT? | Registro PAT FA000031 e vínculo com o CNPJ 52.316.137/0001-53 (já apontado em `revisao-pre-lancamento.md`) |

## Pontos ainda abertos fora da FAQ

- "Onde aceita VISA, aceita JÁ" (`#vantagens`) continua mais amplo que a resposta da FAQ,
  que condiciona o chip voucher à rede habilitada.
- O portal é anunciado com "planilhas, financeiro e múltiplos CNPJs" e a nav diz
  "em preparação". Falta documentar o que já funciona.
- "Milhões de estabelecimentos" não tem fonte citada na página.

## Ao alterar a FAQ

1. Editar `public/faq.json` (fonte).
2. Repetir o texto no bloco estático `#faqList` de `index.html` (fallback sem JS).
3. Rodar `npx wrangler deploy` dentro de `chat-worker/` — o Worker importa
   `public/faq.json` no build, então precisa de deploy próprio; recompilar a landing
   não atualiza o assistente.
4. Rodar `npm run check`.
