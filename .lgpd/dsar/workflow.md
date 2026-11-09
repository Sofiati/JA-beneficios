# DSAR — Direitos do Titular (workflow) — JA-benefícios

**Data**: 2026-11-06 · Art. 18 LGPD (9 direitos) · SLA Art. 19, II: **15 dias corridos**
(Res. 2/2022 Art. 14: 30 dias **se** a empresa for ATPP — status a confirmar; usar 15 padrão até confirmar)

## Contexto
Não há login nem banco de dados — os endpoints self-service (GET /api/me…) são **N/A**.
O canal mínimo viável (Pipeline B/L7) é **e-mail dedicado** + fluxo padronizado.
Os dados do titular existem em, no máximo, **três lugares** (`data-map.md`):
e-mail de lead no inbox (A001), conversa WhatsApp corporativa (A003), logs de operadores (A004).

## Canal de intake
- **E-mail dedicado**: `privacidade@{domínio-do-site}` — já citado na política (`PrivacyPolicy.tsx`). *(placeholder: confirmar o domínio real com o usuário — gap #16)*
- Mensagem modelo na política de privacidade v2 (L9): "Para exercer seus direitos, escreva para {e-mail}".

## Verificação de identidade (mínima — Art. 6º, III)
- Pedir **apenas o e-mail usado no formulário** e responder para esse e-mail; se o pedido vier de
  outro endereço, pedir confirmação respondendo ao e-mail existente na caixa (prova possesória).
- **Nunca** pedir CPF/documento como condição — excesso de coleta (Art. 6º, III).

## Fluxo por direito (mapeado ao que existe)

| Direito (Art. 18) | Resposta | Como cumpre |
|---|---|---|
| I — Confirmação de tratamento | no mesmo dia | responder "sim/não há registro de tratamento" |
| II — Acesso aos dados | ≤ 15 dias | localizar o e-mail de lead e encaminhar o conteúdo literal |
| III — Correção | ≤ 15 dias | corrigir no corpo do e-mail de lead salvo (reenviar cópia corrigida) |
| IV — Eliminação de desnecessários | ≤ 15 dias | via data-map + retention (R001-R003 já eliminam por prazo) |
| VI — Eliminação / revogação | ≤ 15 dias + imediato → | **procedimento P3 de `retention.md`** (hard delete inbox + WhatsApp; operadores não retêm) |
| V — Portabilidade | ≤ 15 dias | entregar o e-mail de lead como arquivo (formato estruturado) |
| VII — Informações de compartilhamento | no mesmo dia | responder com a lista da política (operadores: Web3Forms, Cloudflare, Google) |
| VIII — Informações de não-consentimento | no mesmo dia | política informa; sem o "Aceito" nada é enviado |
| IX — Revogação de consentimento | imediato | mesmo fluxo da eliminação (VI) |
| Art. 20 — Decisão automatizada | N/A | chat não decide nada sobre o titular |

## Registro obrigatório (accountability — Art. 10 Res. 15/2024 por analogia)
Cada pedido gera uma linha em `.lgpd/dsar/log.md` (criado agora):
data de recebimento, direito pedido, identidade verificada, resposta dada, data de resposta.
**Prazo mínimo de guarda: 5 anos.**

## SLA e alertas
- Meta: responder em **8 dias** (folga do máximo 15).
- Sem pedidos em fila no início (backlog = 0).
- `ponytail:` sem ticketing/tooling — planilha ou própria pasta de e-mail "DSAR-{ano}" já serve;
  adicionar ferramenta só se o volume crescer.
