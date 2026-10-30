import React, { useState, useEffect, useRef } from "react";
import { Index } from "flexsearch";
import "../chat.css";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  isPending?: boolean;
}

interface FaqItem {
  grupo?: string;
  pergunta: string;
  resposta: string;
}

const STORAGE_KEY = "ja_chat_messages_v2";

const STARTER_QUESTIONS = [
  { icon: "💳", question: "Quais cartões a JÁ oferece?" },
  { icon: "💲", question: "Quais são as taxas e custos para a empresa?" },
  { icon: "📱", question: "Como funciona o app do colaborador?" },
  { icon: "📋", question: "Como contratar para minha empresa?" },
];

const STOP_WORDS = new Set([
  "a", "o", "os", "as", "um", "uma", "de", "da", "do", "das", "dos", "no", "na",
  "nos", "nas", "para", "por", "que", "com", "como", "qual", "quais", "quem", "e",
  "em", "ao", "aos", "meu", "minha", "sua", "suas", "seus", "tem", "ter", "onde",
  "esse", "essa", "sobre", "quero", "preciso", "gostaria", "voces", "voce", "faz",
  "funciona", "funcionam", "funcionar", "fazem", "for"
]);

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTokens(str: string): string[] {
  return (normalizeText(str).match(/[a-z0-9]{3,}/g) || []).filter(
    (t) => !STOP_WORDS.has(t)
  );
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "bot",
  text: "Olá! 👋 Sou o Assistente JÁ. Posso esclarecer dúvidas sobre benefícios corporativos, taxas, implantação e aplicativo. Como posso ajudar?",
};

interface FloatingActionsProps {
  /** Página ativa: só a home tem #beneficiosForm para observar. */
  page: "home" | "privacy";
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ page }) => {
  const [showToTop, setShowToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback on storage error
    }
    return [INITIAL_MESSAGE];
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoffText, setHandoffText] = useState("Olá! Gostaria de falar com a equipe JÁ Benefícios.");
  const [endpoint, setEndpoint] = useState("");
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});

  const feedRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const flexIndexRef = useRef<Index | null>(null);

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      const nonPending = messages.filter((m) => !m.isPending);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nonPending));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 320);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Guards dos canais flutuantes: as classes `body.form-in-view`, `body.footer-in-view`
     e `body.footer-link-in-band` já existiam em style.css/chat.css (recuar para não
     cobrir o formulário, o rodapé e os links legais), mas nada as aplicava — os dois
     botões ficavam sobre o select e o envio no mobile (ponto 2 da crítica da Hero).
     Observadores por página: #beneficiosForm só existe na home. */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const guards = new Map<Element, string>();
    const form = page === "home" ? document.getElementById("beneficiosForm") : null;
    const footer = document.getElementById("siteFooter");
    const footerLinks = document.querySelector(".footer-links");
    if (form) guards.set(form, "form-in-view");
    if (footer) guards.set(footer, "footer-in-view");
    if (footerLinks) guards.set(footerLinks, "footer-link-in-band");
    if (guards.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cls = guards.get(entry.target);
          if (cls) document.body.classList.toggle(cls, entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );
    guards.forEach((_cls, el) => observer.observe(el));

    return () => {
      observer.disconnect();
      guards.forEach((cls) => document.body.classList.remove(cls));
    };
  }, [page]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isChatOpen) {
        setIsChatOpen(false);
        toggleBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  useEffect(() => {
    // Fetch endpoint config
    fetch("/chat-config.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((config: { endpoint?: string } | null) => {
        if (config?.endpoint && /^https:\/\//.test(config.endpoint)) {
          setEndpoint(config.endpoint);
        }
      })
      .catch(() => {});

    // Fetch local FAQ data & initialize FlexSearch
    fetch("/faq.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FaqItem[] | null) => {
        if (Array.isArray(data)) {
          setFaqData(data);
          const index = new Index({
            tokenize: "forward",
            resolution: 9,
          });
          data.forEach((item, id) => {
            index.add(id, `${item.pergunta} ${item.resposta}`);
          });
          flexIndexRef.current = index;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, suggestions, showHandoff, isBusy]);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setSuggestions([]);
    setShowHandoff(false);
    setFeedbackMap({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const handleFeedback = (msgId: string, rating: "up" | "down") => {
    setFeedbackMap((prev) => ({ ...prev, [msgId]: rating }));
  };

  // Client-side local search engine (FlexSearch + lexical score fallback)
  const searchLocalFaq = (query: string): { answer: string; suggestions?: string[]; handoff?: boolean } => {
    const norm = normalizeText(query).replace(/[^a-z0-9\s]/g, " ").trim();

    // Conversational greetings
    if (/^(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)( (tudo bem|tudo bom|pessoal|equipe|assistente))?$/.test(norm)) {
      return {
        answer: "Olá! 👋 Sou o Assistente JÁ. Posso ajudar com dúvidas sobre benefícios corporativos, cartões, taxas e contratação. O que você gostaria de saber?",
      };
    }
    if (/^(obrigado|obrigada|muito obrigado|muito obrigada|valeu|agradeco)$/.test(norm)) {
      return {
        answer: "Por nada! Se precisar de mais informações sobre o JÁ Benefícios, estou à disposição.",
      };
    }
    if (/^(tchau|ate logo|ate mais|falou)$/.test(norm)) {
      return { answer: "Até logo! Se precisar de informações sobre o JÁ Benefícios, é só chamar." };
    }

    const queryTokens = getTokens(query);

    if (queryTokens.length === 0 || !faqData.length) {
      return {
        answer: "Não encontrei uma informação oficial suficiente para responder com segurança. Você pode falar com nossa equipe pelo WhatsApp ou solicitar contato comercial pelo formulário.",
        handoff: true,
      };
    }

    // Direct exact question match
    const exactQuestionMatch = faqData.find(
      (item) => normalizeText(item.pergunta) === norm
    );
    if (exactQuestionMatch) {
      return { answer: exactQuestionMatch.resposta };
    }

    // Build corpus of known tokens in the FAQ
    const corpusTokens = new Set<string>();
    faqData.forEach((item) => {
      getTokens(item.pergunta).forEach((t) => corpusTokens.add(t));
      getTokens(item.resposta).forEach((t) => corpusTokens.add(t));
    });

    // Identify informative tokens in the query that do not exist in the FAQ corpus
    const unknownTokens = queryTokens.filter(
      (token) =>
        !corpusTokens.has(token) &&
        !Array.from(corpusTokens).some(
          (ct) => ct.startsWith(token.slice(0, 4)) || token.startsWith(ct.slice(0, 4))
        )
    );

    // If query contains unknown topics or key terms not covered in the FAQ (e.g. "marmita", "domicilio")
    if (unknownTokens.length >= 2 || (unknownTokens.length >= 1 && queryTokens.length >= 2)) {
      return {
        answer:
          "Não encontrei uma informação oficial suficiente para responder com segurança. Você pode falar com nossa equipe pelo WhatsApp ou solicitar contato comercial pelo formulário.",
        handoff: true,
      };
    }

    // FlexSearch query if available
    let flexHits: FaqItem[] = [];
    if (flexIndexRef.current) {
      const results = flexIndexRef.current.search(query, 5);
      flexHits = results.map((idx: string | number) => faqData[Number(idx)]).filter(Boolean);
    }

    // Token score calculation
    const scored = faqData.map((item) => {
      const qTokens = new Set(getTokens(item.pergunta));
      const aTokens = new Set(getTokens(item.resposta));

      let score = 0;
      let qHits = 0;

      queryTokens.forEach((token) => {
        if (qTokens.has(token)) {
          score += 3;
          qHits += 1;
        } else if (aTokens.has(token)) {
          score += 1;
        } else {
          for (const qt of qTokens) {
            if (qt.startsWith(token.slice(0, 4)) || token.startsWith(qt.slice(0, 4))) {
              score += 2;
              qHits += 0.5;
              break;
            }
          }
        }
      });

      return { item, score, qHits };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.filter((s) => s.score > 0);

    if (!topMatches.length && !flexHits.length) {
      return {
        answer: "Não encontrei uma informação oficial suficiente para responder com segurança. Você pode falar com nossa equipe pelo WhatsApp ou solicitar contato comercial pelo formulário.",
        handoff: true,
      };
    }

    // Generic query or multiple close options
    if (queryTokens.length === 1 || (topMatches.length > 1 && topMatches[0].score - topMatches[1].score < 3)) {
      const candidates = topMatches.length > 0 ? topMatches.map((m) => m.item) : flexHits;
      const closeMatches = candidates.slice(0, 5).map((item) => item.pergunta);
      return {
        answer: `Encontrei os seguintes assuntos sobre "${query}" na central de dúvidas:`,
        suggestions: closeMatches,
      };
    }

    // Clear top match
    const winner = topMatches.length > 0 ? topMatches[0].item : flexHits[0];
    return { answer: winner.resposta };
  };

  const handleSendMessage = async (textToSend: string) => {
    const msg = textToSend.trim();
    if (!msg || isBusy || msg.length > 450) return;

    setSuggestions([]);
    setShowHandoff(false);

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", text: msg }]);
    setInputValue("");
    setIsBusy(true);

    // Add pending message
    const pendingId = "pending-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: pendingId, role: "bot", text: "", isPending: true },
    ]);

    const formattedHandoff = `Olá! Preciso de ajuda sobre JÁ Benefícios: ${msg.slice(0, 130)}`;
    setHandoffText(formattedHandoff);

    let botAnswer = "";
    let botSuggestions: string[] | undefined;
    let botHandoff = false;

    // Try remote worker endpoint
    if (endpoint) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: msg }),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          if (data && data.answer) {
            botAnswer = data.answer;
            botSuggestions = data.suggestions;
            botHandoff = !!data.handoff;
          }
        }
      } catch (err) {
        console.warn("[Assistente JÁ] Remote call failed, using local search:", err);
      }
    }

    // Fallback to local search
    if (!botAnswer) {
      const localResult = searchLocalFaq(msg);
      botAnswer = localResult.answer;
      botSuggestions = localResult.suggestions;
      botHandoff = !!localResult.handoff;
    }

    // Update message feed
    setMessages((prev) =>
      prev
        .filter((m) => m.id !== pendingId)
        .concat({
          id: Date.now().toString(),
          role: "bot",
          text: botAnswer,
        })
    );

    if (botSuggestions && botSuggestions.length > 0) {
      setSuggestions(botSuggestions);
    } else if (botHandoff) {
      setShowHandoff(true);
    }

    setIsBusy(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChatOpen(false);
    const target = document.getElementById("beneficiosForm");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const firstInput = target.querySelector<HTMLInputElement>("input, select, textarea");
      firstInput?.focus();
    }
  };

  // Render markdown bold and links safely
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Replace URLs or hashes with links
      const parts = line.split(/(\bhttps?:\/\/[^\s]+|#beneficiosForm)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a key={pIdx} href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
        if (part === "#beneficiosForm") {
          return (
            <a key={pIdx} href="#beneficiosForm" onClick={handleScrollToForm}>
              ir para formulário comercial
            </a>
          );
        }

        // Bold formatting **text**
        const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
        return boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith("**") && bPart.endsWith("**")) {
            return <strong key={bIdx}>{bPart.slice(2, -2)}</strong>;
          }
          return bPart;
        });
      });

      return (
        <React.Fragment key={idx}>
          {formattedLine}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const isOnlyInitialMessage = messages.length === 1 && messages[0].id === "init";

  return (
    <>
      <button
        className={`to-top ${showToTop ? "is-visible" : ""}`}
        id="toTop"
        type="button"
        aria-label="Voltar ao início da página"
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>

      <a
        className="whatsapp-fab"
        href="https://wa.me/5511910993348?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20J%C3%81%20Benef%C3%ADcios."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento humano pelo WhatsApp da JÁ Benefícios"
        title="Atendimento humano pelo WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <button
        ref={toggleBtnRef}
        type="button"
        id="jaChatToggle"
        className="ja-chat-launch"
        aria-expanded={isChatOpen}
        aria-controls="jaChatPanel"
        aria-label={isChatOpen ? "Fechar Assistente JÁ" : "Abrir Assistente JÁ"}
        title="Assistente JÁ"
        onClick={() => setIsChatOpen((prev) => !prev)}
      >
        {isChatOpen ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5c-1.3 0-2.52-.33-3.6-.92L4 19l1.1-4.47A7.47 7.47 0 0 1 4.5 11.5 7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="color-mix(in srgb, currentColor 10%, transparent)" />
            <path d="M12 7l.6 1.7 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6.6-1.7Z" fill="var(--ja-mostarda)" />
            <path d="M15.5 12.5l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4.4-1Z" fill="var(--ja-mostarda)" />
          </svg>
        )}
        <span>Assistente JÁ</span>
      </button>

      <section
        id="jaChatPanel"
        className="ja-chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Assistente JÁ"
        hidden={!isChatOpen}
      >
        <div className="ja-chat-header">
          <div>
            <strong>Assistente JÁ</strong>
            <small>Respostas da central de dúvidas</small>
          </div>
          <div className="ja-chat-header-actions">
            <button
              type="button"
              className="ja-chat-action-btn"
              title="Reiniciar conversa"
              aria-label="Reiniciar conversa"
              onClick={handleResetChat}
            >
              ↺
            </button>
            <button
              id="jaChatClose"
              className="ja-chat-close"
              type="button"
              aria-label="Fechar assistente"
              onClick={() => setIsChatOpen(false)}
            >
              ×
            </button>
          </div>
        </div>

        <div
          id="jaChatMessages"
          className="ja-chat-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          ref={feedRef}
        >
          {messages.map((m) => (
            <React.Fragment key={m.id}>
              <div
                className={`ja-chat-bubble ja-chat-${m.role} ${m.isPending ? "ja-chat-pending" : ""}`}
              >
                {m.isPending ? (
                  <div className="ja-chat-typing-dots" aria-label="Processando resposta">
                    <span className="ja-chat-dot"></span>
                    <span className="ja-chat-dot"></span>
                    <span className="ja-chat-dot"></span>
                  </div>
                ) : (
                  renderFormattedText(m.text)
                )}
              </div>

              {/* Feedback controls for non-initial bot messages */}
              {m.role === "bot" && !m.isPending && m.id !== "init" && (
                <div className="ja-chat-feedback">
                  {feedbackMap[m.id] ? (
                    <span className="ja-chat-feedback-thanks">Obrigado pelo feedback!</span>
                  ) : (
                    <>
                      <span>Esta resposta foi útil?</span>
                      <button
                        type="button"
                        className="ja-chat-feedback-btn"
                        title="Sim, foi útil"
                        aria-label="Marcar resposta como útil"
                        onClick={() => handleFeedback(m.id, "up")}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        className="ja-chat-feedback-btn"
                        title="Não foi útil"
                        aria-label="Marcar resposta como não útil"
                        onClick={() => handleFeedback(m.id, "down")}
                      >
                        👎
                      </button>
                    </>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Quick starter question pills */}
          {isOnlyInitialMessage && (
            <div className="ja-chat-starters">
              <span className="ja-chat-starters-title">Dúvidas frequentes:</span>
              {STARTER_QUESTIONS.map((sq) => (
                <button
                  key={sq.question}
                  type="button"
                  className="ja-chat-starter-btn"
                  onClick={() => handleSendMessage(sq.question)}
                >
                  <span>{sq.icon}</span>
                  <span>{sq.question}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="ja-chat-suggestions">
              {suggestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="ja-chat-suggestion"
                  onClick={() => handleSendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {showHandoff && (
          <div id="jaChatHandoff" className="ja-chat-handoff">
            <a
              id="jaChatWhatsapp"
              href={`https://wa.me/5511910993348?text=${encodeURIComponent(handoffText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar pelo WhatsApp
            </a>
            <button
              id="jaChatSales"
              type="button"
              onClick={handleScrollToForm}
            >
              Solicitar contato comercial
            </button>
          </div>
        )}

        <form id="jaChatForm" className="ja-chat-form" onSubmit={handleFormSubmit}>
          <label htmlFor="jaChatInput" className="sr-only">
            Sua pergunta ao Assistente JÁ
          </label>
          <input
            id="jaChatInput"
            type="text"
            name="message"
            maxLength={450}
            autoComplete="off"
            placeholder="Digite sua pergunta…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isBusy}
            required
          />
          <button
            id="jaChatSend"
            type="submit"
            aria-label="Enviar pergunta"
            disabled={isBusy || !inputValue.trim()}
          >
            ➜
          </button>
        </form>

        <p className="ja-chat-note">
          Respostas automáticas da central de dúvidas. Não envie CPF, senhas ou dados de cartão.
        </p>
      </section>
    </>
  );
};
