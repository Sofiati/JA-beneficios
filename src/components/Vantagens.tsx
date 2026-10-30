import React from "react";

export const Vantagens: React.FC = () => {
  return (
    <section className="section section--white" id="vantagens">
      <div className="container">
        <div className="feature">
          <div className="feature-art feature-art--media" data-animate>
            <img 
              className="accept-img" 
              src="/aceito.webp" 
              width="1254" 
              height="1254" 
              loading="lazy" 
              decoding="async"
              alt="Mulher sorrindo pagando com o cartão JÁ Benefícios Visa no mercado." 
            />
          </div>
          <div className="feature-copy accept-copy" data-animate>
            <h2 className="accept-title">
              Onde aceita <span className="visa-marca">VISA</span>, aceita JÁ Benefícios
            </h2>
            <p>
              Uso imediato liberado no momento do recebimento do cartão — do almoço ao mercado, sem burocracia para começar. Compras com o cartão físico, gestão de saldo pelo app.
            </p>
            <div className="accept-block">
              <h3>Liberdade para o time, tranquilidade para o RH</h3>
              <p>
                Milhões de estabelecimentos, no bairro ou no delivery, sem convênio nem maquininha especial — liberdade de escolha para o colaborador e gestão simples para a empresa.
              </p>
              <p>
                E o RH gerencia tudo em portal próprio — planilhas, financeiro e múltiplos CNPJs.
              </p>
            </div>
            <ul className="accept-methods">
              <li>
                <span className="accept-icon" aria-hidden="true">
                  <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                    <rect x="8" y="24" width="70" height="48" rx="6" />
                    <path d="M8 39h70m17-4q8 10 0 20m8-27q14 17 0 34m8-42q21 25 0 50" />
                  </svg>
                </span>
                <span>Cartão<br />físico</span>
              </li>
              <li>
                <span className="accept-icon" aria-hidden="true">
                  <svg viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                    <rect x="37" y="5" width="46" height="80" rx="7" />
                    <path d="M52 12h16m-12 65h8" />
                    <path d="m48 44 9 9 16-19" />
                  </svg>
                </span>
                <span>Pelo<br />app</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="feature" id="app">
          <div className="feature-art feature-art--app" data-animate>
            <div className="device">
              <span className="device-screen">
                <img 
                  className="app-shot" 
                  src="/appJA.webp" 
                  width="941" 
                  height="1672" 
                  loading="lazy" 
                  decoding="async"
                  alt="Tela do app JÁ Benefícios: cartão Visa, saldos de alimentação e mobilidade e atalhos de extrato, bloqueio e cartão virtual." 
                />
              </span>
            </div>
          </div>
          <div className="feature-copy" data-animate>
            <h2>Seus benefícios na palma da mão</h2>
            <p>
              Através do app, o colaborador consulta saldos, acompanha extratos, gerencia seus cartões e acessa outras funcionalidades em um só lugar.
            </p>
            <ul className="app-list">
              <li>Saldos por categoria</li>
              <li>Extratos e movimentações</li>
              <li>Gestão do cartão físico e virtual</li>
            </ul>
            <a className="btn btn-solid app-cta" href="#beneficiosForm">
              Quero JÁ! <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
