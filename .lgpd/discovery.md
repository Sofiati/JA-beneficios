# Discovery — LGPD Audit (Pipeline B)

**Data**: 2026-11-06 · **Método**: revisão de código (landing page estática + Web Worker de chat)

## 1. Schema de banco
Inexistente — a landing page não tem backend próprio. Nenhum dado pessoal é
gravado em banco pelo projeto. **Onde os leads realmente ficam**: caixa de
entrada comercial (e-mail) — destino do e-mail gerado pelo Web3Forms.

## 2. APIs / endpoints
- `POST https://api.web3forms.com/submit` — envio do lead (client-side, `src/mail.ts`).
- `POST {chat-worker}` (Cloudflare Worker, `chat-worker/index.js`) — assistente de chat;
  resposta via busca na FAQ local (`src/faq.json`) ou Google Gemini
  (`generativelanguage.googleapis.com`, modelo `gemini-3.5-flash-lite`).

## 3. Dados pessoais coletados
**Formulário único de benefícios** (`src/components/CustoZero.tsx`, 8 campos):
nome completo, WhatsApp, e-mail corporativo, nome da empresa, número de
colaboradores, área, cargo atual, "o que procura" + checkbox de
consentimento obrigatório vinculado à política + honeypot (#botcheck). O payload enviado inclui
URL da página (`window.location.href`) e timestamp.
- Nenhum dado sensível (Art. 5º, II) evidente — área/cargo são dados profissionais.
- `src/mail.ts` também modela `heroForm`/`ctaForm` como origens (labels), mas
  nenhum componente além de CustoZero chama `sendLeadEmail` — sources residuais de versão anterior.

**Chat** (`FloatingActions.tsx` + Worker): mensagem (máx. 450 chars) + histórico
da conversa (enviado ao Gemini quando a FAQ não resolve; nunca armazenado no Worker).

## 4. Cookies e tracking
**Nenhum** — sem GTM, pixels, analytics, cookies de terceiros ou rastreadores
(grep em `index.html` e fonts/scripts). IP do visitante só é tratado pela infra de
hosting. Sem coleta além da infra (privacy-by-design — Art. 46 §2º: limitação de finalidade).

## 5. Operadores (operadores ativos)
| Operador | Função | Localização (provável) | Contrato/DPA? |
|---|---|---|---|
| Web3Forms | serviço de envio de formulário (repassar lead → e-mail) | EUA/índia? (a confirmar) | ✗ |
| Cloudflare | host do chat-worker (Workers runtime) | rede global (pop BR incluso) | sem DPA específico deste projeto |
| Google (Gemini API) | geração de resposta do chat | EUA | ✗ (Google Cloud ToS genérico) |
| Caixa de e-mail comercial | destino/repositório do lead | a confirmar | ✗ |

## 6. Transferência internacional
- Resposta de chat → Gemini API (EUA) — Art. 33 LGPD + Res. 19/2024 aplicáveis.
- Lead → Web3Forms (país a confirmar) e depois e-mail comercial.
- Res. 19/2024: SCCs brasileiras (Anexo II) obrigatórias para transferências sem adequação.

## 7. Política de privacidade existente
Rota `/privacidade` (`PrivacyPolicy.tsx`) — conteúdo iubenda genérico de
**05/02/2024** referente ao serviço **jadigital.com.br** com owner **"Já Digital
Instituição de Pagamento S.A."** e contato `privacidade@jadigital.com.br`.
**Pontos de atenção**: menciona GDPR (não LGPD); desloca para o usuário a responsabilidade de
dados de terceiros; declara Cookies próprios ("Rastreadores necessários") — a página na
verdade não carrega nenhum; não lista os campos do formulário; retenção genérica;
**controlador errado**: é Já Benefícios e Pagamentos Ltda. (CNPJ 52.316.137/0001-53),
confirmado em 2026-11-06 — corrigir na reescrita (L9).

## 8. Consentimento
Checkbox **required** no único formulário (CustoZero), vinculado à política. `mail.ts`
tem campo `consent` opcional no payload — só CustoZero o alimenta.
Não há formulários antigos (hero/cta) que `mail.ts` ainda rotula apenas nos labels.

## 9. Encarregado
Não designado/publicado nesta página. A política cita `privacidade@jadigital.com.br`
(um canal de contato). Res. 18/2024 exige divulgação em destaque. Status ATPP da
empresa (receita ≤ R$16M/ano?) precisa ser confirmado — afeta prazos e designação.

## 10. Incidentes anteriores
Nenhum registro. Sem runbook. Sem log de incidentes (Res. 15/2024 Art. 10 — 5 anos).

## 11. DSAR / direitos do titular
Apenas `mailto:` na política. Sem canal dedicado, workflow ou prazo. Art. 19 II: 15 dias corridos.

## 12. Segurança
- TLS (`https`), honeypot, CORS whitelist no Worker, limite de tamanho, timeout no fetch — bom.
- Sem log de accountability de tratamento (Art. 6º, X) — gap de audit logging, severidade média.
- `VITE_WEB3FORMS_KEY` pública no bundle: normal para serviços de formulário,
  mas habilita spam (preenchimento falso de leads) — risco de disponibilidade/integridade, não de confidencialidade.
