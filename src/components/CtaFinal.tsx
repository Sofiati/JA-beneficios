import React from "react";

export const CtaFinal: React.FC = () => {
  return (
    <section className="section section-cta" id="cta-final" aria-labelledby="ctaFinalTitle">
      <div className="container center" data-animate>
        <h2 className="light" id="ctaFinalTitle">Pronto para simplificar os benefícios da sua empresa?</h2>
        <p className="cta-final-description">Conheça as condições para sua empresa e converse com nossa equipe comercial.</p>
        <a href="#beneficiosForm" className="btn btn-yellow cta-final-button">
          Quero falar com a JÁ <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
};
