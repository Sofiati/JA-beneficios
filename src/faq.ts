import source from "./faq.json";
import type { FaqItem } from "./faq-search.mjs";

export type { FaqItem } from "./faq-search.mjs";

// O build valida o contrato e os consumidores compartilham a mesma fonte.
// Cast para manter os literais de persona no tipo (JSON é inferido como `string`).
export const faqItems: FaqItem[] = source as FaqItem[];
export const siteFaqItems: FaqItem[] = faqItems.filter((item) => item.exibirNoSite);
