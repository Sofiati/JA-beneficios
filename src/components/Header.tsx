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
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].selector);
          break;
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

  const handleLinkClick = (href: string) => {
    closeMenu();
    if (isPrivacyPage && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <header className="site-header" id="topo">
      <div className="container header-inner">
        <a 
          className="brand brand--header" 
          href="#topo" 
          aria-label="JÁ Benefícios"
          onClick={(e) => {
            if (isPrivacyPage && onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
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
              onClick={() => handleLinkClick("#topo")}
            >
              Início
            </a>
            <a 
              href="#ecossistema" 
              className={activeSection === "#ecossistema" ? "active" : ""}
              onClick={() => handleLinkClick("#ecossistema")}
            >
              Benefícios
            </a>
            <a 
              href="#faq" 
              className={activeSection === "#faq" ? "active" : ""}
              onClick={() => handleLinkClick("#faq")}
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
              onClick={() => {
                closeMenu();
                if (isPrivacyPage && onNavigateHome) onNavigateHome();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </a>
          )}
          <a href="#beneficiosForm" className="btn btn-solid btn-sm" onClick={closeMenu}>
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
