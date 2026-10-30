# Assistente JÁ — Cloudflare Worker

Híbrido, em duas camadas:

1. **FAQ primeiro** — pergunta igual ou próxima de um item de `public/faq.json` (importado no
   build, fonte única) recebe a resposta **literal** do JSON, sem modelo.
2. **Modelo só no fallback** — se nada casar com confiança, o Gemini responde usando
   **exclusivamente** os itens da FAQ como contexto. Ele é instruído a devolver
   `SEM_RESPOSTA` quando a FAQ não cobre o assunto.
3. **Sem base / sem chave / erro** — devolve o `FALLBACK` e o site oferece WhatsApp e formulário.

## Instalação (Node 24, npm)
1. `cd chat-worker`
2. `npx wrangler login`
3. Em `wrangler.toml`, defina `ALLOWED_ORIGINS` com seus URLs exatos separados por vírgula (inclua o Netlify atual e, depois, a Hostinger). **Não** use `*`.
4. `npx wrangler secret put GEMINI_API_KEY` (só é usada no fallback)
5. `npx wrangler deploy`
6. Copie a URL HTTPS do Worker para `public/chat-config.json`, no campo `endpoint`, e publique a landing.

Sem a chave, o Worker continua funcionando: responde pela FAQ e encaminha o resto para o
atendimento humano. Para desenvolvimento local, copie `.dev.vars.example` para `.dev.vars`,
preencha a chave e rode `npx wrangler dev`. Nunca versione `.dev.vars`.

## Como a busca na FAQ funciona
1. **Pergunta idêntica** (ignorando acentos e pontuação) recebe a resposta literal.
2. **Paráfrase/typo** é aceita quando a pergunta da FAQ concentra dois radicais em comum, ou
   um radical em comum e nenhuma palavra fora do vocabulário da FAQ. O radical tem 5 letras
   ("custo"/"custos", "implantar"/"implantação") e palavras curtas só casam por igualdade.
   Erros de digitação usam Levenshtein limitado (1 letra; 2 em palavras com 9+ letras), sempre
   com a mesma inicial e tamanho próximo — "cartao virtal" acha "cartão virtual".
3. **Sem confiança** → modelo ancorado no JSON; se ele não tiver base, fallback.

Quando dois ou mais itens empatam na pontuação, a busca não escolhe pela ordem do
`faq.json`: devolve os itens empatados (até 3) com a pergunta e a resposta oficiais de cada um.
Termo genérico (`"cartão"`, `"benefícios"`) lista até 6 assuntos oficiais em vez de arriscar
uma resposta; `app` é tratado como `aplicativo`. A lista vem no campo `suggestions` e o cliente
renderiza cada pergunta como botão — clicar envia a pergunta escolhida. Se nem isso existir,
vai para o modelo e, sem base, para o atendimento humano.

O fuzzy roda só sobre o vocabulário da própria FAQ (algumas centenas de palavras), com corte
antecipado na distância: custo de microssegundos por pergunta, sem dependência externa.

Perguntas com vocabulário fora da FAQ ("vocês entregam em Portugal?") vão para o modelo, que
pode responder apenas se a FAQ sustentar a resposta; caso contrário, encaminha.

## Privacidade e segurança
- Perguntas com CPF ou número de cartão **não são enviadas ao provedor**: caem direto no
  encaminhamento humano.
- O texto da pergunta não é registrado em log. O log `Assistente JÁ: resposta` traz apenas
  `path` (`faq_exact`, `faq_match`, `ai`, `blocked` ou `fallback`), `totalMs` e, quando houve
  modelo, `modelMs`.
- Cada resposta 200 traz `Server-Timing` (`model;dur=…` quando o modelo foi usado e `total;dur=…`).
- CORS não é proteção contra abuso por scripts externos. Para produção, configure rate limiting
  por IP no Cloudflare, limites de gastos e, idealmente, Turnstile. Quem tiver a URL e uma
  origem autorizada consegue consultar a FAQ pública e consumir o fallback.
- Sem armazenamento de conversas.

## Atualizar respostas
Edite `public/faq.json`: cada entrada precisa de `id`, `grupo`, `pergunta`, `resposta`,
`equivalentes` (lista) e `exibirNoSite` (booleano). O assistente usa todas as entradas;
a FAQ visual, a pesquisa da landing e o JSON-LD usam apenas `exibirNoSite: true`.
A busca compartilhada está em `src/faq-search.mjs`; não mantenha uma cópia separada
no Worker ou no frontend. O mapa das 29 perguntas e pendências fica em
`docs/faq-consolidacao.md`, fora da base pública.

Na raiz, rode `node --test chat-worker/index.test.mjs src/faq-search.test.mjs` e
`npm run check`. Publique a landing e rode `npx wrangler deploy` dentro de
`chat-worker`. Ambos incorporam o JSON no build.

Versione a integração completa: `public/faq.json`, `src/faq.ts`, `src/faq-search.mjs`,
`src/faq-search.d.mts`, consumidores e `tsconfig.json`. Manter o tipo novo com o JSON
antigo causa erro de build; tornar esses campos opcionais esconderia a migração incompleta.

## Testes
`node --test chat-worker/index.test.mjs` (na raiz) cobre preflight CORS, origem desconhecida,
resposta literal do JSON, paráfrase, ausência de chamada ao modelo quando a FAQ responde,
resposta do modelo no fallback, ausência de chave, erro do provedor, `SEM_RESPOSTA`, bloqueio
de CPF/cartão e `Server-Timing`.

O deploy precisa ser refeito nesta pasta; recompilar a landing não atualiza o Worker.
