// Busca compartilhada pelo Worker e pelo fallback local. Sem rede ou estado de conversa.
export const FAQ_FALLBACK = "Não encontrei uma informação oficial suficiente para responder com segurança. Você pode falar com nossa equipe pelo WhatsApp ou solicitar contato comercial pelo formulário.";

export function createFaqSearch(faq) {
  const FALLBACK = FAQ_FALLBACK;
  const STOP = new Set("a o os as um uma de da do das dos no na nos nas para por que com como qual quais quem é e em ao aos meu minha sua suas seus tem ter onde esse essa sobre quero preciso gostaria vocês voce você faz funciona funcionam funcionar fazem for ola".split(" "));
  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Sinônimos que o visitante usa e que não aparecem no texto da FAQ.
  const ALIASES = new Map([["app", "aplicativo"], ["apps", "aplicativo"]]);
  // Plural em -ões volta para -ão antes do radical: "cartões" e "cartão" precisam do
  // mesmo radical ("carta"), senão o plural casa com outro item por acidente.
  const depluralize = (t) => t.replace(/([a-z])oes$/, "$1ao");
  const tokens = (s) => (normalize(s).match(/[a-z0-9]{3,}/g) || []).map(t => ALIASES.get(depluralize(t)) || depluralize(t));
  // Radical de 5 letras: aproxima flexões ("custo"/"custos", "implantar"/"implantação")
  // sem casar por substring ("for" dentro de "conformidade"/"fornecedor", que puxava
  // a pergunta errada). Palavras curtas só casam por igualdade.
  const stem = (t) => (t.length >= 5 ? t.slice(0, 5) : t);
  const stems = (s) => [...new Set(tokens(s).filter(t => !STOP.has(t)).map(stem))];
  const flat = (s) => normalize(s).replace(/[^a-z0-9]+/g, " ").trim();
  // Números de documento/cartão não vão para o provedor: a pergunta é encaminhada.
  const SENSITIVE = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b|\b(?:\d[ -]?){13,19}\b/;
  // A busca textual não entende bem condições, comparações ou perguntas sobre dois temas.
  // Esses casos nunca recebem uma resposta fuzzy de um só item.
  const COMPLEX_INTENT = /\b(se|caso|exceto|menos|compar(?:ar|acao|ação)|diferen(?:ca|ça)|entre|versus|vs|junto|ambos|duas|dois|alem|além|e tambem|e também)\b/i;
  const NEGATION = /\b(n[aã]o|nunca|jamais|sem)\b/i;

  // Índice da FAQ montado uma vez por isolate (não por requisição).
  const ITEMS = faq.flatMap(item => [item.pergunta, ...(item.equivalentes || [])].map(pergunta => ({
    item,
    q: new Set(stems(pergunta)),
    a: new Set(stems(item.resposta)),
    // Sem filtro de stopwords: usado só para listar assuntos de um termo genérico.
    // Prefixo de 4 letras para aproximar flexões do menu ("cartão"/"cartões").
    qAll: new Set(tokens(pergunta).map(t => t.slice(0, 4))),
    words: [...new Set([...tokens(pergunta), ...tokens(item.resposta)].filter(t => !STOP.has(t)))],
  })));
  const CORPUS = new Set(ITEMS.flatMap(e => [...e.q, ...e.a]));
  const WORDS_BY_LETTER = new Map();
  for (const entry of ITEMS) {
    for (const word of entry.words) {
      const key = word[0];
      if (!WORDS_BY_LETTER.has(key)) WORDS_BY_LETTER.set(key, new Set());
      WORDS_BY_LETTER.get(key).add(word);
    }
  }

  // Levenshtein limitado: para quando a distância já passou do limite (custo desprezível).
  function within(a, b, max) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = new Array(b.length + 1);
      cur[0] = i;
      let rowMin = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  // Erro de digitação: 1 letra (2 em palavras longas), mesma inicial e tamanho próximo.
  // Palavras com menos de 6 letras não entram no fuzzy — evita casar "custo" com "justo".
  function resolve(token) {
    const exact = stem(token);
    if (CORPUS.has(exact)) return { stem: exact, fuzzy: false };
    if (token.length < 6) return null;
    const max = token.length >= 9 ? 2 : 1;
    let bestWord = null;
    let bestDist = max + 1;
    for (const word of WORDS_BY_LETTER.get(token[0]) || []) {
      if (Math.abs(word.length - token.length) > max) continue;
      const d = within(token, word, max);
      if (d < bestDist) {
        bestDist = d;
        bestWord = word;
        if (d === 1) break;
      }
    }
    return bestWord ? { stem: stem(bestWord), fuzzy: true } : null;
  }

  // Pergunta idêntica (ignorando acentos/pontuação) responde pelo texto exato da FAQ.
  function exact(question) {
    return faq.find(item => [item.pergunta, ...(item.equivalentes || [])].some(pergunta => flat(pergunta) === flat(question))) || null;
  }

  // Paráfrases e typos: exige cobertura lexical mínima; empates e quase empates
  // são apresentados como múltiplos assuntos, sem selecionar uma resposta arbitrária.
  // Negação e perguntas condicionais seguem para a camada contextual (Gemini).
  function matches(question) {
    // Condicionais/negações pedem interpretação contextual; não decidir só pela similaridade.
    if (COMPLEX_INTENT.test(question) || NEGATION.test(question)) return [];
    const keys = [];
    for (const token of tokens(question)) {
      if (STOP.has(token)) continue;
      const hit = resolve(token);
      if (hit) keys.push(hit);
      else keys.push({ stem: null, fuzzy: false });
    }
    if (!keys.some(k => k.stem)) return [];
    const unknown = keys.filter(k => !k.stem).length;
    // Um termo novo pode mudar a operação: "PIX do saldo" não é "compra com saldo".
    if (unknown > 0) return [];
    const scored = [];
    for (const entry of ITEMS) {
      let score = 0, qHits = 0;
      for (const k of keys) {
        if (!k.stem) continue;
        if (entry.q.has(k.stem)) { score += k.fuzzy ? 2 : 3; qHits++; }
        else if (entry.a.has(k.stem)) score += 1;
      }
      // Exige maior parte do conteúdo informativo, não apenas um termo genérico.
      const coverage = qHits / keys.length;
      const confident = (qHits >= 2 && coverage >= 0.6)
        || (qHits === 1 && keys.length === 1);
      if (confident && score >= 2) {
        const previous = scored.find(s => s.item === entry.item);
        if (!previous) scored.push({ item: entry.item, score, qHits, coverage });
        else if (score > previous.score || (score === previous.score && qHits > previous.qHits)) {
          Object.assign(previous, { score, qHits, coverage });
        }
      }
    }
    if (!scored.length) return [];
    scored.sort((a, b) => b.score - a.score || b.qHits - a.qHits);
    const top = scored[0];
    const runner = scored[1];
    // Empates e quase empates exigem desambiguação, não a escolha arbitrária do primeiro.
    if (runner && top.score - runner.score <= 2) {
      return scored.filter(s => top.score - s.score <= 2).slice(0, 3).map(s => s.item);
    }
    // Perguntas com vários termos exigem mais que uma coincidência lexical.
    if (keys.length >= 3 && top.coverage < 0.7) return [];
    return [top.item];
  }

  // Entrada genérica ("cartão", "benefícios"): lista os assuntos da FAQ que contêm o termo,
  // sem inventar resposta para uma pergunta que não foi feita.
  function topics(question) {
    const raw = tokens(question);
    // Só para entrada 100% genérica ("cartão", "benefícios"): se houver qualquer termo
    // informativo, a decisão é da busca normal (evita responder item errado a "demitido").
    if (!raw.length || raw.some(t => !STOP.has(t))) return [];
    const terms = raw.map(t => t.slice(0, 4)).filter(t => t.length >= 4);
    if (!terms.length) return [];
    const items = [];
    for (const entry of ITEMS) {
      if (!terms.some(t => entry.qAll.has(t))) continue;
      if (!items.includes(entry.item)) items.push(entry.item);
      if (items.length === 6) break;
    }
    return items;
  }


  const result = (payload, path) => ({ ...payload, path });
  return function searchFaq(question) {
    const conversational = normalize(question).replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    if (/^(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)( (tudo bem|tudo bom|pessoal|equipe|assistente))?$/.test(conversational)) {
      return result({answer:"Olá! 👋 Sou o Assistente JÁ. Posso ajudar com dúvidas sobre benefícios, cartões, taxas e contratação. O que você gostaria de saber?",handoff:false}, "greeting");
    }
    if (/^(obrigado|obrigada|muito obrigado|muito obrigada|valeu|agradeco)$/.test(conversational)) {
      return result({answer:"Por nada! Se precisar de mais informações sobre o JÁ Benefícios, estou à disposição.",handoff:false}, "thanks");
    }
    if (/^(tchau|ate logo|ate mais|falou)$/.test(conversational)) {
      return result({answer:"Até logo! Se precisar de informações sobre o JÁ Benefícios, é só chamar.",handoff:false}, "farewell");
    }

    if (SENSITIVE.test(question)) return result({answer:FALLBACK,handoff:true}, "blocked");

    const hit = exact(question);
    if (hit) return result({answer:hit.resposta,handoff:false}, "faq_exact");
    const found = matches(question);
    if (found.length === 1) return result({answer:found[0].resposta,handoff:false}, "faq_match");
    if (found.length > 1) {
      const parts = [];
      let size = 0;
      const suggestions = [];
      for (const item of found) {
        const block = `• ${item.pergunta}\n${item.resposta}`;
        if (parts.length >= 2 && size + block.length > 1000) break;
        parts.push(block);
        size += block.length;
        suggestions.push(item.pergunta);
      }
      const answer = `Encontrei mais de um assunto na central de dúvidas. Toque em um dos botões abaixo para ver a resposta:\n\n${parts.join("\n\n")}`;
      return result({answer, suggestions: suggestions.slice(0, 6), handoff:false}, "faq_multi");
    }
    const related = topics(question);
    if (related.length === 1) return result({answer:related[0].resposta,handoff:false}, "faq_match");
    if (related.length > 1) {
      const answer = `Encontrei estes assuntos na central de dúvidas:\n\n${related.map(i => `• ${i.pergunta}`).join("\n")}`;
      return result({answer, suggestions: related.map(i => i.pergunta), handoff:false}, "faq_topics");
    }
    return null;
  };
}
