# Mapa de Dados — JA-benefícios

**Versão**: v1
**Data**: 2026-11-06
**Controlador**: Já Benefícios e Pagamentos Ltda. — CNPJ 52.316.137/0001-53
**Owner global**: Encarregado — pendente designação (ver `gaps.md` #10)
**Método**: engenharia reversa do código (Pipeline B/L2) — evidências em `discovery.md`

## Atividades de Tratamento

### A001 — Captação de lead comercial (formulário)

| Campo | Valor |
|---|---|
| Slug | a001-lead-comercial |
| Finalidade (Art. 6º, I) | Atender solicitação comercial: prospecção e orçamento de benefícios corporativos (plano de saúde etc.) |
| Base legal | Art. 7º, I — **consentimento** (checkbox obrigatório, desmarcado por padrão, vinculado à `/privacidade`) → ver [legal-basis](./legal-basis.md) |
| Categorias de titulares | Prospects adultos (representantes de empresas) — sem crianças/idosos |
| Sensíveis? (Art. 5º, II) | Não. Nota: "o que procura" pode revelar contexto de saúde — monitorar |
| Dados | nome completo, WhatsApp, e-mail corporativo, nome da empresa, nº de colaboradores, área, cargo, "o que procura", URL da página, timestamp (URL/timestamp precisam de finalidade declarada — ver L3) |
| Fonte | Coletado do titular (formulário web) |
| Sistemas | Transporte: Web3Forms (`api.web3forms.com`) → **caixa de e-mail comercial** (único repositório; não há banco de dados) |
| Operadores | Web3Forms (Web3Creative, Kerala/Índia — servidores US-East): processa e encaminha, **não armazena submissions**; logs de servidor apagados a cada ~2 meses (docs oficiais, 2026-11-06); provedor do e-mail comercial (a confirmar) |
| Transferência intl. | Sim — EUA (infra Web3Forms) e provedor de e-mail (a confirmar); país-mãe da operadora: Índia (não há hipótese de adequação → SCCs Res. 19/2024) — ver `transfers/` |
| Retenção | **Indefinido na caixa de e-mail** (Web3Forms retém só logs ~2 meses) — a corrigir em L5 |
| Segurança | TLS (HTTPS), honeypot anti-bot |
| Alto risco? | Não (não é larga escala; sem profiling/decisão automatizada/sensíveis) |
| RIPD | N/A |
| Owner | Comercial (a designar); responsável técnico: Elcio |

### A002 — Assistente de chat JÁ (Cloudflare Worker)

| Campo | Valor |
|---|---|
| Slug | a002-chat-assistente |
| Finalidade (Art. 6º, I) | Resposta automática às dúvidas dos visitantes sobre os benefícios |
| Base legal | Art. 7º, IX — legítimo interesse, **LIA aprovado tecnicamente** → [legal-basis](./legal-basis.md) + [LIA](./lia/a002-chat-assistente.md) |
| Categorias de titulares | Visitantes adultos; site B2B — sem menores |
| Sensíveis? | Não por design — a UI instrui a não enviar CPF, senhas ou dados de cartão; o Worker bloqueia sequências não privilegiadas (path "blocked") antes de enviar ao modelo |
| Dados | mensagem (máx. 450 chars), histórico recente da conversa (só quando a FAQ local não resolve), IP tratado pela Cloudflare (infra) |
| Fonte | Coletado do titular (caixa de chat) |
| Sistemas | `chat-worker/index.js` (Cloudflare Workers) — sem armazenamento persistente (sem KV/DB) |
| Operadores | Cloudflare (runtime); Google (Gemini API, quando a busca local não resolve) |
| Transferência intl. | Sim — Gemini API: mensagem + histórico → EUA (ver `transfers/`) |
| Retenção | Zero no Worker; política de retenção dos logs da Cloudflare — a confirmar |
| Segurança | Log do Worker sanitizado (sem texto da pergunta), CORS whitelist, limite de tamanho, `cache-control: no-store` |
| Alto risco? | Não (sem decisão automatizada com efeito jurídico) |
| RIPD | N/A |
| Owner | Técnico: Elcio |

### A003 — Handoff para WhatsApp (comercial)

| Campo | Valor |
|---|---|
| Slug | a003-handoff-whatsapp |
| Finalidade (Art. 6º, I) | Transferir a conversa do assistente para atendimento humano via WhatsApp |
| Base legal | Art. 7º, V — procedimentos pré-contratuais a pedido do titular → [legal-basis](./legal-basis.md) |
| Categorias de titulares | Visitantes que clicam |
| Sensíveis? | Não por design (mesmo aviso do chat) |
| Dados | texto do handoff (contexto da conversa A002) + número do WhatsApp da empresa |
| Fonte | Iniciado pelo titular |
| Sistemas | nenhum (link `wa.me` direto para o WhatsApp da empresa) |
| Operadores | WhatsApp/Meta (conversa ocorre no app) |
| Transferência intl. | Sim — Meta (ver `transfers/`) |
| Retenção | No app WhatsApp (terceiro) — fora do controle do site |
| Segurança | E2E do app WhatsApp (fora do escopo do projeto) |
| Alto risco? | Não |
| RIPD | N/A |
| Owner | Comercial (a designar) |

### A004 — Logs operacionais e infra (visitante)

| Campo | Valor |
|---|---|
| Slug | a004-logs-infra |
| Finalidade (Art. 6º, I) | Operação e segurança da infraestrutura: medição de latência, acerto da busca da FAQ, abuso/bots |
| Base legal | Art. 7º, IX — legítimo interesse, **LIA aprovado tecnicamente** → [legal-basis](./legal-basis.md) + [LIA](./lia/a004-logs-infra.md) |
| Categorias de titulares | Todos os visitantes |
| Sensíveis? | Não |
| Dados | IP (tratado pelo hosting/CDN), user-agent, métricas de tempo; **sem o conteúdo da pergunta do chat no log** |
| Fonte | Observado automaticamente |
| Sistemas | Provedor de hosting da landing page (deploy `.zip` — a confirmar qual é) + Cloudflare Worker |
| Operadores | Provedor de hosting + Cloudflare |
| Transferência intl. | Provável (ver `transfers/`) |
| Retenção | Conforme política das operadoras — a confirmar |
| Segurança | Sanitização no Worker; sem cookies |
| Alto risco? | Não |
| RIPD | N/A |
| Owner | Técnico: Elcio |

## Checklist de qualidade

- [x] "Tabela com FK para User" — N/A (não há banco de dados neste projeto)
- [x] Toda integração de terceiro listada como compartilhamento (Web3Forms, Cloudflare, Google Gemini, WhatsApp/Meta)
- [x] Toda atividade com base legal explícita — **L3 concluído 2026-11-06** (`.lgpd/legal-basis.md` + LIAs em `.lgpd/lia/`)
- [x] Alto risco flagado: nenhuma atividade (não é larga escala; sem profiling/sensíveis/menores) → nenhum RIPD obrigatório
- [x] Menores flagados: nenhum (site B2B de benefícios corporativos) — ECA Digital provavelmente N/A; reavaliar se o público mudar
- [x] Retenção definida (sem "indefinido") — **L5 concluído 2026-11-06** — `.lgpd/retention.md` (R001-R006: lead 90d/relação+5y, chat zero, logs por operador)

## Dúvidas abertas (confirmar com o usuário)

1. Qual provedor hospeda a landing page (o `deploy.zip` é enviado aonde)?
2. Qual é o provedor do e-mail comercial que recebe os leads (Google Workspace, M365, outro)?
4. ~~Há leads copiados para CRM?~~ → **Comercial confirmou (2026-11-06): leads ficam só na caixa de e-mail** — sem CRM/planilha/grupos; não há atividade A005. Provedores de hosting e de e-mail seguem "a confirmar" (L4 — vendor audit).
