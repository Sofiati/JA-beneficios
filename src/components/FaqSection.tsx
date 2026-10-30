import React, { useEffect, useMemo, useState } from "react";
import { SearchBar } from "./SearchBar";

import { siteFaqItems, type FaqItem } from "../faq";

export const FaqSection: React.FC = () => {
  const items = siteFaqItems;
  // Filtro por tema (chips): null mostra todos os grupos, igual à FAQ de hoje.
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Inject or update Schema.org FAQPage JSON-LD in document head for search engine rich snippets
  useEffect(() => {
    if (!items || items.length === 0) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.pergunta,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.resposta,
        },
      })),
    };

    const scriptId = "faq-schema-jsonld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [items]);

  const grouped: { [key: string]: FaqItem[] } = useMemo(() => {
    const acc: { [key: string]: FaqItem[] } = {};
    items.forEach((item) => {
      const g = item.grupo?.trim() || "Perguntas";
      if (!acc[g]) acc[g] = [];
      acc[g].push(item);
    });
    return acc;
  }, [items]);

  const groupEntries = Object.entries(grouped);
  const visibleGroups = activeGroup
    ? groupEntries.filter(([g]) => g === activeGroup)
    : groupEntries;

  let globalIndex = 0;

  return (
    <section className="section section--white" id="faq">
      <div className="container">
        <div className="faq-search-box" style={{ marginBottom: "24px" }}>
          <SearchBar placeholder="O que você procura? Digite uma dúvida, benefício ou taxa (ex: PAT, frete, 1ª via, app)…" />
        </div>

        {/* Chips de filtro por tema: mesmas famílias dos grupos do faq.json. */}
        <div className="faq-chips" role="group" aria-label="Filtrar dúvidas por tema">
          <button
            type="button"
            className={`faq-chip${activeGroup === null ? " faq-chip--active" : ""}`}
            aria-pressed={activeGroup === null}
            onClick={() => setActiveGroup(null)}
          >
            Todos
          </button>
          {groupEntries.map(([groupTitle, groupItems]) => (
            <button
              key={groupTitle}
              type="button"
              className={`faq-chip${activeGroup === groupTitle ? " faq-chip--active" : ""}`}
              aria-pressed={activeGroup === groupTitle}
              onClick={() => setActiveGroup(groupTitle)}
            >
              {groupTitle}
              <span className="faq-chip-count">{groupItems.length}</span>
            </button>
          ))}
        </div>

        <div className="faq-layout">
          <div className="faq-aside" data-animate>
            <p className="eyebrow">Central de dúvidas</p>
            <h2>Perguntas frequentes</h2>
            <p className="lead">Tudo o que você precisa saber sobre o JÁ Benefícios, em respostas simples e diretas.</p>

            <div className="faq-help">
              <span className="faq-help-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                  <path d="M4 13h2.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                  <path d="M20 13h-2.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" />
                  <path d="M18.6 18.6v.9a2 2 0 0 1-2 2h-3.2" />
                </svg>
              </span>
              <h3>Ainda tem dúvidas?</h3>
              <p>Nossa equipe está pronta para ajudar você a conhecer a solução ideal para sua empresa.</p>
              <a href="#beneficiosForm" className="btn btn-cream">Conversar com um especialista <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <div className="faq-list" id="faqList" data-animate>
            {visibleGroups.map(([groupTitle, groupItems]) => (
              <React.Fragment key={groupTitle}>
                <div className="faq-group-head">
                  <h3 className="faq-group-title">{groupTitle}</h3>
                  <span className="faq-group-count" aria-hidden="true">
                    {groupItems.length === 1 ? "1 pergunta" : `${groupItems.length} perguntas`}
                  </span>
                </div>
                {groupItems.map((item) => {
                  const isFirst = globalIndex === 0;
                  globalIndex++;
                  return (
                    <details key={item.pergunta} className="faq-item" open={isFirst}>
                      <summary>{item.pergunta}</summary>
                      <p>{item.resposta}</p>
                    </details>
                  );
                })}
              </React.Fragment>
            ))}

            <div className="faq-cta">
              <div>
                <h3 className="faq-cta-title">Não encontrou a resposta que procurava?</h3>
                <p>Cada operação tem suas particularidades. Conte como é a sua e a gente mostra o que se encaixa.</p>
              </div>
              <a href="#beneficiosForm" className="btn btn-solid btn-sm">Enviar dúvida <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
