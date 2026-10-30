# Consolidação da FAQ — Já Digital e JA Benefícios

Fonte: [base canônica v1.1](research/faq-ja-digital-canonico.md), recebida do responsável pelo projeto.
A orientação de não publicar automaticamente é parte do documento-fonte; a integração foi solicitada na conversa. A classificação de maturidade foi usada como evidência editorial.

## Decisões

- Uma entrada por intenção, com ID estável e perguntas equivalentes.
- Referências CHAT e rascunhos permanecem em docs, fora de public e do contexto do modelo.
- Os 17 tópicos fundamentados em conversas foram revisados; FAQ-029 foi fundida à FAQ-014. Os procedimentos não confirmados não foram promovidos a regras vigentes.
- A resposta de aceitação mantém as condições já existentes, retirando a afirmação universal.
- Perda do cartão e consulta de senha foram separadas. A antiga pergunta composta não é sinônimo de uma intenção isolada; exige contexto ou encaminhamento.
- A duplicata do app foi fundida a app-funcionalidades. Perguntas específicas de implantação/mensalidade e a visão geral de custos continuam distintas.
- A base consolidada tem 37 entradas: 17 comerciais selecionadas para a landing/JSON-LD e 20 exclusivas do assistente.

## Mapa das 29 perguntas

| Origem | Pergunta | Destino | Tratamento / pendência |
|---|---|---|---|
| FAQ-001 | Como faço para acessar o aplicativo JÁ Digital? | app-acesso | Nova intenção de suporte; equivalentes indexados. |
| FAQ-002 | Recebi o cartão da empresa. Preciso criar uma conta? | app-cartao-empresa | Nova intenção de suporte; equivalentes indexados. |
| FAQ-003 | Não consigo entrar no aplicativo. O que devo fazer? | app-erro-acesso | Nova intenção de suporte; equivalentes indexados. |
| FAQ-004 | O aplicativo está exibindo informações cortadas ou fora da tela. Como resolver? | app-exibicao | Orientação editorial sem recomendar reinstalação. |
| FAQ-005 | O aplicativo mostra dois cartões, mas eu só recebi um. Isso é normal? | app-dois-cartoes | Nova intenção de suporte; equivalentes indexados. |
| FAQ-006 | Onde encontro o aplicativo JÁ Digital? | app-download | Nova intenção de suporte; equivalentes indexados. |
| FAQ-007 | Esqueci a senha de acesso ao aplicativo. Como recuperar? | Revisão interna | Recuperação da senha do app pendente; não confundir com consulta da senha do cartão. |
| FAQ-008 | O que é a senha de transação? | senha-transacao | Distinção entre senhas incorporada; quantidade de dígitos não publicada. |
| FAQ-009 | Esqueci minha senha de transação. O que faço? | Revisão interna | Redefinição pendente; a consulta já existente fica em cartao-senha, sem prometer recuperação. |
| FAQ-010 | Digitei a senha errada e meu cartão foi bloqueado. Como desbloquear? | cartao-bloqueio-senha | Nova intenção de suporte; equivalentes indexados. |
| FAQ-011 | Meu cartão foi bloqueado preventivamente. O que significa? | cartao-bloqueio-preventivo | Nova intenção de suporte; equivalentes indexados. |
| FAQ-012 | É seguro informar minha senha ao atendente? | Revisão interna | Política institucional pendente. As orientações de sigilo não reproduzem práticas históricas. |
| FAQ-013 | Como desbloquear meu cartão pela primeira vez? | cartao-ativacao | Nova intenção de suporte; equivalentes indexados. |
| FAQ-014 | Meu cartão não passou na maquininha. O que verificar? | cartao-pagamento-recusado | Nova intenção de suporte; equivalentes indexados. |
| FAQ-015 | Preciso avisar ao caixa que meu cartão é voucher? | cartao-modalidade-voucher | Nova intenção de suporte; equivalentes indexados. |
| FAQ-016 | Onde o cartão é aceito? | cartao-aceitacao | Equivalentes na resposta existente; removida a afirmação universal. Política adicional continua pendente. |
| FAQ-017 | Posso usar meu saldo de Vale-Refeição em atacadistas? | Revisão interna | Regra para atacadistas precisa de confirmação. |
| FAQ-018 | Posso fazer compras acima do saldo disponível? | compra-saldo | Nova intenção de suporte; equivalentes indexados. |
| FAQ-019 | Como consultar o saldo do cartão? | app-saldo | Nova intenção de suporte; equivalentes indexados. |
| FAQ-020 | Por que tenho saldo no aplicativo, mas a compra foi recusada? | saldo-compra-recusada | Nova intenção de suporte; equivalentes indexados. |
| FAQ-021 | Qual é a diferença entre Vale-Alimentação e Vale-Refeição? | Revisão interna | Diferenças e restrições por estabelecimento precisam de validação. |
| FAQ-022 | Posso transferir o saldo do cartão para outra pessoa ou conta? | Revisão interna | Não publicar proibição de PIX/transferência sem confirmar a modalidade. |
| FAQ-023 | Quem resolve problemas de crédito de benefícios pela empresa? | Revisão interna | Fluxo de crédito/RH pendente. |
| FAQ-024 | Perdi meu cartão. Como solicitar a segunda via? | cartao-perda | Usada somente a orientação já publicada; nenhum procedimento novo de cancelamento foi assumido. |
| FAQ-025 | O saldo do cartão perdido pode ser transferido para o novo? | Revisão interna | Transferência de saldo para segunda via pendente. |
| FAQ-026 | A emissão da segunda via tem custo? | segunda-via-custo | Equivalentes no custo já publicado, sem divulgar o valor histórico. |
| FAQ-027 | Quais informações devo ter em mãos ao solicitar suporte? | suporte-informacoes | Nova intenção de suporte; equivalentes indexados. |
| FAQ-028 | Qual é o horário de atendimento da JÁ Digital? | Revisão interna | Não publicar horários históricos como vigentes. |
| FAQ-029 | Como proceder se o cartão parecer desbloqueado, mas ainda não funcionar? | cartao-pagamento-recusado | Consolidada no diagnóstico de pagamento recusado, sem duplicar resposta. |

## Publicação e validação

Editar public/faq.json atualiza a fonte de verdade. Frontend e Worker incorporam essa fonte no build. Não há STATIC_FAQ. O serviço remoto exige novo deploy do Worker; recompilar somente a landing não o atualiza.

Validar contrato, duplicatas, equivalentes, intenções ambíguas, dados sensíveis e filtro da landing. Executar npm run check e node --test chat-worker/index.test.mjs src/faq-search.test.mjs.
