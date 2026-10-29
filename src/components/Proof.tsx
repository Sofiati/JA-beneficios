import React from "react";

export const Proof: React.FC = () => {
  return (
    <section className="proof" aria-label="Diferenciais da JÁ Benefícios">
      <div className="container proof-row" data-animate>
        <div className="proof-item">
          <strong>16 categorias</strong>
          <span>em um único cartão Visa</span>
        </div>
        <div className="proof-item">
          <strong>R$ 0,00</strong>
          <span>em tarifas de gestão</span>
        </div>
        <div className="proof-item">
          <strong>PAT FA000031</strong>
          <span>conformidade com a Lei 14.442/2022</span>
        </div>
        <div className="proof-item">
          <strong>Portal + app</strong>
          <span>RH no portal, saldo no celular</span>
        </div>
      </div>
    </section>
  );
};
