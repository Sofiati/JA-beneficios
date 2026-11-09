# LIA — A002 Chat Assistente JÁ

- **Atividade**: resposta automática de dúvidas no chat e envio ao modelo Gemini quando a FAQ local não resolve
- **Controlador**: Já Benefícios e Pagamentos Ltda. — CNPJ 52.316.137/0001-53
- **Data**: 2026-11-06
- **Versão**: v1 (rascunho técnico — revisar com jurídico/encarregado)
- **Próxima revisão**: 2027-11-06 ou quando mudar o fornecedor de modelo

## 1. Teste de Finalidade
- **Interesse legítimo**: prestar atendimento ao visitante do site (responder dúvidas sobre os serviços reduz fricção na aquisição)
- **É de fato?**: sim — o chat está ativo em produção, com demanda real
- **Quem se beneficia**: principalmente o titular (obtém resposta imediata, sem espera); secundariamente o controlador
- **Sem o tratamento**: visitante sem resposta, além do que a FAQ estática cobre — pior experiência de pré-venda

## 2. Teste de Necessidade
- **Estritamente necessário?**: sim — responder a pergunta **é** o tratamento; sem coletar a mensagem não há resposta
- **Forma menos invasiva**: já adotada — primeira camada busca na FAQ local (sem enviar nada ao modelo), e só quando a FAQ local não resolve a pergunta vai ao Gemini (pergunta completa + trecho recente do histórico)
- **Dados mínimos**: mensagem truncada (450 chars), histórico truncado; sem cookies/profile; log sem o texto da pergunta

## 3. Teste de Balanceamento
| Fator | Avaliação |
|---|---|
| Expectativa razoável | **alta** — o titular digita a pergunta conscientemente; sabe que há automação (a nota na UI: "Respostas automáticas…") |
| Impacto potencial | **leve** — conversa de pré-venda; sem dados sensíveis; sem persistência no Worker |
| Categoria do dado | comum (mensagem livre) |
| Vulnerabilidade | nenhuma (público adulto B2B); dados sensíveis: a UI avisa e o Worker bloqueia (path "blocked") antes do modelo |
| Forma de coleta | transparente — o titular envia |
| Salvaguardas | aviso de não enviar dados sensíveis, bloqueio de padrões antes do modelo, sem armazenamento, log sanitizado |

**Conclusão**: o interesse do controlador **prevalece** — o titular é quem inicia a transmissão conscientemente, com coleta mínima (limite de tamanho), sem persistência do lado do controlador e com aviso ativo; o impacto sobre direitos é leve.

## 4. Salvaguardas adotadas
- [x] Transparência ativa (nota UI; constância na política de privacidade v2 — L9)
- [x] Mecanismo de oposição fácil (encerrar a conversa — nada persiste)
- [x] Minimização de dados (limite 450 chars, só o necessário)
- [x] Limitação de retenção (zero persistência)
- [x] Acesso restrito (a conversa só existe no navegador do titular)
- [ ] Criptografia — TLS em trânsito; **sem armazenamento** dispensa em repouso no site
- [ ] Pseudonimização — N/A porque não há armazenamento
- [x] Outras: bloqueio de envio ao modelo quando a conversa contém padrão "blocked"

## 5. RIPD necessário?
Não — sem profiling/decisão automatizada com efeito jurídico, sem vigilância, sem sensíveis, sem menores, sem larga escala (conversa individual por usuário).

## 6. Decisão
- [x] **Aprovo o uso de legítimo interesse para esta atividade** (decisão técnica; recomenda-se ratificação pelo jurídico/encarregado)
- **Responsável pela decisão**: técnico — Elcio
- **Data**: 2026-11-06
