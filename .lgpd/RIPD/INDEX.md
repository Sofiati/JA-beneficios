# Índice de RIPDs (L11)

**Data**: 2026-11-06 · **Veredito**: **N/A — nenhuma atividade do data map atinge porte de alto risco**
**Escopo testado**: A001 (lead), A002 (chat), A003 (handoff WhatsApp), A004 (logs)

## Teste cumulativo (Res. 2/2022, Art. 4º)

**1º bloco — critério geral (pelo menos 1):**

| Critério | A001 | A002 | A003 | A004 |
|---|---|---|---|---|
| (a) Larga escala (threshold prático ANPD: >2 mi titulares) | Não — leads corporativos de um site B2B, retenção 90 dias | Não — conversas transitórias, zero persistência | Não — conversas individuais no celular corporativo | Não — logs de operadores, baixo volume |
| (b) Afeta significativamente interesses/direitos fundamentais | Não — dados de contato informados voluntariamente para solicitação comercial | Não — resposta a dúvidas comerciais | Não — continuidade de atendimento pedido pelo próprio titular | Não |

** blocos separados — critério específico (pelo menos 1):**

| Critério | Avaliação |
|---|---|
| (a) Tecnologias emergentes/IA | ⚠️ **Parte sim**: o assistente de chat usa Gemini como fallback de resposta. **Não dispara o RIPD sozinho** — o teste é cumulativo e o 1º bloco não é atendido (nem larga escala, nem impacto significativo). Nota: o risco do Gemini **free tier** já está tratado em `vendors/gemini.md` e no gap #15 (migração p/ paid tier). |
| (b) Vigilância de zonas públicas | Não |
| (c) Decisão automatizada / profiling | Não — o chat responde dúvidas; não decide nada sobre o titular (Art. 20 LGPD = N/A) |
| (d) Dados sensíveis / de menores / idosos | Não (data map confirma; menores excluídos — ver `eca-digital.md`) |

## Conclusão

Nenhum RIPD obrigatório. Não se produz `.lgpd/RIPD/ripd-*.md` — produzir um documento
sem atividade de alto risco seria burocracia vazia (menos é melhor).

## Gatilhos de revisão — reabrir este teste se:

1. Volume de leads crescer para escala relevante (centenas de milhares).
2. Gemini (ou outro IA) passar a **analisar/perfilar** titulares em vez de responder dúvidas.
3. Início de coleta de dado sensível ou de menor (nem deve acontecer).
4. **A ANPD exigir** (Art. 38 — vale sempre, inclusive para legítimo interesse Art. 10 §3º;
   a análise A002 já está coberta pela LIA em `lia/a002-chat-assistente.md`).
