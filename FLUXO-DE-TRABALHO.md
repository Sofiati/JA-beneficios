# Fluxo de trabalho — JA Benefícios

Este documento resume o passo a passo completo para desenvolver, validar e publicar alterações na landing page JA Benefícios, incluindo o deploy no Netlify e o Worker do Assistente JÁ (Cloudflare).

## Pré-requisitos

- **Node.js >= 24** (conforme `.nvmrc` / `engines` no `package.json`)
- **Conta no GitHub** com acesso ao repositório `Sofiati/JA-beneficios`
- **Conta no Netlify** vinculada ao site `ja-beneficios.netlify.app`
- **Conta no Cloudflare** (só se for alterar o Worker do Assistente JÁ)

## 1. Preparar o ambiente local

```bash
git clone https://github.com/Sofiati/JA-beneficios.git
cd JA-beneficios
npm install
node --version  # deve ser >= 24
```

## 2. Criar uma branch para o trabalho

Sempre crie uma branch a partir da `main`. Nunca commite diretamente na `main` sem revisão.

```bash
git checkout main
git pull origin main
git checkout -b nome-da-sua-branch
```

Exemplos de nomes de branch:
- `feat/nome-da-funcionalidade`
- `fix/descricao-do-problema`
- `style/ajuste-de-cores`

## 3. Fazer as alterações no código

Edite os arquivos conforme necessário seguindo as convenções do projeto:

- **TypeScript estrito**, sem `any`
- Componentes funcionais com hooks, interface de props tipada (`interface Props`)
- CSS puro com tokens em `var(--token)` — nunca hex literais novos
- Mobile-first: valide breakpoints de 900px e 520px
- Animações com `[data-animate]` + `.visible` + `IntersectionObserver`, respeitando `prefers-reduced-motion`

## 4. Validar antes de commitar

Sempre rode o `check` completo antes de commitar:

```bash
npm run check
```

Este comando executa, em sequência:
1. `typecheck` — `tsc --noEmit` (TypeScript estrito)
2. `build` — `vite build` + geração da rota `/privacidade`
3. `test:build` — testes de título/canonical da rota `/privacidade`
4. `audit:cores` — paleta, contraste WCAG 2.1, tokens sem uso, assets órfãos

Todos devem passar com **0 violações**.

## 5. Commitar as mudanças

```bash
git add .
git commit -m "tipo(escopo): descrição curta da mudança"
```

Use commits convencionais:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `style:` ajustes de estilo/cores/tipografia
- `chore:` tarefas de manutenção (ex: `.gitignore`, config)

Exemplo:
```bash
git commit -m "feat(hero): ajustar H1 do hero para 20px em mobile"
```

## 6. Enviar para o repositório remoto

```bash
git push origin nome-da-sua-branch
```

## 7. Criar um Pull Request

Vá para https://github.com/Sofiati/JA-beneficios e crie um PR da sua branch para `main`.

- Descreva o que foi feito e por que
- Liste as validações realizadas (`npm run check` aprovado)
- Solicite revisão, se necessário

Não faça merge direto na `main` sem revisão, exceto em casos excepcionais.

## 8. Fazer o merge na main

Após a aprovação do PR, faça o merge em `main`:

```bash
git checkout main
git pull origin main
git merge --no-ff nome-da-sua-branch
git push origin main
```

## 9. Acompanhar o deploy no Netlify

O site está vinculado ao repositório. O build usa o `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Deploy automático (recomendado)
Após o merge em `main` e push, o **Netlify dispara o deploy de produção automaticamente** e publica em:
- https://ja-beneficios.netlify.app

### Deploy manual via CLI (opcional)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --remote
```

**Não commite a pasta `.netlify/`** — ela já está no `.gitignore`.

## 10. Worker do Assistente JÁ (Cloudflare)

Se for alterar o Worker (pasta `chat-worker/`), o processo é separado da landing:

```bash
cd chat-worker
npx wrangler login
```

- Configure `ALLOWED_ORIGINS` em `wrangler.toml` (sem `*`)
- Configure `GEMINI_API_KEY` se usar fallback com modelo:
  ```bash
  npx wrangler secret put GEMINI_API_KEY
  ```
- Desenvolvimento local:
  ```bash
  cp .dev.vars.example .dev.vars
  npx wrangler dev
  ```
- Deploy do Worker:
  ```bash
  npx wrangler deploy
  ```

Após o deploy do Worker, atualize o campo `endpoint` em `public/chat-config.json` com a URL HTTPS gerada e publique a landing normalmente.

**Importante:** deploy da landing não atualiza o Worker, e vice-versa. Eles são independentes.

## 11. Comandos úteis resumidos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 5173) |
| `npm run build` | Build de produção (`dist/`) |
| `npm run preview` | Pré-visualizar o `dist/` localmente |
| `npm run check` | typecheck + build + testes + auditoria de cores |
| `npm run typecheck` | Apenas TypeScript |
| `npm run audit:cores` | Auditoria de cores WCAG, tokens, assets órfãos |
| `npm run test:build` | Testes da rota `/privacidade` |
| `npm run deploy:zip` | Gera `deploy.zip` com o conteúdo de `dist/` |

## Checklist antes de finalizar uma tarefa

- [ ] Alterações feitas em uma branch dedicada
- [ ] `npm run check` aprovado (0 violações)
- [ ] Commit com mensagem convencional
- [ ] Push para o remoto
- [ ] Pull Request criado e revisado (quando aplicável)
- [ ] Merge na `main` realizado
- [ ] Deploy no Netlify verificado em https://ja-beneficios.netlify.app

## Observações

- O `.netlify/` é estado local da CLI e **não deve ser versionado** (já está no `.gitignore`).
- O `dist/` é gerado no build e **não deve ser versionado** (já está no `.gitignore`).
- Qualquer nova cor introduzida deve usar token em `var(--token)` — o `npm run audit:cores` valida isso.
- O Node.js exigido é >= 24 (conforme `.nvmrc` e `engines` no `package.json`).
