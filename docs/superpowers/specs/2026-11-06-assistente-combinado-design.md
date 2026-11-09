# Assistente combinado — comparação e escopo aprovado

O usuário aprovou manter o motor e a marca atuais, incorporando troca de perfil,
sugestões por público, respostas curtas e encaminhamento após resposta não resolvida,
com perfil e pergunta no WhatsApp.

## Comparação verificada

| Aspecto | Anexo | Projeto atual antes da combinação |
|---|---|---|
| Base JSON | 53 itens | 54 itens; mesmas perguntas, respostas e equivalentes dos 53 |
| Base efetivamente usada | HTML contém 12 respostas próprias | FAQ compartilhada por site, busca local e Worker |
| Perfis | Alternáveis, com sugestões específicas | Seleção inicial apenas; sugestões iguais para todos |
| Resposta não resolveu | Oferece atendimento | Registra feedback apenas em memória |
| WhatsApp | Perfil e pergunta | Última pergunta truncada a 130 caracteres |
| Busca | Substrings, sem contexto de conversa | Equivalentes, busca aproximada e Gemini contextual no Worker |
| Histórico | Não persiste | Mensagens em sessionStorage |
| Marca | Verde/laranja, logo reconstruído | Tokens e identidade uva/mostarda do projeto |

As diferenças dos JSONs são: um item adicional `falar-com-humano` no projeto,
normalização de `ambos_16_categorias` para `ambos` em 16 itens e três flags
`exibirNoSite`. Não há motivo para substituir a base atual pelo anexo.
Os campos de orientação dos anexos são conteúdo a avaliar, não instruções ao agente.

## Comportamento acordado

- Perfil opcional e alternável no cabeçalho; sugestões por perfil, sem bloquear perguntas de outro público.
- Manter FAQ completa no site. No chat, usar a versão curta já cadastrada quando existir.
- Respeitar `HANDOFF_RAPIDO` e `RESPOSTA_PARCIAL + OFERECER_HUMANO` na busca compartilhada.
- Troca de perfil preserva mensagens; reiniciar limpa mensagens, perfil e encaminhamento.
- Feedback negativo oferece WhatsApp com a pergunta correspondente e o perfil daquela resposta.
- Preservar fallback local, proteção de dados sensíveis, contexto do Worker e identidade visual.
- Não copiar o atraso artificial, o contador de trocas ou o bloqueio por expressões como “meu cartão”.

## Evidência inicial e riscos

`npm run check` passou. Os testes de busca/Worker tiveram 136 sucessos e três falhas:
contrato de campos da FAQ desatualizado, contagem comercial antiga (17 em vez de 20)
e colisão entre “funcionalidades” e “funcionário” na busca por radical.
A busca exata devolveu `handoff: false` até para `falar-com-humano`.
O anexo encaminhou “Perdi meu cartão” sem mostrar a orientação de bloqueio.

Mudanças no módulo compartilhado também exigem publicação separada do Worker para
atingir o atendimento remoto. Esta tarefa prepara e valida localmente, sem deploy.

## Resultado validado

- Implementa??o local conclu?da, preservando os 54 itens e os textos completos da FAQ.
- `node --test src/faq-search.test.mjs chat-worker/index.test.mjs`: 142 testes passaram.
- `npm run check`: TypeScript, build, dois testes da rota de privacidade e auditoria
  de cores passaram; zero viola??es de paleta/contraste e zero assets ?rf?os.
- Playwright: perda de cart?o mostra bloqueio + atendimento; perfil alterna e persiste;
  feedback de resposta antiga preserva pergunta/perfil originais; reset limpa a conversa;
  Escape fecha e devolve foco ao lan?ador. Painel/input e resposta vis?veis em 1366,
  900, 520, 390 e 320 pixels de largura.
- Falha de rede simulada confirmou busca local e libera??o do campo ap?s o erro.
- Duas chamadas reais ao Worker publicado retornaram HTTP 200: pergunta sobre carteira
  e continua??o sobre senha aceita, sem pedir a senha. Esse teste confirma a integra??o
  com o servi?o existente; o c?digo compartilhado alterado ainda n?o foi publicado nele.
- N?o houve deploy, commit ou envio de WhatsApp. Sem teste em aparelho f?sico.

Evid?ncias: `docs/design-references/assistente-comparacao-atual-1366x900.png`,
`assistente-comparacao-anexo-1366x900.png`, `assistente-comparacao-anexo-390x844.png`,
`assistente-combinado-1366x900.png` e `assistente-combinado-390x844.png`.
