# Bases Legais por Atividade de Tratamento

**Última atualização**: 2026-11-06
**Controlador**: Já Benefícios e Pagamentos Ltda. — CNPJ 52.316.137/0001-53
**Entradas**: derivadas de `.lgpd/data-map.md` (v1) — Art. 7º LGPD (dados comuns; nenhuma atividade trata dados sensíveis — Art. 11 N/A)

## A001 — Captação de lead comercial (formulário)

- **Finalidade** (Art. 6º, I): atender pedido do próprio titular — prospecção/orçamento de benefícios corporativos
- **Dados tratados**: nome, WhatsApp, e-mail corporativo, empresa, nº colaboradores, área, cargo, "o que procura", URL da página e timestamp (contexto da solicitação)
- **Sensíveis?**: Não — Art. 11 N/A
- **Base legal**: **Art. 7º, I — consentimento** (checkbox obrigatório, desmarcado por padrão, vinculado à `/privacidade`)
- **Justificativa**: o próprio fluxo exige consentimento explícito e específico (o titular clica para solicitar contato comercial). Bases alternativas inviáveis ou supérfluas: Art. 7º, IX (marketing direto) endureceria LIA sem ganho; Art. 7º, V (pré-contratual) aplica-se à conversa que segue ao contato, mas a coleta em si já está coberta pelo consentimento. Ambas convergem no mesmo resultado: **sem clicar em "Aceito", não há coleta**.
- **Consistência técnica**: `consent: false` por padrão (`CustoZero.tsx:191`) e envio bloqueado sem marcação — sem checkbox pré-marcado (cláusula armadilha: OK)
- **LIA**: N/A
- **Retenção**: preliminar — eliminar o e-mail do lead após X dias sem conversão (definir em L5; Art. 16)
- **Revogação possível?**: Sim (Art. 18, IX) — pedir exclusão pelo canal DSAR (a implementar em L7)
- **Última revisão**: 2026-11-06

## A002 — Assistente de chat JÁ

- **Finalidade** (Art. 6º, I): responder dúvidas do visitante sobre os serviços ofertados (suporte pré-venda)
- **Dados tratados**: mensagem (máx. 450 chars), histórico recente da conversa (só quando a FAQ não resolve), IP (infra)
- **Sensíveis?**: Não por design — UI avisa para não enviar CPF/senhas/dados de cartão; Worker bloqueia antes de enviar ao modelo
- **Base legal**: **Art. 7º, IX — legítimo interesse** — [LIA](./lia/a002-chat-assistente.md)
- **Justificativa**: oferecer atendimento ao visitante é benefício mútuo (titular pergunta, controlador atende); consentimento seria inadequado (o chat é aberto ao simples uso do site e a coleta intrínseca à resposta da pergunta); pré-contratual (Art. 7º, V) só caberia depois de identificado um lead. O envio ao Gemini é instrumento necessário para responder quando a FAQ local não resolve.
- **LIA**: aprovado tecnicamente (ver arquivo) — **pendência para revisão jurídica/internalizar**
- **Retenção**: zero —Worker não armazena nada; conversa vive só na sessão do navegador
- **Revogação possível?**: N/A — basta encerrar a conversa; não há persistência
- **Última revisão**: 2026-11-06

## A003 — Handoff para WhatsApp (comercial)

- **Finalidade** (Art. 6º, I): dar continuidade humana ao atendimento chamado pelo próprio visitante
- **Dados tratados**: texto do handoff (contexto da conversa) + número do WhatsApp da empresa
- **Sensíveis?**: Não por design
- **Base legal**: **Art. 7º, V — execução de procedimentos pré-contratuais a pedido do titular**
- **Justificativa**: aqui o próprio titular **pede** o contato humano (ação explícita: clicar no "Falar pelo WhatsApp"). É exatamente a hipótese "procedimentos pré-contratuais a pedido do titular". A conversa seguinte ocorre no app do terceiro (WhatsApp/Meta) sob os termos deles — não é tratamento do responsável por este site.
- **LIA**: N/A
- **Retenção**: N/A no site — a conversa vive no aplicativo de terceiros
- **Revogação possível?**: Sim — o titular simplesmente não envia a mensagem
- **Última revisão**: 2026-11-06

## A004 — Logs operacionais e infra

- **Finalidade** (Art. 6º, I): operar e proteger a infraestrutura (disponibilidade, latência, prevenção a abuso)
- **Dados tratados**: IP, user-agent, métricas de tempo; log do Worker sanitizado (sem conteúdo da pergunta)
- **Sensíveis?**: Não
- **Base legal**: **Art. 7º, IX — legítimo interesse** — [LIA](./lia/a004-logs-infra.md)
- **Justificativa**: segurança e operação são interesses legítimos do controlador reconhecidos no Art. 10, II (proteção em servlet seguros); sem logs é impossível operar/diagnosticar/evitar abuso do formulário público
- **LIA**: aprovado tecnicamente (ver arquivo)
- **Retenção**: segundo políticas das operadoras (Web3Forms: ~2 meses p/ logs de servidor; Cloudflare: política própria) — registrar em L5
- **Revogação possível?**: N/A — base independe de consentimento; canal de oposição pela DSAR
- **Última revisão**: 2026-11-06

## Cláusulas armadilha — verificação

| Armadilha | Status |
|---|---|
| Checkbox pré-marcado | OK — default `false`, sem marcação não envia |
| "Concordo com tudo" | N/A — consentimento único e específico p/ contato comercial |
| Legítimo interesse + dados sensíveis | OK — nenhuma atividade trata sensíveis |
| "Aceitar para usar serviço" p/ fins não essenciais | OK — o consentimento é p/ contato comercial (finalidade central do formulário); chat e logs usam base própria |
