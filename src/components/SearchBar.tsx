import React, { useState, useEffect, useRef } from "react";
import FlexSearch from "flexsearch";

export interface SearchDoc {
  id: string;
  type: "beneficio" | "faq" | "taxa";
  title: string;
  category: string;
  content: string;
  targetId: string;
  [key: string]: any;
}

const STATIC_SEARCH_DATA: SearchDoc[] = [
  // Benefícios / Categorias
  {
    id: "cat-1",
    type: "beneficio",
    title: "Alimentação (PAT)",
    category: "Alimentação PAT",
    content: "Apoio às compras de alimentos em supermercados e mercearias para o dia a dia do colaborador e da família.",
    targetId: "ecossistema",
  },
  {
    id: "cat-2",
    type: "beneficio",
    title: "Refeição (PAT)",
    category: "Alimentação PAT",
    content: "Refeições prontas para a rotina de trabalho em restaurantes, lanchonetes e padarias.",
    targetId: "ecossistema",
  },
  {
    id: "cat-3",
    type: "beneficio",
    title: "Alimentação e Refeição (PAT)",
    category: "Alimentação PAT",
    content: "As duas modalidades em uma única solução com liberdade de uso conforme as regras do PAT.",
    targetId: "ecossistema",
  },
  {
    id: "cat-4",
    type: "beneficio",
    title: "Cultura",
    category: "Bem-estar e rotina",
    content: "Cinema, teatro, shows, museus, livrarias e eventos — lazer e desenvolvimento pessoal.",
    targetId: "ecossistema",
  },
  {
    id: "cat-5",
    type: "beneficio",
    title: "Saúde",
    category: "Bem-estar e rotina",
    content: "Farmácias, consultas, exames e outros serviços habilitados de saúde e bem-estar.",
    targetId: "ecossistema",
  },
  {
    id: "cat-6",
    type: "beneficio",
    title: "Educação",
    category: "Bem-estar e rotina",
    content: "Incentivo ao aprendizado contínuo, cursos e desenvolvimento profissional.",
    targetId: "ecossistema",
  },
  {
    id: "cat-7",
    type: "beneficio",
    title: "Mobilidade",
    category: "Bem-estar e rotina",
    content: "Transporte urbano, aplicativos de mobilidade como Uber e 99 e locomoção do dia a dia.",
    targetId: "ecossistema",
  },
  {
    id: "cat-8",
    type: "beneficio",
    title: "Combustível",
    category: "Bem-estar e rotina",
    content: "Abastecimento em postos habilitados apoiando os deslocamentos do time.",
    targetId: "ecossistema",
  },
  {
    id: "cat-9",
    type: "beneficio",
    title: "Trabalho Remoto / Home Office",
    category: "Bem-estar e rotina",
    content: "Apoio às despesas de home office como internet, energia elétrica e equipamentos de trabalho à distância.",
    targetId: "ecossistema",
  },
  {
    id: "cat-10",
    type: "beneficio",
    title: "Premiação",
    category: "Reconhecimento e flexibilidade",
    content: "Reconheça resultados, metas alcançadas e desempenho de destaque do time.",
    targetId: "ecossistema",
  },
  {
    id: "cat-11",
    type: "beneficio",
    title: "Incentivo",
    category: "Reconhecimento e flexibilidade",
    content: "Campanhas de engajamento, desafios corporativos e motivação do time.",
    targetId: "ecossistema",
  },
  {
    id: "cat-12",
    type: "beneficio",
    title: "Assiduidade",
    category: "Reconhecimento e flexibilidade",
    content: "Reconhecimento da presença e pontualidade do colaborador.",
    targetId: "ecossistema",
  },
  {
    id: "cat-13",
    type: "beneficio",
    title: "Aniversário",
    category: "Reconhecimento e flexibilidade",
    content: "Benefício comemorativo para celebrar o aniversário dos colaboradores.",
    targetId: "ecossistema",
  },
  {
    id: "cat-14",
    type: "beneficio",
    title: "Natal",
    category: "Reconhecimento e flexibilidade",
    content: "Presente de fim de ano para substituir ou complementar a cesta natalina.",
    targetId: "ecossistema",
  },
  {
    id: "cat-15",
    type: "beneficio",
    title: "Multiuso",
    category: "Reconhecimento e flexibilidade",
    content: "Diferentes possibilidades em uma única solução com regras flexíveis.",
    targetId: "ecossistema",
  },
  {
    id: "cat-16",
    type: "beneficio",
    title: "Saldo Livre",
    category: "Reconhecimento e flexibilidade",
    content: "Valores com utilização mais flexível em toda a rede de aceitação Visa.",
    targetId: "ecossistema",
  },

  // Taxas e Condições
  {
    id: "taxa-1",
    type: "taxa",
    title: "Taxa de Implantação R$ 0,00",
    category: "Taxa Zero",
    content: "Zero custo de implantação da plataforma de benefícios para a empresa.",
    targetId: "custo-zero",
  },
  {
    id: "taxa-2",
    type: "taxa",
    title: "Mensalidade R$ 0,00",
    category: "Taxa Zero",
    content: "Sem mensalidade nem taxa por colaborador. A empresa paga somente pelos créditos do time.",
    targetId: "custo-zero",
  },
  {
    id: "taxa-3",
    type: "taxa",
    title: "Emissão da 1ª Via do Cartão R$ 0,00",
    category: "Taxa Zero",
    content: "A emissão do primeiro cartão físico para cada colaborador é totalmente gratuita.",
    targetId: "custo-zero",
  },
  {
    id: "taxa-4",
    type: "taxa",
    title: "Frete dos Cartões Físicos",
    category: "Condições Comerciais",
    content: "Frete cobrado à parte com valor variável conforme a região de entrega.",
    targetId: "custo-zero",
  },
];

interface SearchBarProps {
  onSelectResult?: (targetId: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectResult,
  placeholder = "Buscar benefícios, taxas ou dúvidas (ex: PAT, frete, 1ª via, app)…",
  className = "",
  autoFocus = false,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [flexIndex, setFlexIndex] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize FlexSearch Document Index
  useEffect(() => {
    const docIndex = new FlexSearch.Document({
      document: {
        id: "id",
        index: ["title", "content", "category"],
        store: ["id", "type", "title", "category", "content", "targetId"],
      },
      tokenize: "forward",
      resolution: 9,
    });

    // Add static benefits and fees
    STATIC_SEARCH_DATA.forEach((doc) => docIndex.add(doc));

    // Add FAQ items dynamically
    fetch("/faq.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((faqItems: any[]) => {
        if (Array.isArray(faqItems)) {
          faqItems.forEach((faq, index) => {
            docIndex.add({
              id: `faq-${index}`,
              type: "faq",
              title: faq.pergunta,
              category: faq.grupo || "FAQ",
              content: faq.resposta,
              targetId: "faq",
            });
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setFlexIndex(docIndex);
      });
  }, []);

  // Handle Close on Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Input Change
  const handleSearch = (term: string) => {
    setQuery(term);
    const cleanTerm = term.trim();

    if (!cleanTerm || !flexIndex) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    try {
      const searchResults = flexIndex.search(cleanTerm, { limit: 8, enrich: true });
      const resultMap = new Map<string, SearchDoc>();

      searchResults.forEach((fieldResult: any) => {
        if (fieldResult.result) {
          fieldResult.result.forEach((item: any) => {
            if (item.doc && !resultMap.has(item.doc.id)) {
              resultMap.set(item.doc.id, item.doc);
            }
          });
        }
      });

      const uniqueResults = Array.from(resultMap.values());
      setResults(uniqueResults);
      setIsOpen(true);
    } catch (err) {
      console.error("[FlexSearch] Error searching:", err);
    }
  };

  const handleSelect = (doc: SearchDoc) => {
    setIsOpen(false);
    setQuery("");

    if (onSelectResult) {
      onSelectResult(doc.targetId);
    }

    // Scroll to target element smoothly
    setTimeout(() => {
      const el = document.getElementById(doc.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        // If target is FAQ, expand matching details accordion
        if (doc.type === "faq") {
          const faqList = el.querySelectorAll("details.faq-item");
          faqList.forEach((detailsEl) => {
            const summaryText = detailsEl.querySelector("summary")?.textContent?.trim();
            if (summaryText === doc.title) {
              (detailsEl as HTMLDetailsElement).open = true;
              detailsEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          });
        }
      }
    }, 50);
  };

  const getBadgeClass = (type: SearchDoc["type"]) => {
    switch (type) {
      case "beneficio":
        return "search-badge search-badge--beneficio";
      case "taxa":
        return "search-badge search-badge--taxa";
      case "faq":
        return "search-badge search-badge--faq";
      default:
        return "search-badge";
    }
  };

  const getBadgeLabel = (type: SearchDoc["type"]) => {
    switch (type) {
      case "beneficio":
        return "Benefício";
      case "taxa":
        return "Taxa Zero";
      case "faq":
        return "Central de Ajuda";
      default:
        return "Info";
    }
  };

  return (
    <div className={`site-search-wrapper ${className}`} ref={containerRef}>
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
          autoFocus={autoFocus}
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
              {results.map((item) => (
                <li key={item.id} className="site-search-item">
                  <button
                    type="button"
                    className="site-search-btn"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="site-search-item-head">
                      <span className={getBadgeClass(item.type)}>
                        {getBadgeLabel(item.type)}
                      </span>
                      <span className="site-search-category">{item.category}</span>
                    </div>
                    <strong className="site-search-item-title">{item.title}</strong>
                    <p className="site-search-item-desc">{item.content}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="site-search-empty">
              <p>Nenhum resultado encontrado para "<strong>{query}</strong>".</p>
              <small>Tente buscar por "PAT", "16 categorias", "frete", "implantação" ou "segunda via".</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
