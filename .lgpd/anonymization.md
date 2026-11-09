# Anonimização / Pseudonimização — Avaliação (L6)

**Data**: 2026-11-06 · **Veredito**: **N/A no escopo atual** · Art. 5º, XI e Arts. 12-13 LGPD

## Por que N/A
A anonimização/pseudonimização importa quando há **pipeline de analytics/ML** sobre dados
pessoais. Neste projeto:
- Não há analytics: **zero cookies/rastreadores**, sem CRM, sem planilha compartilhada (confirmado pelo comercial).
- Sem modelo próprio (o único modelo é o Gemini, governado pelo vendor audit em L4).
- O único relatório do processo é a **contagem mensal de leads eliminados** (P1 de `retention.md`) — que **já nasce anônimo** ("N eliminações", sem dado).
- Não há necessidade de k-anonymity nem differential privacy — nada agregado sobre pessoas é produzido.

## Quando revisar (gatilhos)
1. Se o time começar a **analisar taxa de conversão por empresa/área** (ex.: exportar leads para planilha com análise comercial) → aplicar pseudonimização do identificador antes e reavaliar com `lgpd-anonymization`.
2. Se o modelo Gemini passar a ser usado para **perfilar visitantes** (além de responder dúvidas) → nova finalidade, exige base legal própria e provavelmente RIPD.
3. Se houver exportação de logs com PII para uma ferramenta de analytics → reavaliar.

Enquanto nada disso existir: **menos é melhor — nada a construir**.
