import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-banner" data-animate>
        <picture className="hero-picture">
          <source media="(max-width:767px)" type="image/webp" srcSet="/hero01-mobile.webp" />
          <source media="(max-width:767px)" type="image/png" srcSet="/hero01-mobile.png" />
          <source type="image/webp" srcSet="/hero01.webp" />
          <source type="image/png" srcSet="/hero01.png" />
          <img 
            className="hero-img" 
            src="/hero01.png" 
            width="1672" 
            height="941" 
            fetchPriority="high" 
            decoding="async"
            alt="Casal sorrindo e exibindo o cartão JÁ Benefícios Visa." 
          />
        </picture>
        <div className="hero-overlay">
          <div className="hero-copy">
            <h1>
              <span className="hero-line1">Todos os benefícios do seu time</span>
              <br />
              <span className="hero-line2">em um só cartão</span>
            </h1>
            <p>
              Mais liberdade para seus colaboradores, mais praticidade para o RH e condições comerciais que facilitam a gestão.
            </p>
            <div className="hero-cta-wrap">
              <a className="btn btn-yellow hero-cta" href="#beneficiosForm">
                Solicitar proposta <span aria-hidden="true">→</span>
              </a>
            </div>
            <ul className="hero-benefits" aria-label="Diferenciais do cartão JÁ">
              <li>
                <i className="fa-solid fa-contactless" aria-hidden="true"></i>
                <span>Pagamento por aproximação</span>
              </li>
              <li>
                <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
                <span>Mais segurança</span>
              </li>
              <li>
                <i className="fa-solid fa-credit-card" aria-hidden="true"></i>
                <span>Uso imediato ao receber o cartão</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
