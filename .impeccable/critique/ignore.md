# Achados silenciados — crítica de design

Itens que uma crítica futura deve **dropar silenciosamente** (aprovados pelo dono do projeto em 23/10/2026, na primeira execução de `critique`, score 29/40).

## Anti-padrões do overlay que são padrões comitados do DESIGN.md

O `detect.js` (overlay browser) reporta estes dois padrões a cada execução. Eles são **decisões de marca documentadas** no `DESIGN.md` (seções Components e Typography/Label), não slop — reportá-los de novo é ruído.

1. **`border-accent-on-rounded`** (8 ocorrências: `border-top: 4px` + `border-radius: 18px` nos cat-cards; `border-top: 5px` + `border-radius: 24px` em bloco de destaque)
   - Padrão comitado: "filete superior de 4px que revela acento uva no hover" (DESIGN.md → Components → Cards/Categorias; "A Regra da Cápsula" em Shapes).
   - Silenciar sempre que a combinação filete-colorido + raio generoso aparecer neste projeto.

2. **`kicker-above-heading`** (3 ocorrências: eyebrow "PLATAFORMA DE BENEFÍCIOS FLEXÍVEIS" / "Mais vantagens para sua empresa" / "Central de dúvidas" acima de H2)
   - Padrão comitado: papel tipográfico **Label/eyebrow** (Trebuchet MS, 0.8rem, uppercase, letter-spacing 0.12em, cor primária) — DESIGN.md → Typography → Hierarchy.
   - Silenciar: o kicker é um elemento de apoio estritamente menor que o H2, hierarquia visual inequívoca.

## Falsos positivos do detector CLI (cego ao CSS importado via Vite)

O `impeccable detect --json index.html` analisa o markup sem o CSS (que entra via `import "./style.css"` no `src/main.ts`), caindo nos defaults do UA. Silenciar os dois artefatos estruturais:

3. **`design-system-color`** — "text color rgb(0, 0, 0) on a 'Pular para o conteúdo'": cor real é `#fff` sobre `--color-primary` (`.skip-link`, `src/style.css:74-75`).
4. **`flat-type-hierarchy`** — "Role sizes: body/h1/h2/h3/h4 all 16px": passos reais ≥2,07× (`--text-h1: clamp(2.2rem,…)` vs `--text-body: clamp(15px,…)`).

> Nota: se o projeto um dia sair do Vite ou passar a inlinear CSS, reavaliar os itens 3-4.
