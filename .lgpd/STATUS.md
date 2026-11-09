# LGPD Audit Status

**Projeto**: JA-benefícios (landing page de geração de leads)
**Cenário**: B — Legacy retrofit
**Início**: 2026-11-06
**Última atualização**: 2026-11-06
**Encarregado**: pendente designação

## Pipeline atual
- [x] L0 — Setup `.lgpd/`
- [x] L1 — Legacy retrofit (gap analysis) ⏸ CHECKPOINT — aprovado em 2026-11-06 (controlador confirmado)
- [x] L2 — Data mapping (ROPA reverso) — 4 atividades inventariadas, nenhuma de alto risco
- [x] L3 — Legal basis retroativa — Art. 7º I/IX/V por atividade + 2 LIAs
- [x] L4 — Vendor audit (operadores ativos) — 4 fichas: 2 reprovadas (Gemini free tier, Web3Forms), 2 com ressalvas
- [x] L5 — Retention & erasure — regras R001-R006 + procedimentos P1-P3 em `.lgpd/retention.md`
- [x] L6 — Anonymization — **N/A** documentado (`.lgpd/anonymization.md`) — não há pipeline de analytics; gatilhos de revisão registrados
- [x] L7 — DSAR (endpoint mínimo) — workflow + log em `.lgpd/dsar/` (canal por e-mail dedicado; endpoints N/A — sem login/banco)
- [x] L8 — Incident response (runbook) — `runbook.md` + templates ANPD/titulares + `log.md` (0 incidentes); 2 primeiros vetores reais: 2FA no inbox e celular corporativo
- [x] L9 — Privacy policy — **draft v2.0** em `.lgpd/policies/privacy-policy-v2-draft.md` — ⏸ CHECKPOINT aguardando revisão jurídica (não publicar antes)
- [ ] L9 — Publicação no site (após revisão jurídica + placeholders)
- [x] L10 — ECA Digital — **N/A documentado** (`.lgpd/eca-digital.md`) — site B2B, não destinado a menores; 3 gatilhos de revisão
- [x] L11 — RIPD — **N/A documentado** (`.lgpd/RIPD/INDEX.md`) — teste cumulativo Res. 2/2022 Art. 4º sem passagem em nenhum critério geral; IA (Gemini) presente mas teste é cumulativo
- [x] L12 — Encarregado — estrutura + interim em `.lgpd/encarregado.md` — ⏸ pendem: nome, ato formal, e-mail dedicado, divulgação no site
- [x] L13 — STATUS final + plano de remediação priorizado — **pipeline concluído**

## Resultado (L13 — fechamento, 2026-11-06)

**Veredito geral**: o site está em **conformidade estrutural** — documentação LGPD completa,
dado mínimo, zero rastreadores. Riscos concentrados em **operação** (Gemini free tier,
Web3Forms sem instrumento, 2FA ausente) e em **publicação da política**, que depende de
revisão jurídica + 5 placeholders (domínio, e-mail, endereço, ATPP, 2FA).

- **Crítico aberto**: 1 — Gemini free tier (gap #15).
- **Decisão de negócio pendente**: Web3Forms (substituir ou obter instrumento — gaps #8/#9).
- **Pendências "a confirmar"**: domínio (`jadigital.com.br`?), e-mail dedicado, endereço, ATPP, 2FA, nome do encarregado.

## Artefatos gerados
- `.lgpd/STATUS.md` — v1, 2026-11-06
- `.lgpd/discovery.md` — v1, 2026-11-06 (revisado)
- `.lgpd/gaps.md` — v3 (pós-pipeline) — plano de remediação final priorizado: 1 crítico aberto (Gemini), decisão Web3Forms, 6 pendências "a confirmar"
- `.lgpd/data-map.md` — v1, 2026-11-06 — **4 atividades** (A001 lead, A002 chat, A003 handoff WhatsApp, A004 logs); sem sensíveis, sem alto risco, sem menores
- `.lgpd/legal-basis.md` — v1, 2026-11-06 — base legal por atividade (Art. 7º, I / IX / V)
- `.lgpd/lia/a002-chat-assistente.md` + `.lgpd/lia/a004-logs-infra.md` — LIA v1 (aprovados tecnicamente; ratificação jurídica recomendada)
- `.lgpd/vendors/*.md` — 4 fichas (Google-Gemini, Web3Forms, Cloudflare, WhatsApp/Meta) — L4
- `.lgpd/retention.md` — v1, 2026-11-06 — regras R001-R006 + procedimentos P1-P3 (lead: 90 dias sem tratativa; convertido: relação + 5 anos CDC; conversas WhatsApp: 90 dias; logs: política dos provedores)
- `.lgpd/anonymization.md` — v1, 2026-11-06 — **N/A documentado** (não há pipeline de analytics; 3 gatilhos de revisão)
- `.lgpd/dsar/workflow.md` + `.lgpd/dsar/log.md` — v1, 2026-11-06 — canal por e-mail dedicado, verificação mínima de identidade, SLA 15 dias (30 se ATPP), log de 5 anos
- `.lgpd/incidents/runbook.md` + `templates/anpd.md` + `templates/titulares.md` + `log.md` — v1, 2026-11-06 — runbook H0–T72h, 5 vetores reais do projeto, tabletop anual
- `.lgpd/policies/privacy-policy-v2-draft.md` — ⏸ DRAFT v2.0 (2026-11-06) — aguardando revisão jurídica e placeholders
- `.lgpd/eca-digital.md` — v1, 2026-11-06 — **N/A confirmado** (site B2B; 3 gatilhos de revisão) — L10
- `.lgpd/RIPD/INDEX.md` — v1, 2026-11-06 — **N/A confirmado** (teste cumulativo Res. 2/2022 Art. 4º sem passagem; IA presente mas bloco geral não atendido) — L11
- `.lgpd/encarregado.md` — v1, 2026-11-06 — estrutura da designação + interim (Elcio) + pendências EN-1..EN-5 — L12

## Gaps abertos
Plano de remediação completo e priorizado: **`.lgpd/gaps.md`** (seção "Plano de remediação final").
Gap 12 (identidade do controlador) resolvido: **Já Benefícios e Pagamentos Ltda., CNPJ 52.316.137/0001-53**.
Comercial confirmou: leads ficam **somente** na caixa de e-mail (sem CRM/planilha).

## Próximos passos
1. Revisão jurídica de `.lgpd/policies/privacy-policy-v2-draft.md` + LIAs.
2. Preencher placeholders → reescrever `src/components/PrivacyPolicy.tsx` → `npm run check`.
3. Semana 1 do plano em `gaps.md`: migrar Gemini p/ paid tier (ou remover fallback), ativar 2FA na caixa e no celular, confirmar domínio/provedor de e-mail.
4. Designar encarregado — EN-1..EN-5 em `.lgpd/encarregado.md`.

