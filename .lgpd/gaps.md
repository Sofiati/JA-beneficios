# Gap Analysis e Plano de Remediação — 2026-11-06

Projeto: JA-benefícios · Cenário B (legacy) · Fonte: `.lgpd/discovery.md`

## Resumo
- **Estado pós-pipeline (L0–L13, 2026-11-06)**: base legal, data map, retenção, DSAR, runbook e política draft **concluídos**; críticos **abertos = 1** (Gemini free tier) + decisão Web3Forms; pendências "a confirmar" = domínio/e-mail/endereço/ATPP/2FA/nome do encarregado.

## Vendor Audit L4 — fichas criadas em `.lgpd/vendors/`
- `google-gemini.md` — **REPROVADO no free tier** → migrar p/ paid tier (DPA ativa) ou remover fallback de modelo (gap #15, crítica)
- `web3forms.md` — **REPROVADO** — não oferece DPA e nem instrumento Art. 33 (EUA/Índia) → substituir ou obter instrumento (reforça gaps #8/#9)
- `cloudflare.md` — **APROVADO COM RESSALVAS** — formalizar DPA/SCCs da Cloudflare
- `whatsapp-meta.md` — **APROVADO COM RESSALVAS** — avisar canal na política (L9) + regra de retenção de conversas no celular corporativo (L5)
- Pontos positivos: zero rastreadores/cookies, consentimento obrigatório no formulário,
  chat sem retenção e com log sanitizado, TLS e CORS estritos.

## Matriz de gaps

| # | Item | Status | Evidência | Severidade | Artigo |
|---|---|---|---|---|---|
| 1 | Base legal documentada por atividade | ~~RED~~ **FEITO (L3)** — `legal-basis.md` + LIAs em `lia/` (ratificação jurídica recomendada) | crítica→fechada | Art. 7/10 |
| 2 | ROPA | ~~RED~~ **FEITO (L2)** — `data-map.md` (4 atividades, A001-A004) com finalidade/bases/operadores | crítica→fechada (manter atualizado) | Art. 37 |
| 3 | Runbook de incidente + registro 5 anos | ~~RED~~ **FEITO (L8)** — `incidents/` (runbook + templates + log, 0 incidentes). Pendência operacional: 2FA no inbox e no celular (V2/V5) | crítica→fechada | Art. 48; Res. 15/2024 Art. 10 |
| 4 | Política de privacidade | YELLOW → **draft v2.0 pronto (L9)** em `policies/privacy-policy-v2-draft.md`; ⏸ revisão jurídica + placeholders antes de publicar (substitui iubenda com controlador errado) | alta | Art. 9 (7 elementos) |
| 5 | Encarregado designado e divulgado | YELLOW → estrutura + interim prontos (L12, `encarregado.md`); pendem EN-1..EN-5 (nome, ato formal, e-mail, divulgação) | alta | Art. 41; Res. 18/2024 |
| 6 | Canal DSAR | ~~YELLOW~~ **MÉTODO FEITO (L7)** — workflow + log em `dsar/`; falta apenas o e-mail dedicado (dep. do domínio, gap #16) | alta→média | Art. 18/19 II |
| 7 | Eliminação de dados / retenção | ~~RED~~ **FEITO (L5)** — `retention.md` (R001-R006 + procedimentos P1-P3: lead 90d, convertido relação+5y CDC, WhatsApp 90d) | alta→fechada | Art. 15-16, 18 VI |
| 8 | DPA com operadores | RED→ parcial (L4): Cloudflare APROVADO c/ressalva (formalizar DPA); Gemini reprova no free tier; **Web3Forms reprova** (empresa avalia substituição ou instrumento) | alta | Art. 39 |
| 9 | Cláusulas-padrão transfer. intl. | RED→ parcial — SCCs ANPD (Res. 19/2024) em implantação, conforme fichas em `vendors/`; ciclo fecha na reavaliação de Web3Forms/Gemini | alta | Arts. 33-36; Res. 19/2024 |
| 10 | Retenção definida por atividade | ~~RED~~ **FEITO (L5)** — ver #7 | alta→fechada | Art. 6 V/VI |
| 11 | Audit log de tratamento | YELLOW | sem registro de tratamentos/acessos | média | Art. 6 X |
| 12 | ~~Controle de identidade do controlador~~ **RESOLVIDO** | confirmação do controlador: **Já Benefícios e Pagamentos Ltda., CNPJ 52.316.137/0001-53** (2026-11-06). Política em `/privacidade` nomeia erradamente "Já Digital IPA S.A." → corrigir na reescrita (L9) | resolvida | Art. 5 VII |
| 13 | Duplicidade de origens no código | YELLOW | `mail.ts` mantém labels heroForm/ctaForm sem uso; payload inclui URL da página e timestamp sem finalidade declarada | média | Art. 6 I/II (finalidade/adequação) |
| 14 | ECA Digital (menores) | ~~N/A provável~~ **N/A CONFIRMADO (L10)** — `eca-digital.md` (site B2B, não destinado a menores; 3 gatilhos de revisão) | baixo→fechada | Lei 15.211/2025 |
| 15 | Chat enviando conversas ao Gemini **no free tier** | **RED — CRÍTICO ABERTO** | Google usa conteúdo + revisão humana no free tier e proíbe submeter PII ("Do not submit… personal information"); sem DPA | **crítica** | Art. 7/10; Art. 39; termos Gemini v.23/03/2026 |
| 16 | Hosting e provedor de e-mail a confirmar | YELLOW | deploy.zip (Netlify/Hostinger citados no wrangler.toml) sem identificação formal; domínio provável `jadigital.com.br` a confirmar (bloqueia: e-mail dedicado, P3 do provedor, divulg. encarregado) | média | Art. 39 |

Fonte de prazos usada (não inventada): `~/.agents/skills/lgpd-audit/references/normative-reference.md`.

## Plano de remediação final (pós-pipeline L0–L13)

### 🔴 Semana 1 — críticos e ações de custo zero
1. **Gemini: migrar p/ billings paid tier** (elimina uso para treino + abilita DPA) **ou remover o fallback de modelo** em `chat-worker/index.js` (roda só o FAQ local) — responsável: Elcio — gap #15.
2. **Ativar 2FA na caixa de e-mail comercial e no celular corporativo** — custo zero, cobre os vetores V2/V5 do runbook — responsável: direção + Elcio.
3. **Confirmar hosting/provedor de e-mail e domínio** (provável `jadigital.com.br`) — desbloqueia #16, e-mail dedicado e P3 do provedor — responsável: direção.

### 🟠 Semanas 2-4 — altos
4. **Web3Forms: substituir** (form self-host ou serviço com DPA) **ou obter instrumento Art. 33** — decisão comercial — gaps #8/#9.
5. **Encarregado: designar formalmente (EN-1..EN-5)** — nome + ata/resolução + e-mail dedicado `privacidade@{domínio}` + divulgação na /privacidade — L12.
6. **Formalizar DPA/SCCs com Cloudflare** (portal já oferece) — Elcio.
7. **Publicar política v2** após revisão jurídica + placeholders (domínio, endereço, e-mail, ATPP, 2FA) — reescrever `src/components/PrivacyPolicy.tsx` e rodar `npm run check`.

### 🟡 Backlog (1-3 meses)
8. Treinamento anual do comercial (retenção P1/P2, DSAR, vedações do lead).
9. Higiene do `mail.ts` (labels residuais heroForm/ctaForm; finalidade explícita p/ URL e timestamp no payload).
10. Audit log encadeado quando houver backend (hoje N/A).
11. Revisar LIAs com jurídico (ratificação formal).

Fonte de prazos usada (não inventada): `~/.agents/skills/lgpd-audit/references/normative-reference.md`.

## Aviso
Análise técnica, não jurídica. Recomenda-se revisão por advogado especializado
em proteção de dados antes de publicar política, ROPA final ou responder à ANPD.
