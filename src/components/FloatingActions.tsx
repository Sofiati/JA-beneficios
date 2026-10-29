import React, { useState, useEffect, useRef } from "react";
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

export const FloatingActions: React.FC = () => {
  const [showToTop, setShowToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "bot",
      text: "Olá! Posso esclarecer dúvidas sobre benefícios, implantação, cartão e atendimento JÁ. Como posso ajudar?",
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [handoffText, setHandoffText] = useState("Olá! Gostaria de falar com a equipe JÁ Benefícios.");
  const [endpoint, setEndpoint] = useState("");
  const [faqData, setFaqData] = useState<FaqItem[]>([]);

  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 320);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    // Fetch local FAQ data for client-side fallback
    fetch("/faq.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: FaqItem[] | null) => {
        if (Array.isArray(data)) setFaqData(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, suggestions, showHandoff]);

  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  // Client-side local search fallback engine
  const searchLocalFaq = (query: string): { answer: string; suggestions?: string[]; handoff?: boolean } => {
    const norm = normalizeText(query).replace(/[^a-z0-9\s]/g, " ").trim();

    // Conversational greetings
    if (/^(oi|ola|opa|e ai|bom dia|boa tarde|boa noite)( (tudo bem|tudo bom|pessoal|equipe|assistente))?$/.test(norm)) {
      return {
        answer: "Olá! 👋 Sou o Assistente JÁ. Posso ajudar com dúvidas sobre benefícios, cartões, taxas e contratação. O que você gostaria de saber?",
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

    // Direct exact or substring match in FAQ questions
    const exactQuestionMatch = faqData.find(
      (item) => normalizeText(item.pergunta) === norm
    );
    if (exactQuestionMatch) {
      return { answer: exactQuestionMatch.resposta };
    }

    // Score FAQ items based on token matches in question (weight 3) and answer (weight 1)
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
          // Check substring matching for Portuguese variations
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

    if (!topMatches.length || topMatches[0].score < 1) {
      return {
        answer: "Não encontrei uma informação oficial suficiente para responder com segurança. Você pode falar com nossa equipe pelo WhatsApp ou solicitar contato comercial pelo formulário.",
        handoff: true,
      };
    }

    // If query is a single generic word (like "cartao", "beneficios", "taxas", "app") or multiple close options exist
    if (queryTokens.length === 1 || (topMatches.length > 1 && topMatches[0].score - topMatches[1].score < 3)) {
      const closeMatches = topMatches.slice(0, 5).map((m) => m.item.pergunta);
      return {
        answer: `Encontrei os seguintes assuntos sobre "${query}" na central de dúvidas:`,
        suggestions: closeMatches,
      };
    }

    // Single clear top match
    return { answer: topMatches[0].item.resposta };
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
      { id: pendingId, role: "bot", text: "Consultando informações…", isPending: true },
    ]);

    const formattedHandoff = `Olá! Preciso de ajuda sobre JÁ Benefícios: ${msg.slice(0, 130)}`;
    setHandoffText(formattedHandoff);

    let botAnswer = "";
    let botSuggestions: string[] | undefined;
    let botHandoff = false;

    // First try remote worker endpoint
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
        console.warn("[Assistente JÁ] Worker call failed or CORS origin blocked, using local FAQ search:", err);
      }
    }

    // If remote endpoint failed or returned empty answer, use local search fallback
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
        aria-label="Falar com a JÁ Benefícios no WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <button
        type="button"
        id="jaChatToggle"
        className="ja-chat-launch"
        aria-expanded={isChatOpen}
        aria-controls="jaChatPanel"
        aria-label={isChatOpen ? "Fechar Assistente JÁ" : "Abrir Assistente JÁ"}
        title="Assistente JÁ"
        onClick={() => setIsChatOpen((prev) => !prev)}
      >
        ✦
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

        <div
          id="jaChatMessages"
          className="ja-chat-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
          ref={feedRef}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`ja-chat-bubble ja-chat-${m.role} ${m.isPending ? "ja-chat-pending" : ""}`}
            >
              {m.text}
            </div>
          ))}

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
            <a
              id="jaChatSales"
              href="#beneficiosForm"
              onClick={() => setIsChatOpen(false)}
            >
              Solicitar contato comercial
            </a>
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
          Respostas automáticas da central de dúvidas podem não cobrir todos os casos. Não envie CPF, senhas ou dados de cartão.
        </p>
      </section>
    </>
  );
};
