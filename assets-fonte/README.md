# assets-fonte/

PNGs **lossless** que originam toda a arte raster do site. Ficam fora de `public/` de propósito:
não são servidos nem entram no `dist/`, portanto não pesam no deploy. Os `.webp` versionados em
`public/` são derivados daqui.

## Arquivos

| Fonte | Derivado em `public/` | Consumidor |
| --- | --- | --- |
| `hero01.png` (1672×941) | `hero01.webp` → `hero01-mobile.webp`, `hero01.jpg`, `hero01-mobile.jpg`, `og-image.jpg` | `src/components/Hero.tsx`, `index.html` |
| `hero-clean.png` | — (referência de auditoria de cor) | `scripts/retonalizar-hero.mjs`, `docs/correcao-conformidade-cores.md` |
| `aceito.png` (1254×1254) | `aceito.webp` | `src/components/Vantagens.tsx` |
| `colaborador.png` | `colaborador.webp` | `src/components/Suporte.tsx` |
| `rh.png` | `rh.webp` | `src/components/Suporte.tsx` |
| `mockup-cartao-clean.png` | `mockup-cartao-clean.webp` | `src/components/Ecossistema.tsx` |

## Convenções

- **kebab-case minúsculo**, sempre — igual a `public/` e às classes CSS.
- Não editar os `.webp` à mão: regenere a partir da fonte correspondente.
- `hero01-mobile.png` (recorte 816×941) é gerado por `npm run hero:mobile`
  (`scripts/gerar-hero-mobile.mjs`) e mora aqui como master do recorte mobile. O que vai para
  `public/` são os derivados: `hero01-mobile.webp` e o fallback `hero01-mobile.jpg`
  (`npm run hero:fallbacks`, requer `ffmpeg`).
- Medições de cor: `npm run audit:cores -- --asset assets-fonte/<arquivo>.png`.
