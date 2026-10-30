# Integração da FAQ do assistente

Objetivo: consolidar o documento canônico com `public/faq.json`, mantendo uma resposta
por intenção e separando o conteúdo de suporte da FAQ comercial.

- [x] Mapear as 29 perguntas em `docs/faq-consolidacao.md`, com conflitos e pendências.
- [x] Consolidar o JSON com IDs, equivalentes e `exibirNoSite`; preservar tarifas e
  procedimentos não confirmados fora da base pública.
- [x] Compartilhar a busca entre Worker e fallback local, sem misturar intenções de
  senha, acesso, perda do cartão e pagamento recusado.
- [x] Remover a FAQ estática duplicada; filtrar a UI, pesquisa da landing e JSON-LD.
- [x] Validar com testes de busca/Worker, `npm run check` e navegação real no navegador.

Riscos: respostas semelhantes com sentidos diferentes; conteúdo histórico tratado como
política atual; perguntas internas aparecendo na landing. Sem dependências novas.

Conclusão: equivalentes levam à mesma resposta nos dois caminhos; rascunhos não entram
na base/modelo; FAQ visual e JSON-LD usam apenas itens selecionados. O Worker precisa
de novo deploy para atualizar o serviço remoto; este plano não inclui publicar em produção.
