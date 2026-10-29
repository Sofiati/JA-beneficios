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

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "privacy">(() => {
    if (window.location.hash === "#privacidade") {
      return "privacy";
    }
    return "home";
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#privacidade") {
        setCurrentPage("privacy");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else if (currentPage === "privacy") {
        setCurrentPage("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentPage]);

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

  const openPrivacy = () => {
    setCurrentPage("privacy");
    window.location.hash = "privacidade";
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const navigateHome = () => {
    setCurrentPage("home");
    if (window.location.hash === "#privacidade") {
      window.location.hash = "";
    }
    window.scrollTo({ top: 0, behavior: "auto" });
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

      <FloatingActions />
    </>
  );
};

export default App;
