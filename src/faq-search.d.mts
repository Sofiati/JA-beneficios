export interface FaqItem {
  id: string;
  grupo: string;
  pergunta: string;
  resposta: string;
  equivalentes: string[];
  exibirNoSite: boolean;
  /** Seção alvo da busca do site para itens de catálogo (não exibem na FAQ). */
  alvo?: string;
}

export interface FaqSearchResult {
  answer: string;
  suggestions?: string[];
  handoff: boolean;
  path: "greeting" | "thanks" | "farewell" | "blocked" | "faq_exact" | "faq_match" | "faq_multi" | "faq_topics";
}

export const FAQ_FALLBACK: string;
export function createFaqSearch(items: readonly FaqItem[]): (question: string) => FaqSearchResult | null;

export interface FaqRankEntry {
  item: FaqItem;
  score: number;
  qHits: number;
}

/** Lista ordenada de itens para a busca do site (sem os portões do chat). */
export function createFaqRanker(items: readonly FaqItem[]): {
  searchFaq: (question: string) => FaqSearchResult | null;
  rank: (question: string, limit?: number) => FaqRankEntry[];
};
