import React from "react";

export const Suporte: React.FC = () => {
  return (
    <section className="section section--white" id="suporte">
      <div className="container">
        <div className="center">
          <h2>Experiência completa, do atendimento à gestão.</h2>
          <p className="lead">Atendimento humanizado para quem faz a empresa acontecer</p>
        </div>
        <div className="support-grid">
          <div className="support-card" data-animate>
            <img 
              className="support-img" 
              src="/colaborador.webp" 
              width="1774" 
              height="887" 
              loading="lazy" 
              decoding="async"
              alt="Arte do card: mulher sorrindo e exibindo o cartão JÁ Benefícios Visa, com a chamada “JÁ benefícios ideal para o colaborador”." 
            />
            <i className="support-ico fa-solid fa-comment-dots" aria-hidden="true"></i>
            <h3>Liberdade real para o colaborador</h3>
            <p>
              De alimentação a cultura, tudo o que o seu time precisa em um único cartão Visa, com autonomia para escolher onde e como usar.
            </p>
          </div>

          <div className="support-card" data-animate>
            <img 
              className="support-img" 
              src="/rh.webp" 
              width="1774" 
              height="887" 
              loading="lazy" 
              decoding="async"
              alt="Arte do card: banner da JÁ Benefícios “ideal para o RH”, com o cartão Visa sobre a mesa e a chamada “Mais praticidade, bem-estar e gestão para o seu time”." 
            />
            <i className="support-ico fa-solid fa-handshake" aria-hidden="true"></i>
            <h3>Mais controle para o RH. Menos complexidade na rotina.</h3>
            <p>Da implantação às recargas, com orientação para sua empresa.</p>

          </div>
        </div>
        <p className="center">
          <a href="#beneficiosForm" className="btn btn-solid">
            Quero JÁ! <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
};
