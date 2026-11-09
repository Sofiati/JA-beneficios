import React, { useState, useEffect, useRef } from "react";
import { faqItems } from "../faq";
import { createFaqSearch, FAQ_FALLBACK } from "../faq-search.mjs";
import { WhatsappIcon, whatsappLink } from "./whatsapp";
import "../chat.css";

type ChatPersona = "empresa_RH" | "colaborador";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  isPending?: boolean;
  question?: string;
  persona?: ChatPersona | null;
}

const STORAGE_KEY = "ja_chat_messages_v2";
const PERSONA_STORAGE_KEY = "ja_chat_persona";

const STARTER_IDS: Record<ChatPersona | "geral", string[]> = {
  geral: ["cartoes-oferecidos", "empresa-custos", "app-funcionalidades", "empresa-contratar"],
  empresa_RH: ["empresa-custos", "implantacao-processo", "fornecedor-migracao"],
  colaborador: ["cartao-perda", "saldo-compra-recusada", "app-funcionalidades"],
};

function handoffMessage(question: string, persona: ChatPersona | null): string {
  const profile = persona === "empresa_RH" ? "RH / Empresa" : persona === "colaborador" ? "Colaborador" : "Não informado";
  return `Olá! Preciso de ajuda sobre JA Benefícios.\nPerfil: ${profile}\nMinha dúvida: ${question}`;
}

/** Busca um item de FAQ pelo ID. Retorna undefined se não encontrar. */
function findFaqItem(id: string): (typeof faqItems)[0] | undefined {
  return faqItems.find((item) => item.id === id);
}

/** Extrai a persona definida na FAQ, ou null se não houver. */
export function getFaqPersona(id: string): "empresa_RH" | "colaborador" | "ambos" | null {
  const item = findFaqItem(id);
  if (!item) return null;
  return item.persona ?? null;
}

/** Extrai o comportamento definido na FAQ. */
export function getFaqBehavior(id: string): "RESPOSTA_DIRETA" | "RESPOSTA_PARCIAL + OFERECER_HUMANO" | "HANDOFF_RAPIDO" | null {
  const item = findFaqItem(id);
  if (!item) return null;
  return item.comportamento ?? null;
}

const searchLocalFaq = createFaqSearch(faqItems);

/** Consulta local de FAQ */
export { searchLocalFaq };

const INITIAL_MESSAGE: ChatMessage = {
  id: "init",
  role: "bot",
  text: "Olá! 👋 Sou o Assistente JÁ. Posso esclarecer dúvidas sobre benefícios corporativos, taxas, implantação e aplicativo. Como posso ajudar?",
};


interface FloatingActionsProps {
  /** Página ativa: só a home tem #beneficiosForm para observar. */
  page: "home" | "privacy";
}

export function FloatingActions({ page }: FloatingActionsProps) {
  const [showToTop, setShowToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((m: unknown): m is ChatMessage =>
            typeof m === "object" && m !== null && "id" in m && typeof m.id === "string"
            && "role" in m && (m.role === "bot" || m.role === "user")
            && "text" in m && typeof m.text === "string"
            && (!("question" in m) || typeof m.question === "string")
            && (!("persona" in m) || m.persona === null || m.persona === "empresa_RH" || m.persona === "colaborador")
            && !("isPending" in m && m.isPending));
          if (valid.length > 0) return valid;
        }
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
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});
  /** Persona selecionada pelo usuário: empresa_RH ou colaborador. */
  const [personaSelected, setPersonaSelected] = useState<ChatPersona | null>(() => {
    try {
      const saved = sessionStorage.getItem(PERSONA_STORAGE_KEY);
      return saved === "empresa_RH" || saved === "colaborador" ? saved : null;
    } catch {
      return null;
    }
  });

  const feedRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (personaSelected) sessionStorage.setItem(PERSONA_STORAGE_KEY, personaSelected);
      else sessionStorage.removeItem(PERSONA_STORAGE_KEY);
    } catch {
      // O chat continua disponível quando o navegador bloqueia armazenamento.
    }
  }, [personaSelected]);

  useEffect(() => {
    if (isChatOpen && !isBusy) inputRef.current?.focus();
  }, [isChatOpen, isBusy]);

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
    if (isBusy) return;
    setMessages([INITIAL_MESSAGE]);
    setSuggestions([]);
    setShowHandoff(false);
    setFeedbackMap({});
    setPersonaSelected(null);
    setInputValue("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const handleFeedback = (message: ChatMessage, rating: "up" | "down") => {
    setFeedbackMap((prev) => ({ ...prev, [message.id]: rating }));
    if (rating === "down") {
      setHandoffText(handoffMessage(message.question || "Preciso de ajuda com a resposta do assistente.", message.persona ?? null));
      setShowHandoff(true);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const msg = textToSend.trim();
    if (!msg || isBusy || msg.length > 450) return;

    setSuggestions([]);
    setShowHandoff(false);

    // Add user message
    const userMsgId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", text: msg }]);
    setInputValue("");
    setIsBusy(true);

    // Add pending message
    const pendingId = "pending-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: pendingId, role: "bot", text: "", isPending: true },
    ]);

    const lastQuestion = messages.filter((m) => m.role === "user").at(-1)?.text;
    const question = /^(?:quero )?(?:falar (?:com (?:um |uma )?)?(?:humano|atendente)|atendimento humano|whatsapp)[.!?]?$/i.test(msg)
      ? lastQuestion || msg : msg;
    setHandoffText(handoffMessage(question, personaSelected));

    let botAnswer = "";
    let botSuggestions: string[] | undefined;
    let botHandoff = false;
    const localResult = searchLocalFaq(msg);
    if (localResult && ["faq_exact", "blocked", "greeting", "thanks", "farewell"].includes(localResult.path)) {
      botAnswer = localResult.answer;
      botSuggestions = localResult.suggestions;
      botHandoff = localResult.handoff;
    }

    // Try remote worker endpoint
    if (!botAnswer && endpoint) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        // shortcut: quatro mensagens de 250 caracteres; ampliar junto do limite de corpo do Worker.
        const history = messages.filter((m) => !m.isPending).slice(-4)
          .map((m) => ({ role: m.role, text: m.text.slice(0, 250) }));
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: msg, history }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data: unknown = await res.json();
          if (typeof data === "object" && data !== null
            && "answer" in data && typeof data.answer === "string" && data.answer.trim()
            && "handoff" in data && typeof data.handoff === "boolean") {
            botAnswer = data.answer;
            if ("suggestions" in data && Array.isArray(data.suggestions)) {
              botSuggestions = data.suggestions.filter((q: unknown): q is string => typeof q === "string" && q.length > 0 && q.length <= 450).slice(0, 6);
            }
            botHandoff = data.handoff;
          }
        }
      } catch (err) {
        console.warn("[Assistente JÁ] Remote call failed, using local search:", err);
      } finally {
        clearTimeout(timer);
      }
    }

    // Fallback to local search
    if (!botAnswer) {
      botAnswer = localResult?.answer || FAQ_FALLBACK;
      botSuggestions = localResult?.suggestions;
      botHandoff = localResult?.handoff ?? true;
    }

    // Update message feed
    setMessages((prev) =>
      prev
        .filter((m) => m.id !== pendingId)
        .concat({
          id: crypto.randomUUID(),
          role: "bot",
          text: botAnswer,
          question,
          persona: personaSelected,
        })
    );

    if (botSuggestions && botSuggestions.length > 0) {
      setSuggestions(botSuggestions);
    }
    setShowHandoff(botHandoff);

    setIsBusy(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const starterQuestions = STARTER_IDS[personaSelected ?? "geral"]
    .map((id) => findFaqItem(id)).filter((item) => item !== undefined);

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
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento humano pelo WhatsApp da JÁ Benefícios"
        title="Atendimento humano pelo WhatsApp"
      >
        <WhatsappIcon />
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
              disabled={isBusy}
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

        <div className="ja-chat-persona-select">
          <span className="ja-chat-persona-select-title">Como podemos ajudar?</span>
          <div className="ja-chat-persona-buttons" role="group" aria-label="Seu perfil de atendimento">
            {(["empresa_RH", "colaborador"] as const).map((persona) => (
              <button
                key={persona}
                type="button"
                className={`ja-chat-persona-btn ${personaSelected === persona ? "ja-chat-persona-btn--active" : ""}`}
                aria-pressed={personaSelected === persona}
                disabled={isBusy}
                onClick={() => {
                  setPersonaSelected(persona);
                  setSuggestions(faqItems.filter((item) => STARTER_IDS[persona].includes(item.id)).map((item) => item.pergunta));
                }}
              >
                {persona === "empresa_RH" ? "RH / Empresa" : "Colaborador"}
              </button>
            ))}
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
                    <span className="ja-chat-feedback-thanks">
                      {feedbackMap[m.id] === "up" ? "Que bom! Se precisar, é só perguntar." : "Vamos ajudar pelo atendimento abaixo."}
                    </span>
                  ) : (
                    <>
                      <span>Isso resolveu?</span>
                      <button
                        type="button"
                        className="ja-chat-feedback-btn"
                        title="Sim, resolveu"
                        aria-label="Sim, resolveu"
                        disabled={isBusy}
                        onClick={() => handleFeedback(m, "up")}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="ja-chat-feedback-btn"
                        title="Não resolveu, falar com humano"
                        aria-label="Não resolveu, falar com humano"
                        disabled={isBusy}
                        onClick={() => handleFeedback(m, "down")}
                      >
                        Falar com humano
                      </button>
                    </>
                  )}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* Quick starter question pills */}
          {messages.length === 1 && !isBusy && suggestions.length === 0 && (
            <div className="ja-chat-starters">
              <span className="ja-chat-starters-title">Dúvidas frequentes:</span>
              {starterQuestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="ja-chat-starter-btn"
                  onClick={() => handleSendMessage(item.pergunta)}
                >
                  <span>{item.pergunta}</span>
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
              href={whatsappLink(handoffText)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar pelo WhatsApp
            </a>
            {page === "home" && personaSelected !== "colaborador" && <button
              id="jaChatSales"
              type="button"
              onClick={handleScrollToForm}
            >
              Falar com comercial
            </button>}
          </div>
        )}

        <form id="jaChatForm" className="ja-chat-form" onSubmit={handleFormSubmit}>
          <label htmlFor="jaChatInput" className="sr-only">
            Sua pergunta ao Assistente JÁ
          </label>
          <input
            id="jaChatInput"
            ref={inputRef}
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
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22l-4-9-9-4Z" />
            </svg>
          </button>
        </form>

        <p className="ja-chat-note">
          Respostas automáticas da central de dúvidas. Não envie CPF, senhas ou dados de cartão.
        </p>
      </section>
    </>
  );
}
