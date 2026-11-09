# LIA — A004 Logs operacionais e infra

- **Atividade**: coleta de logs técnicos (IP, user-agent, timing) por hosting/CDN e pelo chat-worker para operação, diagnóstico e prevenção de abuso
- **Controlador**: Já Benefícios e Pagamentos Ltda. — CNPJ 52.316.137/0001-53
- **Data**: 2026-11-06
- **Versão**: v1 (rascunho técnico — revisar com jurídico/encarregado)
- **Próxima revisão**: 2027-11-06

## 1. Teste de Finalidade
- **Interesse legítimo**: manter o site e o assistente disponíveis, seguros e monitoráveis (Art. 10, I e II; Art. 46 LGPD — medidas que reduzem riscos)
- **É lícito, específico e real?**: sim — o site é público; abuso do formulário público (bots/bombardeio de leads falsos) é risco concreto
- **Quem se beneficia**: o controlador (operação) e o titular (disponibilidade e proteção do serviço)
- **Sem o tratamento**: impossibilita diagnóstico de falhas e apuração de incidentes (Art. 48/Res. 15/2024)

## 2. Teste de Necessidade
- **Estritamente necessário?**: sim — toda implantação web gera logs de rede; não dá para operar sem eles
- **Forma menos invasiva**: já adotada — o log do Worker é sanitizado (**não registra o texto da pergunta**); sem cookies; sem analytics de terceiros
- **Dados mínimos**: IP + user-agent + métricas; nada além do que a infra emite por padrão

## 3. Teste de Balanceamento
| Fator | Avaliação |
|---|---|
| Expectativa razoável do titular | **alta** — todo site opera com logs de infraestrutura; é expectativa padrão |
| Impacto potencial sobre direitos | **leve** — identificadores técnicos, sem conteúdo; não há perfilamento nem união de dados-captação |
| Categoria do dado | comum (IP — tratado como dado pessoal na LGPD) |
| Vulnerabilidade do titular | nenhuma |
| Forma de coleta | observada automaticamente (deveria constar na política — L9) |
| Salvaguardas | sanitização do log do Worker, sem cookies, sem rastreadores, `no-store` |

**Conclusão**: o interesse do controlador **prevalece** — necessidade estrita de operação, salvaguardas de minimização já implantadas, retenção limitada e impacto leve.

## 4. Salvaguardas adotadas
- [x] Transparência ativa (constar na política de privacidade v2 — L9)
- [x] Minimização de dados (log sem conteúdo da pergunta)
- [x] Limitação de retenção (política dos provedores; Web3Forms apaga logs a cada ~2 meses)
- [x] Acesso restrito (sem acesso ao console do provedor, ninguém consulta)
- [ ] Criptografia — N/A em logs de workers do provedor (padrão setor)
- [ ] Pseudonimização — N/A
- [x] Outras: sem cookies/rastreadores reduz o risco da união de dados

## 5. RIPD necessário?
Não — sem perfilamento, sem vigilância, sem larga escala de pessoais (só identificadores técnicos, retidos por prazo curto).

## 6. Decisão
- [x] **Aprovo o uso de legítimo interesse para esta atividade** (decisão técnica; ratificação recomendável pelo jurídico/encarregado)
- **Responsável pela decisão**: técnico — Elcio
- **Data**: 2026-11-06
