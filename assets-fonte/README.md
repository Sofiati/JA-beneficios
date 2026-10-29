# assets-fonte/

PNGs **lossless** que originam toda a arte raster do site. Ficam fora de `public/` de propósito:
não são servidos nem entram no `dist/`, portanto não pesam no deploy. Os `.webp` versionados em
`public/` são derivados daqui.

## Arquivos

| Fonte | Derivado em `public/` | Consumidor |
| --- | --- | --- |
| `hero01.png` (1672×941) | `hero01.webp`, `hero01-mobile.png` → `hero01-mobile.webp` | `src/components/Hero.tsx` |
| `hero-clean.png` | — (referência de auditoria de cor) | `scripts/retonalizar-hero.mjs`, `docs/correcao-conformidade-cores.md` |
| `aceito.png` (1254×1254) | `aceito.webp` | `src/components/Vantagens.tsx` |
| `colaborador.png` | `colaborador.webp` | `src/components/Suporte.tsx` |
| `rh.png` | `rh.webp` | `src/components/Suporte.tsx` |
| `mockup-cartao-clean.png` | `mockup-cartao-clean.webp` | `src/components/Ecossistema.tsx` |

## Convenções

- **kebab-case minúsculo**, sempre — igual a `public/` e às classes CSS.
- Não editar os `.webp` à mão: regenere a partir da fonte correspondente.
- `hero01-mobile.png` é gerado por `npm run hero:mobile`
  (`scripts/gerar-hero-mobile.mjs`) e mora em `public/` porque é recorte de produção.
- Medições de cor: `npm run audit:cores -- --asset assets-fonte/<arquivo>.png`.
