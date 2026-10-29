import React, { useState, useEffect } from "react";

interface HeaderProps {
  onNavigateHome?: () => void;
  isPrivacyPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, isPrivacyPage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#topo");

  useEffect(() => {
    if (isPrivacyPage) return;

    const sections = [
      { id: "topo", selector: "#topo" },
      { id: "ecossistema", selector: "#ecossistema" },
      { id: "faq", selector: "#faq" },
      { id: "beneficiosForm", selector: "#beneficiosForm" },
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          if (elementTop <= scrollPos) {
            setActiveSection(sections[i].selector);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPrivacyPage]);

  const toggleMenu = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const handleSectionNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu();

    if (isPrivacyPage && onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
      setTimeout(() => {
        if (href === "#topo") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
      return;
    }

    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#topo") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash) {
          window.history.pushState(null, "", window.location.pathname);
        }
      } else {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
          if (window.location.hash !== href) {
            window.history.pushState(null, "", href);
          }
        }
      }
    }
  };

  return (
    <header className="site-header" id="topo">
      <div className="container header-inner">
        <a 
          className="brand brand--header" 
          href="#topo" 
          aria-label="JÁ Benefícios"
          onClick={(e) => handleSectionNavigate(e, "#topo")}
        >
          <img 
            className="brand-logo" 
            src="/logo-ja-positivo.svg" 
            alt="JÁ Benefícios" 
            width="87" 
            height="39" 
            decoding="async" 
          />
        </a>

        {!isPrivacyPage && (
          <nav 
            className={`main-nav ${isOpen ? "open" : ""}`} 
            id="mainNav" 
            aria-label="Navegação principal"
          >
            <a 
              href="#topo" 
              className={activeSection === "#topo" ? "active" : ""}
              onClick={(e) => handleSectionNavigate(e, "#topo")}
            >
              Início
            </a>
            <a 
              href="#ecossistema" 
              className={activeSection === "#ecossistema" ? "active" : ""}
              onClick={(e) => handleSectionNavigate(e, "#ecossistema")}
            >
              Benefícios
            </a>
            <a 
              href="#faq" 
              className={activeSection === "#faq" ? "active" : ""}
              onClick={(e) => handleSectionNavigate(e, "#faq")}
            >
              Central de ajuda
            </a>
            <span className="nav-link-unavailable">
              Portal da Empresa <span className="nav-soon">em preparação</span>
            </span>
          </nav>
        )}

        <div className="header-actions">
          {!isPrivacyPage && (
            <a
              href="#faq"
              className="header-search-btn"
              aria-label="Buscar no site"
              title="Buscar benefícios, taxas e dúvidas"
              onClick={(e) => handleSectionNavigate(e, "#faq")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </a>
          )}
          <a
            href="#beneficiosForm"
            className="btn btn-solid btn-sm"
            onClick={(e) => handleSectionNavigate(e, "#beneficiosForm")}
          >
            <span className="btn-label-full">Quero JÁ!</span>
            <span className="btn-label-short">Quero JÁ!</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        {!isPrivacyPage && (
          <button 
            className={`nav-toggle ${isOpen ? "open" : ""}`} 
            id="navToggle" 
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"} 
            aria-expanded={isOpen} 
            aria-controls="mainNav"
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>
        )}
      </div>
    </header>
  );
};

