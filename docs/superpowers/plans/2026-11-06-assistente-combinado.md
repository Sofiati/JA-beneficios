# Plano — assistente combinado

Objetivo: executar o escopo aprovado em `../specs/2026-11-06-assistente-combinado-design.md`.
React/TypeScript e CSS puro; nenhuma dependência nova. Preservar alterações locais.

- [x] Busca compartilhada (`src/faq-search.mjs`, `.d.mts` e testes): testar respostas
  curtas e encaminhamento por comportamento antes da implementação. Corrigir colisão
  de radical priorizando palavra inteira de pergunta em consultas de um termo.
  Preservar `rank`, consumido por `SearchBar`, e o contrato `{answer, handoff}` do Worker.
- [x] Interface (`src/components/FloatingActions.tsx`, `src/chat.css`): perfil alternável,
  sugestões por IDs da FAQ, perfil persistido na sessão, feedback negativo com pergunta
  e perfil da resposta, encaminhamento explícito e reset consistente. Não filtrar
  respostas canônicas por perfil. Desabilitar reset/troca durante requisição em curso.
- [x] Consumidores (`chat-worker/index.test.mjs`, README): atualizar expectativas para
  respostas curtas e encaminhamento. Não mudar respostas completas da landing.
- [x] Validar: `node --test src/faq-search.test.mjs chat-worker/index.test.mjs` e
  `npm run check`; Playwright no desktop/mobile, troca de perfil, reset, feedback,
  pergunta de perda e solicitação humana, com fallback local e canal remoto.

Conclusão: checagens aprovadas, evidências em `docs/design-references/` e limitações
do teste remoto/deploy explicitadas. Não commitar nem publicar nesta tarefa.
