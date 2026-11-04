# Auditoria de cobertura da FAQ e da landing

Data: 4 de novembro de 2026.

## Resultado e escopo

A base cobre os assuntos centrais do produto, mas não contém todas as informações que a landing apresenta. Há também diferenças de condições e mensagens que precisam ser alinhadas antes de ampliar as respostas do assistente.

A análise compara a versão atual do projeto, conferida no navegador em `http://127.0.0.1:5173/`, com `src/faq.json`. Inclui todas as seções da home, cabeçalho, rodapé, formulário, conteúdo do aplicativo e a rota de privacidade como complemento. Não atesta que a landing publicada esteja na mesma revisão, nem confirma comercialmente ou juridicamente as afirmações encontradas.

Nenhuma resposta, regra comercial, interface ou configuração de publicação foi alterada nesta auditoria.

## Base efetivamente usada

| Conteúdo | Quantidade verificada |
|---|---:|
| Entradas de `src/faq.json` | 53 |
| FAQ visível na página (`exibirNoSite: true`) | 17 |
| Entradas exclusivas da base de busca/assistente | 36 |
| Categorias do catálogo incluídas nessas 36 entradas | 16 |
| Demais entradas exclusivas da base de busca/assistente | 20 |
| Perguntas do JSON-LD renderizado | 17 |
| Cartões de categorias renderizados no ecossistema | 16 |

`src/faq.ts` filtra somente a apresentação da FAQ. O Worker importa o JSON completo e fornece suas 53 respostas ao modelo. Portanto, uma informação não aparecer nas 17 perguntas visíveis não significa que esteja ausente da base da IA.

## Cobertura por área

| Área da landing | Cobertura na base | Observação |
|---|---|---|
| Hero e diferenciais | Parcial | Cartão, benefícios e liberação no recebimento aparecem na base. Pagamento por aproximação não tem orientação correspondente. |
| Faixa de prova | Majoritariamente coberta | 16 categorias e ausência de tarifas de gestão aparecem na FAQ. A gestão específica pelo portal é pouco detalhada. |
| Ecossistema | Todos os 16 tópicos presentes | As condições e os agrupamentos não são integralmente equivalentes; ver divergências. |
| Aceitação e aplicativo | Parcial | App, saldos, extratos, cartões físico/virtual e aceitação por categoria estão presentes. Facilidades de aceitação e recursos avançados do portal não estão detalhados. |
| Custo zero | Coberta com ressalvas | Implantação, mensalidade, primeira via, frete e créditos estão na base. A redação sobre custos adicionais precisa de uniformidade. |
| Formulário e proposta | Parcial | A FAQ orienta procurar o formulário ou WhatsApp, mas não explica todos os campos, o retorno comercial e o consentimento. |
| Suporte para RH e colaboradores | Parcial | Canais e orientações de suporte estão cobertos. Atendimento consultivo e suporte dedicado ao RH não são descritos de forma específica. |
| CTA final | Essência coberta | Convite comercial já corresponde ao fluxo de contratação. Não exige transformar cada frase promocional em pergunta. |
| Cabeçalho | Parcial e ambígua | A base não explica a indicação de portal em preparação. |
| Rodapé | Parcial | Downloads, canais e registro PAT constam na base. Razão social, CNPJ e endereço não estão reproduzidos nas respostas. |
| Privacidade | Ausente como assunto próprio da FAQ | A base tem orientações de sigilo, mas não informa o contato de privacidade ou a rota da política. |

## Informações da landing ausentes ou parcialmente cobertas

| Tema | Evidência na landing | Situação na FAQ | Pergunta que poderia ser incluída ou ampliada |
|---|---|---|---|
| Pagamento por aproximação | `src/components/Hero.tsx:40` anuncia o recurso. | Não há menção a aproximação/contactless/NFC nas respostas. | “O cartão permite pagar por aproximação?” A existência anunciada tem fonte na landing; limites, habilitação e exigência de senha não têm. |
| Recursos e acesso do portal | `src/components/Vantagens.tsx:32` cita planilhas, financeiro e múltiplos CNPJs; `Header.tsx:133` indica preparação. | `empresa-recarga` cobre recarga autônoma, sem explicar esses recursos ou acesso ao portal. | “O que o RH consegue fazer no portal?” e “Como acessar o Portal da Empresa?” Exigem esclarecer a disponibilidade antes de redigir a resposta. |
| Facilidades de aceitação | `src/components/Vantagens.tsx:29` menciona delivery, ausência de convênio e de maquininha especial. | `cartao-aceitacao` trata rede habilitada e modalidade voucher, sem detalhar esses pontos. | “Precisa de convênio ou maquininha especial?” e “Posso usar em delivery?” Confirmar as condições por categoria, sem prometer aceitação universal. |
| Suporte dedicado ao RH | `src/components/CustoZero.tsx:444` e `:445` anunciam atendimento consultivo e suporte dedicado. | `suporte-canais` informa e-mail e WhatsApp; a implantação tem apoio, mas o alcance do suporte dedicado não é explicado. | “A empresa recebe suporte para o RH?” Não adicionar horário, SLA, exclusividade ou atendimento 24h sem confirmação. |
| Solicitação de proposta e retorno | `src/components/CustoZero.tsx:49` a `:169` definem os campos; `:396` descreve retorno por WhatsApp/e-mail, sem compromisso; `:424` contém consentimento. | `empresa-contratar` informa onde contratar, mas não detalha o preenchimento ou como ocorre o retorno. | “Como solicitar uma proposta e como receberei o contato?” Pode explicar os campos e canais existentes, sem inventar prazo. Cargo é opcional; os demais sete campos comerciais e o consentimento são obrigatórios no formulário atual. |
| Dados institucionais e endereço | `src/components/Footer.tsx:85` a `:89` apresentam razão social, CNPJ, registro PAT e endereço. | `pat-conformidade` informa o PAT e remete ao rodapé; não fornece os demais dados ao modelo. | “Qual é o CNPJ e o endereço da empresa?” Resolver a divergência de identidade institucional antes de consolidar a resposta. |
| Privacidade e contato responsável | `src/components/PrivacyPolicy.tsx:21` a `:33` e link do rodapé. | Não há entrada com `/privacidade` ou `privacidade@jadigital.com.br`. Orientações de não enviar senha/CPF não substituem esse tema. | “Onde consulto a política e com quem falo sobre meus dados?” Fornecer rota e contato após confirmar a identidade do controlador. |

## Divergências e ambiguidades prioritárias

### 1. Aceitação universal versus rede habilitada

- A seção de vantagens diz “Onde aceita VISA, aceita JÁ Benefícios” (`Vantagens.tsx:21`).
- `cartao-aceitacao` condiciona o uso à rede habilitada por categoria e orienta informar voucher.
- `cat-saldo-livre` diz “em toda a rede de aceitação Visa”, enquanto o cartão correspondente da landing ressalva condições do produto e rede (`Ecossistema.tsx:128`).

Não ampliar a base com a promessa universal. Primeiro definir uma mensagem comercial única e conservar as condições aplicáveis.

### 2. Agrupamento das categorias e PAT

- A landing coloca Cultura sob o cabeçalho “Trilho Voucher PAT” (`Ecossistema.tsx:37` e `:53`).
- `cartao-categorias` distingue alimentação/refeição no PAT e Vale-Cultura em programa próprio.
- A landing coloca “Alimentação e Refeição” no grupo Multibenefícios (`Ecossistema.tsx:61` e `:67`), mas a entrada `cat-alimentacao-refeicao` acrescenta PAT ao nome, ao grupo e à resposta.

Confirmar o mapeamento comercial entre produtos, chips e programas. A simples organização visual não deve virar uma regra assumida pela IA. Esta auditoria identifica a diferença entre os textos; não substitui validação do enquadramento.

### 3. Portal anunciado versus “em preparação”

- Hero, prova e vantagens anunciam operação pelo portal.
- O cabeçalho mostra “Portal da Empresa em preparação” como texto, sem link de acesso.
- `empresa-recarga` afirma recarga autônoma pela plataforma.

Pode ser somente o link do site que está em preparação, mas o código não esclarece isso. Não afirmar que o serviço inteiro está indisponível, nem que há acesso pelo site, sem confirmação.

### 4. Uso imediato versus condições de ativação e recarga

- Hero e vantagens anunciam uso imediato no recebimento (`Hero.tsx:48`, `Vantagens.tsx:24`).
- `cartao-entrega` também menciona liberação no recebimento, com recarga pela empresa.
- `cartao-ativacao` orienta um primeiro desbloqueio pelo aplicativo; `compra-saldo` exige saldo disponível na carteira apropriada.

Há uma ambiguidade de condições. Esclarecer se “uso imediato” pressupõe cartão desbloqueado e saldo creditado; não prometer compra antes dessas verificações.

### 5. Condições resumidas demais no catálogo da FAQ

- Multiuso na landing depende das regras e categorias definidas pela política da empresa (`Ecossistema.tsx:123`); `cat-multiuso` usa apenas “regras flexíveis”.
- Saldo Livre na landing depende das condições do produto e da rede (`Ecossistema.tsx:128`); a FAQ amplia para toda a rede Visa.
- Assiduidade na landing depende dos critérios de frequência da empresa (`Ecossistema.tsx:108`); essa ressalva não consta em `cat-assiduidade`.

As categorias existem na base, mas suas respostas devem conservar as condições da fonte, sem transformar flexibilidade em liberdade irrestrita.

### 6. Identidade institucional inconsistente

- Rodapé: “Já Benefícios e Pagamentos Ltda.” (`Footer.tsx:85`).
- Política: “Já Digital Instituição de Pagamento S.A” (`PrivacyPolicy.tsx:30`).
- JSON-LD de organização em `index.html` usa a segunda denominação.

Não escolher automaticamente uma das razões sociais ou vincular o CNPJ do rodapé ao controlador da política por inferência. Confirmar a relação entre as entidades antes de acrescentar uma resposta institucional.

### 7. “Únicos custos” e serviços adicionais

- `implantacao-custo` diz que os únicos custos são frete e créditos.
- `mensalidade-custo`, `empresa-custos` e `segunda-via-custo` admitem serviços ou custos eventuais informados na proposta/atendimento.

Embora a mensagem central de taxa zero esteja coberta, a formulação absoluta precisa de ressalva coerente para não negar a possibilidade de custos adicionais já prevista na própria base.

## Privacidade: limite da informação disponível

A política contém orientações gerais de coleta, tratamento e direitos, mas não descreve especificamente o fluxo atual do assistente: mensagens mantidas na sessão do navegador (`FloatingActions.tsx:41` e `:67`) e histórico recente enviado ao Gemini pelo Worker (`chat-worker/index.js`). O formulário usa um serviço de envio externo (`src/mail.ts`).

Isso não autoriza inventar uma resposta sobre operadores, retenção, consentimento ou garantias de conformidade. O texto institucional precisa ser revisado pelos responsáveis pelo tratamento. A entrada de FAQ sobre privacidade deve, inicialmente, apontar a política e o contato responsável, sem substituir essa revisão.

## O que já está coberto e não precisa ser duplicado

- As 16 categorias, com as ressalvas de alinhamento descritas acima.
- Implantação, mensalidade, primeira via, frete, créditos, segunda via e proposta comercial.
- Migração, fidelidade/cancelamento, cadastro de colaboradores e rotina de recargas.
- Cartão físico/virtual, compras online, saldos por categoria, extrato, bloqueio e desbloqueio.
- Download do app para Android/iPhone, acesso e erros comuns de utilização.
- Senha do cartão, distinção de senha de transação, bloqueios e pagamento recusado.
- Contatos de atendimento e registro PAT.

Detalhes de suporte podem continuar exclusivos do assistente. Não é necessário expor todas as 53 entradas no accordion ou no JSON-LD.

## Documentação de manutenção desatualizada

`docs/faq-pendencias.md` ainda descreve 17 itens em `public/faq.json` e atualização manual de HTML estático. `docs/faq-consolidacao.md` descreve 37 entradas. Esses números e caminhos não representam a implementação atual: a fonte é `src/faq.json`, há 53 entradas e o Vite emite `/faq.json` no build. O README do Worker também contém referências antigas a `public/faq.json`.

Esses documentos continuam úteis como registro de pendências, mas não devem prevalecer sobre o código nem ser usados como evidência de aprovação comercial de uma resposta.

## Sequência recomendada

1. Confirmar as mensagens de aceitação, mapeamento dos produtos/PAT, disponibilidade do portal, identidade institucional e condições de ativação.
2. Alinhar as respostas de catálogo que perderam ressalvas da landing e uniformizar a descrição de custos.
3. Acrescentar somente informações com fonte e aprovação, priorizando aproximação, proposta/retorno, suporte ao RH e contato de privacidade. Usar entradas exclusivas do assistente quando não fizer sentido ampliar a FAQ visual.
4. Atualizar a documentação da fonte única e as contagens.
5. Validar as novas intenções e equivalentes, a seleção das perguntas visíveis e as respostas do assistente. Recompilar a landing e publicar o Worker após mudanças na base; cada um incorpora o JSON no próprio build.

Esta auditoria não aprova novas regras ou promessas comerciais e não promove as perguntas pendentes da pesquisa a respostas públicas.
