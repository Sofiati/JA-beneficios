import React, { useState, useRef } from "react";
import { faqItems, type FaqItem } from "../faq";
import { createFaqRanker } from "../faq-search.mjs";

// Mesma fonte da FAQ oficial e do Assistente JÁ (inclui os itens de catálogo
// com alvo, que não aparecem na lista do site).
const rankItems = createFaqRanker(faqItems);

interface SearchBarProps {
  placeholder: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FaqItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (term: string) => {
    setQuery(term);
    if (!term.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setResults(rankItems.rank(term).map((entry) => entry.item));
    setIsOpen(true);
  };

  const handleSelect = (item: FaqItem) => {
    setIsOpen(false);
    setQuery("");

    // Itens de catálogo apontam para a seção; dúvidas da FAQ abrem o <details> dela.
    const targetId = item.alvo || "faq";
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (!item.alvo) {
        const faqList = el.querySelectorAll("details.faq-item");
        faqList.forEach((detailsEl) => {
          const summaryText = detailsEl.querySelector("summary")?.textContent?.trim();
          if (summaryText === item.pergunta) {
            (detailsEl as HTMLDetailsElement).open = true;
            detailsEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    }, 50);
  };

  const getBadge = (item: FaqItem) => {
    if (item.alvo === "custo-zero") return { className: "search-badge search-badge--taxa", label: "Taxa Zero" };
    if (item.alvo) return { className: "search-badge search-badge--beneficio", label: "Benefício" };
    return { className: "search-badge search-badge--faq", label: "Central de Ajuda" };
  };

  return (
    <div className="site-search-wrapper" ref={containerRef}>
      <div className="site-search-input-wrap">
        <svg
          className="site-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          className="site-search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          aria-label="Buscar no site"
        />
        {query && (
          <button
            type="button"
            className="site-search-clear"
            aria-label="Limpar busca"
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div className="site-search-results">
          {results.length > 0 ? (
            <ul className="site-search-list">
              {results.map((item) => {
                const badge = getBadge(item);
                return (
                  <li key={item.id} className="site-search-item">
                    <button
                      type="button"
                      className="site-search-btn"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="site-search-item-head">
                        <span className={badge.className}>
                          {badge.label}
                        </span>
                        <span className="site-search-category">{item.grupo}</span>
                      </div>
                      <strong className="site-search-item-title">{item.pergunta}</strong>
                      <p className="site-search-item-desc">{item.resposta}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="site-search-empty">
              <p>Nenhum resultado encontrado para “<strong>{query}</strong>”.</p>
              <small>Tente buscar por “PAT”, “16 categorias”, “frete”, “implantação” ou “segunda via”.</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
