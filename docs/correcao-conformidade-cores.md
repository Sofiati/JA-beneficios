# Correção de conformidade de cores — JA Benefícios

Data: 2026-10-21. Status: em execução (Fase 1 concluída, Fases 2–4 aguardam aprovação de design).
Escopo: `src/style.css`, `index.html`, `public/`, `scripts/`.

Este documento é o plano operacional da correção de conformidade de cores. Ele se apoia em
`docs/brand-conformidade.md` (paleta oficial derivada do `MANUAL JA BENEFICIOS AT1.pdf`, p.3) e
`docs/design-system.md` (tokens).

---

## 1. Diagnóstico — situação medida

A auditoria reproduzível (`npm run audit:cores`) mediu o estado real do projeto em 2026-10-21.

### 1.1 O que já está conforme

| Verificação | Resultado |
| --- | --- |
| Hexadecimais fora da paleta em `index.html`/`src/**/*.css`/`src/components/*.tsx` | **0** — todo hex passa por token |
| Pares de contraste WCAG 2.1 normativos (22 pares) | **22/22 aprovados** |
| Tokens de cor declarados e nunca consumidos | **0** (1 reservado por decisão documentada) |
| Assets de `public/` sem referência | **0** (5 órfãos removidos nesta fase) |

> **Nota (2026-10-28).** Os PNGs fonte (`aceito`, `Colaborador`, `RH`, `mockup-cartao-clean`,
> `hero01`, `hero-clean`) saíram de `public/` para `assets-fonte/` — continuam versionados, mas
> não vão mais ao `dist/`. `robots.txt` e `hero01-mobile.png` entraram em `ALLOWED_ORPHANS`.
> Dos 22 pares de contraste, dois foram reescopados por não serem pares "em uso": o de
> `--ja-cinza` (token reservado, nunca consumido) e o de `--color-border` (divisor decorativo,
> fora de WCAG 1.4.11). Em contrapartida, a fronteira de `<input>`/botão passou a ser avaliada
> normativamente via `--color-border-control` `#8B857B` (3,66:1 / 3,41:1).

### 1.2 A não conformidade real: o plum do hero

O achado central desta fase. O hero (`assets-fonte/hero-clean.png`) **não usa a uva oficial** `#732E4A`.
Ele usa um **gradiente ameixa profundo** cujo tom dominante não pertence à paleta:

```bash
npm run audit:cores -- --asset assets-fonte/hero-clean.png
```

| Cor medida | Cobertura | Cor oficial mais próxima | Distância RGB |
| --- | --- | --- | --- |
| `#43022D` | 13,02% | uva `#732E4A` | **71** |
| `#5C013B` | 10,36% | uva `#732E4A` | **53** |
| `#4C0232` | 7,02% | uva `#732E4A` | **64** |
| `#530236` | 5,91% | uva `#732E4A` | **58** |
| `#3D022A` | 5,17% | uva `#732E4A` | **77** |
| `#FECA19` | 2,04% | mostarda `#FFC72C` | 19 |

**Medição canônica de plum (reproduzível):**

```bash
npm run audit:cores -- --find assets-fonte/hero-clean.png "#5D013C"
```

Resultado registrado em 2026-10-21:

| Métrica | Valor |
| --- | --- |
| Alvo | `#5D013C` (93, 1, 60) |
| Tolerância | 8 (distância euclidiana RGB) |
| Pixels no alvo (tolerância 8) | 198.465 de 1.573.352 (12,61%) |
| Pixels exatamente iguais a `#5D013C` | 6.700 |
| Pixel mais próximo | `#5D013C` (d=0,00) em (96, 1) |
| BBox da ocorrência | x 0..1671, y 0..435 |

O tom `#5D013C` está presente no asset de forma inequívoca: 6.700 pixels têm **exatamente**
esse valor e 198.465 estão dentro da tolerância de 8, cobrindo a faixa superior
(y 0..435) e toda a largura. Não é ruído de compressão: é a cor de preenchimento do
grafismo do hero.

**O mesmo desvio se repete em outros assets:** `mockup-cartao-clean.png` (tons entre
`#3C051C` e `#6B1535`), `aceito.png` (`#770240`) e `accept-clean` (`#76043E`).
A distância da uva oficial é de 26 a 94 pontos — o cartão fotografado e o mockup do cartão
não estão na cor da marca.

### 1.3 Contradição documental

`AGENTS.md` (§ Design principles) afirma: *"laranja `#FE6600` é a marca; amarelo `#F4AD00` é
apoio"*. Essa frase contradiz a paleta oficial (uva `#732E4A`, mostarda `#FFC72C`,
verde-água `#40C1AC`) e não corresponde a nenhum token vivo em `src/style.css`. É resíduo
da marca anterior e induz a erro em qualquer trabalho futuro.

### 1.4 Escala de distâncias RGB usada neste documento

| Faixa | Leitura |
| --- | --- |
| 0–12 | mesma cor (jitter de quantização/anti-aliasing) |
| 13–30 | variação de tom aceitável (sombra, gradiente curto) |
| 31–60 | **desvio de marca** — corrigir |
| 61+ | **desvio grave** — corrigir com prioridade |

---

## 2. Tarefas

### Fase 1 — Ferramenta e limpeza (sem risco visual) — **CONCLUÍDA**

| # | Tarefa | Status |
| --- | --- | --- |
| 1.1 | Criar `scripts/lib/png.mjs` — decodificador PNG sem dependências (bit depth 8, color type 2/6, sem entrelaçamento), sobre `node:zlib` nativo | ✅ |
| 1.2 | Criar `scripts/audit-cores.mjs` — 4 frentes: paleta, contraste WCAG, tokens mortos, assets órfãos | ✅ |
| 1.3 | Registrar `npm run audit:cores` e integrá-lo a `npm run check` | ✅ |
| 1.4 | Reproduzir e **registrar** a medição canônica de plum do hero (§1.2) | ✅ |
| 1.5 | Remover 5 assets órfãos de `public/` (8,6 MB) — `hero-cleanX`, `accept`, `accept-clean`, `mockup-cartao-cleanX`, `RH2` | ✅ |
| 1.6 | Classificar o restante: 16 ícones como *pendentes de aprovação* (não órfãos), 4 assets como *mantidos por decisão documentada* (logo especial, licença Arvo, `visa.svg`, `preview.html`) | ✅ |
| 1.7 | Marcar `--ja-cinza` como token reservado (não morto) — cinza oficial é referência de marca, não cor ativa | ✅ |
| 1.8 | Limpar `.gitignore`: remover `public/hero-cleanX.png` (obsoleto após 1.5) | ✅ |
| 1.9 | Decidir o destino de `docs/design-references/auditoria-cores-manual-1280x7841.png` (1,7 MB) | ✅ movido para `_quarantine/design-references/` |

**Resultado da Fase 1:** `public/` 17,9 MB → 9,3 MB. `npm run check` verde com auditoria
integrada. Nenhuma alteração visual.

### Fase 2 — Correção documental (sem risco visual) — **PRÓXIMA**

| # | Tarefa | Depende de |
| --- | --- | --- |
| 2.1 | Corrigir `AGENTS.md` § Design principles: remover "laranja `#FE6600`" e "amarelo `#F4AD00`"; declarar a paleta oficial e a regra de que a marca é a **uva** | — |
| 2.2 | Documentar em `docs/brand-conformidade.md` §5 a existência do desvio de plum nos assets, com link para este documento | 1.4 |
| 2.3 | Registrar em `docs/design-system.md` que `--ja-cinza` é token **reservado** (não ativo) | 1.7 |
| 2.4 | Adicionar ao `AGENTS.md` a regra: *toda cor nova passa por token; `npm run audit:cores` roda no `check`* | 1.3 |

### Fase 3 — Retonalização dos assets (requer aprovação visual)

| # | Tarefa | Depende de |
| --- | --- | --- |
| 3.1 | Gerar **duas** variantes do hero: (A) mantendo o gradiente atual, (B) com o grafismo retonalizado para a uva oficial `#732E4A` | aprovação |
| 3.2 | Comparar as variantes a 1440 px e 390 px; salvar em `docs/design-references/hero-plum-{a,b}-{1440x900,390x664}.png` | 3.1 |
| 3.3 | Re-avaliar o contraste do logo negativo (`logo-ja-negativo.svg`, mostarda+verde sobre uva) sobre o novo fundo | 3.1 |
| 3.4 | Se a variante B for aprovada, retonalizar `mockup-cartao-clean.png`, `aceito.png` e `appJA.webp` | 3.2, aprovação |
| 3.5 | Verificar a cor do cartão fotografado (`#76043E`) contra a identidade aprovada | 3.4 |

### Fase 4 — Ícones e tokens pendentes (requer aprovação de design)

| # | Tarefa | Depende de |
| --- | --- | --- |
| 4.1 | Substituir os 4 ícones atuais (`emissao-cartao`, `entrega`, `implantacao`, `mensalidade`) pelo conjunto System v2 de `public/icones/` | aprovação |
| 4.2 | Remover os 16 ícones pendentes do repositório após a troca | 4.1 |
| 4.3 | Avaliar se `--ja-cinza` sai de reservado para ativo em algum detalhe de UI | aprovação |

---

## 3. Como reproduzir

```bash
npm run check                                   # typecheck + build + auditoria de cores
npm run audit:cores                             # relatório completo (4 frentes)
npm run audit:cores -- --asset assets-fonte/hero-clean.png  # cores dominantes de um PNG
npm run audit:cores -- --find assets-fonte/hero-clean.png "#5D013C"  # medição canônica de plum
```

A auditoria sai com código **1** quando há violação de paleta ou falha de contraste
normativa, o que a torna integrável a CI sem alteração adicional.

---

## 4. Critérios de aceite

- `npm run check` verde (typecheck + build + auditoria).
- Zero hex fora da paleta em `index.html`, `src/styles/base.css`, `src/style.css`,
  `src/components/*.tsx`, `src/mail.ts`.
- Todos os pares de contraste normativos em conformidade WCAG 2.1 AA.
- Nenhum asset órfão em `public/`; todo asset sem referência está classificado
  (pendente de aprovação ou mantido por decisão documentada).
- Medição canônica de plum reproduzível por comando e registrada neste documento.
- Documentação (`AGENTS.md`, `docs/brand-conformidade.md`, `docs/design-system.md`) sem
  contradição com a paleta oficial.
- Após a Fase 3, o hero e os assets com identidade visual usam tons dentro da faixa
  de 30 pontos RGB da uva oficial, ou a variante aprovada está documentada como desvio.

