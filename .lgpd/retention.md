# Retenção e Eliminação — JA-benefícios

**Data**: 2026-11-06 · **Base**: Arts. 15-16, 18 VI LGPD · Derivado de `data-map.md`
**Contexto**: sem banco de dados próprio — "repositórios" são a caixa de e-mail comercial,
o celular corporativo (WhatsApp) e logs de operadores. Prisma RetentionRule/cron da
skill N/A — mensagem equivalente em procedimentos operacionais abaixo.

## Hierarquia aplicada
Nenhuma atividade do site retém dado por **obrigação legal** (não há nota fiscal,
folha, autenticação bancária ou log sob guarda da própria empresa aqui). Logo:
**eliminação plena (hard delete) é a regra** — a caixa de e-mail é prospect de pré-consumo.

## Regras de retenção (papel: `RetentionRule`)

| ID | Atividade | Dado | Retenção | Pós-retenção | Critério de disparo |
|---|---|---|---|---|---|
| R001 | A001 lead | e-mail do lead no inbox | **90 dias** sem interação comercial | HARD DELETE (e-mail + pasta spam/lixeira) | sem resposta/tratativa após o último contato |
| R002 | A001 lead convertido | e-mail do lead + conversa | vigências da **relação comercial** + **5 anos** (CDC Art. 27 — prescrição de consumo) | HARD DELETE | fim da relação + 5 anos |
| R003 | A002 chat | conversa do assistente | **zero** (nada persiste) | N/A | — |
| R004 | A003 WhatsApp | conversa de lead no celular corporativo | **90 dias** sem fechamento de negócio, igual R001 | exclusão da conversa no app | rotina mensal do comercial |
| R005 | A004 logs | logs de Web3Forms (servidor) | ~2 meses (política Web3Forms) | apagado pelo operador | automático |
| R006 | A004 logs | logs do worker Cloudflare | conforme plano/retention do provedor | política do operador | automático |

> R002 — se o lead vira cliente, os documentos **da relação** (contrato, notas) seguem
> retenção trabalhista/fiscal própria do ERP da empresa — **fora do escopo deste site**;
> aqui se registra apenas o espelho em e-mail do lead.

## Procedimentos de eliminação (papel: "cron job" da skill)

### P1 — Limpeza mensal do inbox (comercial)
1. Filtro: e-mails "Nova solicitação de contato comercial" com data > 90 dias sem resposta/thread.
2. Excluir os e-mails e esvaziar a lixeira do cliente de e-mail.
3. Registro manual: registrar o número no mês em `.lgpd/incidents/log.md` — apenas "N leads eliminados", sem dado.

`ponytail:` regra de caixa de entrada/autoclean do provedor pode automatizar depois; o procedimento mensal cobre o mínimo com o que já existe.

### P2 — Limpeza mensal do WhatsApp corporativo (comercial)
1. Conversas com lead com mais de 90 dias de inatividade → excluir conversa.
2. **Proibido** encaminhar leads/PII para grupos além do comercial designado.

### P3 — Eliminação a pedido do titular (Art. 18, VI) — também será o fluxo do DSAR (L7)
1. Localizar e-mails do lead na caixa (busca pelo e-mail da pessoa).
2. Excluir definitivamente e esvaziar a lixeira (cancelar qualquer encaminhamento para spam).
3. Verificar conversa no WhatsApp corporativo (se houver) e excluir.
4. Confirmar ausência de outras cópias: Web3Forms não armazena (ok), chat não persiste (ok).
5. Registrar em `.lgpd/incidents/log.md` e responder ao titular (Art. 19, II — 15 dias corridos).

## Backups e réplicas
- Não há backup próprio de leads (o e-mail pode ter cópia transitória no servidor do provedor) — **o procedimento P3 inclui exclusão permanente e, se possível, expurgo via ferramenta do provedor**, quando o provedor for confirmado (gap #16).
- Logs de operadores: governados por política deles (R005/R006).
