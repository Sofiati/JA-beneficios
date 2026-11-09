# Runbook de Incidente de Segurança — JA-benefícios

**Data**: 2026-11-06 · Base: Art. 48 LGPD + Resolução CD/ANPD 15/2024 · Modo: **preparatório**
**Controlador**: Já Benefícios e Pagamentos Ltda. — CNPJ 52.316.137/0001-53
**Encarregado**: pendente designação — responsável interino: Elcio (técnico)
**Lembrete**: o marco do prazo é o **momento do conhecimento de que dados pessoais foram afetados**.

## Ativos e vetores plausíveis neste projeto (da realidade do `data-map.md`)

| # | Vetor | Onde mora o dado | Gravidade provável |
|---|---|---|---|
| V1 | Abuso público da `VITE_WEB3FORMS_KEY` (spam de leads falsos) | formulário público | baixa (integridade/disponibilidade) |
| V2 | Caixa de e-mail comercial comprometida | **leads acumulados (A001) — o principal repositório!** | **alta** |
| V3 | Worker Cloudflare comprometido / injeção de código | conversa de chat em trânsito (A002) | média |
| V4 | Incidente dentro de operador (Google/Cloudflare/Web3Forms) | dados nos operadores | varia |
| V5 | Celular corporativo perdido/comprometido | conversas de lead no WhatsApp (R004) | alta |

> Observação honesta: o **ponto mais frágil do sistema não é o site — são a caixa de e-mail**
> e o celular corporativo (senhas, 2FA). Confirmar 2FA nesses dois acessos **hoje**
> (relacionado aos gaps #3 e aos procedimentos P1/P2).

## Cronologia padrão (Hora 0 = conhecimento)

### T+0 — Detecção
1. Anotar carimbo de data/hora exato (`INC-AAAA-NNN` no `log.md`), quem detectou e como.
2. Acionar responsável interim → encarregado (quando designado).

### T+0–4h — Contenção
- [ ] Isolar o vetor (credencial do Web3Forms? acesso do inbox? celular? worker)
- [ ] Revogar/trocar credenciais envolvidas (`VITE_WEB3FORMS_KEY`: recriar no painel Web3Forms + redeploy; conta de e-mail comprometida: trocar senha, revogar sessões)
- [ ] Preservar evidência (screenshots, logs dos operadores, export .eml)
- [ ] **Não deletar nada** antes da triagem
- (opcional) comunicação interna apenas entre os envolvidos diretamente

### T+4–24h — Avaliação e teste do Art. 5º (Res. 15/2024)
- [ ] O que vazou? (categoria: dados comuns de leads — nome, e-mail, WhatsApp, empresa; ou conversa de chat)
- [ ] Quantos titulares? (contagem de leads/conversas afetadas)
- [ ] Há dados **sensíveis/crianças/financeiros/autenticação/sigilo/larga escala**? (aplicação das categorias I-VI)
- [ ] **Decisão notificar**: teste A (risco relevante) + B (categoria I-VI).
  - A+B → notificar ANPD + titulares (3 dias úteis; dobrados se o subsequente status de ATPP for confirmado) — documentar decisão
  - Só A → registrar e documentar decisão de não notificar
  - Nem A nem B → **registrar mesmo assim** (Art. 10 — 5 anos)

### T+24–72h (3 dias úteis) — Comunicação
- ANPD: preencher `.lgpd/incidents/templates/anpd.md` (12 itens, Art. 6º §2º) → portal https://www.gov.br/anpd
- Titulares: preencher `.lgpd/incidents/templates/titulares.md` (7 itens, Art. 9º), linguagem simples,
  **envio individualizado** por e-mail do próprio lead; se inviável → aviso na página `/privacidade`
- Complemento à ANPD (se necessário): até 20 dias úteis

### T+72h+ — Pós-incidente
- [ ] Análise de causa raiz (5 whys) + plano de remediação com datas
- [ ] Atualizar este runbook com lições aprendidas
- [ ] Adicionar novo item ao `gaps.md` se o processo gerar um bug ou gap de conformidade

## Tabletop (1x/ano, mínimo)
Cenários sugeridos para este projeto: V2 (inbox), V5 (celular), V3 (worker), V1 (spam).
Conferir o tempo do runbook: da detecção à decisão. Se > 3 dias úteis, o processo está quebrado.
**Primeiro exercício: agendar** (ver `.lgpd/STATUS.md`).

## Fluxos de escalada para operadores
| Operador | Ação em incidente |
|---|---|
| Web3Forms | ticket de suporte Web3Creative (dado não é retido após o envio — segundo docs) |
| Cloudflare | support ticket + revisão dos logs do worker |
| Google (com migração p/ paid tier — gap #15) | incidente reportável via Google Cloud Support |
| Provedor de e-mail (a confirmar — gap #16) | incidente de conta: recuperar acesso + revisar regras de reenvio/filtragem |
