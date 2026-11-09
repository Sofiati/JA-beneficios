# Operador: Web3Forms (Web3Creative)

- Razão social / registro: subsidiária de Web3Creative, Kerala, Índia (Udyam UDYAM-KL-10-0039115)
- País(es) de tratamento: EUA (US-East, servidores) — empresa-mãe na Índia
- Finalidade: processar e encaminhar o lead do formulário para o e-mail comercial (atividade A001)
- Dados compartilhados: nome, WhatsApp, e-mail, empresa, nº colaboradores, área, cargo, "o que procura", URL e timestamp (art. A001 do data map) | Sensíveis? Não
- Tier: **Alto** (PII de leads a cada submissão do formulário público)
- Owner interno: comercial (a designar); técnico — Elcio
- Última revisão: 2026-11-06 | Próxima revisão: semestral (tier Alto)

## Contrato e base legal
- [ ] **🚫 DPA assinado** — Web3Forms **declara explicitamente não dar declarações legais e não oferecer DPA** ("we cannot make any legal statements… consult your legal advisor")
- [x] Papel: operador (processa e encaminha; não armazena submissions)
- [x] Finalidade bate com o ROPA (A001)
- [x] Base legal do compartilhamento: consentimento (A001)

## Segurança (Art. 46)
- [x] TLS
- [ ] Certificações SOC 2/ISO — não publicadas
- [ ] Logs de acesso ao controlador — não fornecidos

## Sub-operadores
- [ ] Lista não publicada

## Transferência internacional (Art. 33 / Res. 19/2024)
- [ ] **🚫 Base do Art. 33** — sem DPA nem SCCs: transferência p/ EUA (e gestão na Índia) sem instrumento
- [x] Países mapeados: EUA + Índia (sede/mãe)
- [ ] Avaliação de risco do país — pendente (`transfers/`)

## Direitos do titular e retenção
- [x] Não armazena submissions (docs oficiais) — logs de servidor apagados a cada ~2 meses
- [ ] Atestado de eliminação ao fim do contrato — N/A (não há repositório)
- [x] Prazo de retenção dos logs: ~2 meses

## Incidentes
- [ ] Compromisso de notificação ≤24h — não contratado
- [x] Histórico: sem incidentes públicos conhecidos
- [ ] Canal de segurança dedicado — não public

## Avaliação — Web3Forms
- Itens atendidos: 7/16
- Eliminatórios (🚫): **REPROVADO em: DPA + base CCDO Art. 33**
- Veredito: **REPROVADO — substituir** (ou obter instrumento):
  - **ação (gap #8/#9 reforçado)**: (a) escrever à Web3Forms solicitando compromisso de operador + SCCs Res. 19/2024, **ou** (b) substituir por alternativa com DPA assinável (ex.: provedor com contrato ANPD SCCs) **ou** (c) futuro backend próprio do JA (o chat-worker Cloudflare já é infra controlada) recebendo o formulário e enviando o e-mail — elimina o operador.
- Gaps: ver `.lgpd/gaps.md`
