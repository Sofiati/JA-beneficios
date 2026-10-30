import source from "./faq.json";
import type { FaqItem } from "./faq-search.mjs";

export type { FaqItem } from "./faq-search.mjs";

// O build valida o contrato e os consumidores compartilham a mesma fonte.
export const faqItems: FaqItem[] = source;
export const siteFaqItems: FaqItem[] = faqItems.filter((item) => item.exibirNoSite);
