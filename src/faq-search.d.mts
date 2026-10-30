export interface FaqItem {
  id: string;
  grupo: string;
  pergunta: string;
  resposta: string;
  equivalentes: string[];
  exibirNoSite: boolean;
}

export interface FaqSearchResult {
  answer: string;
  suggestions?: string[];
  handoff: boolean;
  path: "greeting" | "thanks" | "farewell" | "blocked" | "faq_exact" | "faq_match" | "faq_multi" | "faq_topics";
}

export const FAQ_FALLBACK: string;
export function createFaqSearch(items: readonly FaqItem[]): (question: string) => FaqSearchResult | null;
