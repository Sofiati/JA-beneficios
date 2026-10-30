import React from "react";

export const CtaFinal: React.FC = () => {
  const scrollToForm = () => {
    const form = document.getElementById("beneficiosForm");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="section section-cta" id="cta-final" aria-labelledby="ctaFinalTitle">
      <div className="container center" data-animate>
        <h2 className="light" id="ctaFinalTitle">
          Simplifique a gestão.
          <br />
          Amplie as possibilidades do seu time.
        </h2>
        <p className="cta-final-description">
          Descubra como o JÁ Benefícios pode transformar a experiência dos seus colaboradores com mais liberdade e praticidade para sua empresa.
        </p>
        <button
          type="button"
          className="btn btn-yellow cta-final-button"
          onClick={scrollToForm}
        >
          Quero conhecer o JÁ Benefícios <span aria-hidden="true">→</span>
        </button>
        <p className="cta-final-note">Atendimento personalizado, sem compromisso.</p>
      </div>
    </section>
  );
};
