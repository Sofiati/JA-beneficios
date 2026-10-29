import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-banner" data-animate>
        <picture>
          <source media="(max-width:767px)" srcSet="/hero01-mobile.webp" width="816" height="941" />
          <img 
            className="hero-img" 
            src="/hero01.webp" 
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
              <span className="hl">Todos os<br /> benefícios</span><br /> do seu time em<br /> um só cartão.
            </h1>
            <p>
              Mais autonomia para os colaboradores usarem seus benefícios. Mais praticidade no dia a dia do RH. Menos taxas para as empresas.
            </p>
            <a className="btn btn-yellow hero-cta" href="#beneficiosForm">
              Quero JÁ! <span aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="hero-benefits">
            <li>
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <span>Pagamento por aproximação</span>
            </li>
            <li>
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>Mais segurança</span>
            </li>
            <li>
              <span className="hero-ico" aria-hidden="true">
                <i className="fa-solid fa-credit-card hero-ico__main"></i>
                <i className="fa-solid fa-utensils hero-ico__mini hero-ico__mini--a"></i>
                <i className="fa-solid fa-heart-pulse hero-ico__mini hero-ico__mini--b"></i>
                <i className="fa-solid fa-graduation-cap hero-ico__mini hero-ico__mini--c"></i>
              </span>
              <span>Vários benefícios em um só cartão</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
