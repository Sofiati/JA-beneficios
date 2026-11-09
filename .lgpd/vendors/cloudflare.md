# Operador: Cloudflare (runtime do chat-worker)

- Razão social / registro: Cloudflare, Inc. (EUA)
- País(es) de tratamento: rede global (com pontos de presença no Brasil); Cloudflare oferece residência de log conforme plano
- Finalidade: executar o serverless worker do Assistente JÁ (atividade A002) — processamento transitório, sem armazenamento próprio do projeto
- Dados compartilhados: mensagem/conversa em trânsito + IP (infra); **sem persistência no worker** (sem KV/DB) | Sensíveis? Não
- Tier: **Médio** (acesso transitório e limitado; sem repositório)
- Owner interno: técnico — Elcio
- Última revisão: 2026-11-06 | Próxima revisão: anual (tier Médio)

## Contrato e base legal
- [ ] 🚫 DPA assinado — Cloudflare **oferece** DPA padrão com SCCs (o "Cloudflare DPA" aceitável no painel/Onboarding) — **ação: formalizar**

## Segurança (Art. 46)
- [x] TLS 1.3
- [x] Certificações: ISO 27001/27018/27701 + SOC 2 Tipo II (Cloudflare publica relatórios)
- [x] Logs de acesso: Cloudflare Logs (conforme plano)

## Sub-operadores
- [x] Lista pública e atualizada de subProcessadores da Cloudflare

## Transferência internacional (Art. 33 / Res. 19/2024)
- [x] Base do Art. 33: DPA Cloudflare embute SCCs adequadas (Res. 19/2024 Anexo II adotável)
- [x] Países: global (BR incluso)
- [ ] **Ação**: ativar opção de permanência geográfica de logs (EU/Brasil...) se disponível no plano

## Direitos do titular e retenção
- [x] Sem repositório de dados do projeto — escopo de retenção limitado aos logs padrão do serviço
- [x] Atestado de eliminação ao fim do contrato: standard Cloudflare

## Incidentes
- [x] Robust Ops: https://www.cloudflare.com/security/incident-response — compromisso de notificação designado

## Avaliação — Cloudflare
- Itens atendidos: 12/15
- Eliminatórios: OK (após formalização do DPA — único pendente)
- Veredito: **APROVADO COM RESSALVAS** — formalizar DPA/SCCs e registrar na política
