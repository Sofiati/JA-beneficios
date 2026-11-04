import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Proof } from "./components/Proof";
import { Ecossistema } from "./components/Ecossistema";
import { Vantagens } from "./components/Vantagens";
import { CustoZero } from "./components/CustoZero";
import { Suporte } from "./components/Suporte";
import { FaqSection } from "./components/FaqSection";
import { CtaFinal } from "./components/CtaFinal";
import { Footer } from "./components/Footer";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { FloatingActions } from "./components/FloatingActions";
import { useSEO } from "./hooks/useSEO";

type Page = "home" | "privacy";

const SITE_URL = "https://jadigital.com.br";
/** URL própria da política — o HTML estático dessa rota é gerado no build. */
const PRIVACY_PATH = "/privacidade";

/** Endereço antigo (`/#privacidade`), mantido só para não quebrar links já divulgados. */
const LEGACY_PRIVACY_HASH = "#privacidade";

interface PageSeo {
  title: string;
  description: string;
  canonicalUrl: string;
}

const SEO: Record<Page, PageSeo> = {
  home: {
    title: "JÁ Benefícios – Todos os benefícios do seu time em um só cartão",
    description:
      "Mais autonomia para colaboradores e praticidade para o RH. Centralize refeição, alimentação, mobilidade e saúde no cartão JÁ Benefícios.",
    canonicalUrl: `${SITE_URL}/`,
  },
  privacy: {
    title: "Política de Privacidade – JÁ Benefícios",
    description:
      "Saiba como a JÁ Benefícios coleta, utiliza, armazena e protege seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
    canonicalUrl: `${SITE_URL}${PRIVACY_PATH}`,
  },
};

const pageFromPath = (pathname: string): Page =>
  pathname === PRIVACY_PATH || pathname === `${PRIVACY_PATH}/` ? "privacy" : "home";

const scrollToSection = (target?: string): void => {
  if (!target || target === "topo") {
    window.scrollTo({ top: 0 });
    return;
  }
  document.getElementById(target)?.scrollIntoView({ block: "start" });
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Link antigo com hash: troca para a URL canônica antes de renderizar.
    if (window.location.hash === LEGACY_PRIVACY_HASH) {
      window.history.replaceState(null, "", PRIVACY_PATH);
      return "privacy";
    }
    return pageFromPath(window.location.pathname);
  });

  // Dynamic SEO metadata based on current active view
  useSEO(SEO[currentPage]);

  // Botão voltar/avançar do navegador.
  useEffect(() => {
    const handlePopState = (): void => {
      setCurrentPage(pageFromPath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Scroll animations observer (same as [data-animate] in vanilla JS)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const animatedEls = document.querySelectorAll("[data-animate]");
    animatedEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage]);

  const openPrivacy = (): void => {
    window.history.pushState(null, "", PRIVACY_PATH);
    setCurrentPage("privacy");
    window.scrollTo({ top: 0 });
  };

  /** Volta para a home (ou para uma de suas seções, por id) sem hash de página. */
  const navigateHome = (target?: string): void => {
    if (currentPage === "privacy") {
      window.history.pushState(null, "", target ? `/#${target}` : "/");
      setCurrentPage("home");
      // Espera a home montar antes de rolar até a seção.
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(target)));
      return;
    }

    window.history.pushState(null, "", target ? `#${target}` : window.location.pathname);
    scrollToSection(target);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>

      <Header 
        isPrivacyPage={currentPage === "privacy"} 
        onNavigateHome={navigateHome} 
      />

      {currentPage === "home" ? (
        <main id="main" tabIndex={-1}>
          <Hero />
          <Proof />
          <Ecossistema />
          <Vantagens />
          <CustoZero onOpenPrivacy={openPrivacy} />
          <Suporte />
          <FaqSection />
          <CtaFinal />
        </main>
      ) : (
        <PrivacyPolicy onBack={navigateHome} />
      )}

      <Footer 
        onOpenPrivacy={openPrivacy} 
        onNavigateHome={navigateHome} 
      />

      <FloatingActions page={currentPage} />
    </>
  );
};

export default App;
