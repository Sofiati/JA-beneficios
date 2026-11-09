# Operador: Google — Gemini API (assistente de chat)

- Razão social / registro: Google LLC (1600 Amphitheatre Pkwy, Mountain View, EUA)
- País(es) de tratamento: EUA (podem ser cacheados em "qualquer país com instalações Google" — termos v. 23/03/2026)
- Finalidade: gerar resposta do Assistente JÁ quando a busca local na FAQ não resolve (atividade A002)
- Dados compartilhados: mensagem do visitante (≤450 chars) + trecho do histórico da conversa | Sensíveis? Não por design (UI avisa; Worker bloqueia padrões antes do envio)
- Tier: **Crítico** (processa o conteúdo conversacional do titular)
- Owner interno: técnico — Elcio
- Última revisão: 2026-11-06 | Próxima revisão: trimestral (tier Crítico)

## Contrato e base legal
- [ ] **🚫 DPA assinado** — NO free tier não há DPA (Google atua como controller p/ melhorar produtos)
- [x] Papel definido — depende do tier: free = Google controller (❗); paid = Google operador com DPA (Data Processing Addendum: business.safety.google/processorterms)
- [x] Finalidade bate com ROPA (A002)
- [x] Base legal do compartilhamento — legítimo interesse (LIA A002) cobre a resposta ao titular; não cobera o uso dos dados de conversa para treino de produtos de terceiros no free tier

## Segurança (Art. 46)
- [x] TLS em trânsito
- [x] Certificações: Google Cloud mantém ISO 27001/27017/27018/27701 + SOC 1/2/3 (GESTÃO geral)
- [ ] Logs de acesso à disposição do controlador — no paid tier, logs temporários só p/ abuso

## Sub-operadores
- [x] Termos remetem à rede Google Cloud; lista macro disponível (Google Cloud subprocessors)

## Transferência internacional (Art. 33 / Res. 19/2024)
- [x] Base do Art. 33 possível: contratualidade via termos + DPA no paid tier
- [x] Países: EUA (+ cache global)
- [ ] Avaliação de risco do país — pendente (`transfers/`)

## Direitos do titular e retenção
- [x] Paid tier: prompts/respostas não usados para melhorar produtos; logs temporários só p/ deteção de abuso
- [x] Free tier: **Google usa o conteúdo para treinar/evoluir produtos e revisores humanos podem ler input/output**, desconectados da conta — retenção por tempo indeterminado em usos analíticos
- [x] Eliminação ao fim: sem persistência propia do controlador (conversa vive só na sessão)

## Incidentes
- [x] Canal de segurança do Google Cloud; histórico público (VRP) — sem incidentes não comunicados relevantes

## Avaliação — Google Gemini API
- Itens atendidos: 10/15
- Eliminatórios (🚫): **REPROVADO no free tier**
- Veredito: **REPROVADO — substituir a forma de uso**:
  **ação (gap novo #15)**: migrar o `GEMINI_API_KEY` para uma conta **com faturamento ativo** (paid tier) — aí o Google passa a operador sob DPA e deixa de usar as conversas para treino/revisão humana; ou remover o fallback de modelo e manter só a FAQ local.
- Gaps abertos: ver `.lgpd/gaps.md` #15 e transferência em `transfers/`.
