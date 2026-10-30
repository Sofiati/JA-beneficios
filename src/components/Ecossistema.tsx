import React from "react";

export const Ecossistema: React.FC = () => {
  return (
    <section className="section section--white" id="ecossistema">
      <div className="container narrow center">
        <p className="eyebrow">PLATAFORMA DE BENEFÍCIOS FLEXÍVEIS</p>
        <h2>O controle que a sua empresa precisa. A flexibilidade que o seu colaborador quer.</h2>
        <p className="lead">
          A empresa escolhe os benefícios, o colaborador escolhe como usá-los. Portal simples de operar, app leve e atendimento de verdade, do início ao fim.
        </p>
      </div>
      <div className="container">
        <div className="categorias-layout" data-animate>
          <div className="categorias-copy">
            <h3>Do essencial ao bem-estar, tudo centralizado em um só cartão <span className="visa-marca">VISA</span></h3>
            <p className="lead">
              Descubra como integrar benefícios múltiplos em uma experiência única, segura e sem burocracia.
            </p>
            <a href="#beneficiosForm" className="btn btn-solid">
              Quero JÁ! <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="categorias-stage">
            <img 
              src="/mockup-cartao-clean.webp" 
              alt="Cartão JÁ Benefícios Visa preto em pé sob luz de estúdio" 
              width="1086" 
              height="1448" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="categorias-index">
            <div className="cat-group">
              <div className="cat-group-head">
                <h4 className="cat-group-title">Trilho Voucher <span className="cat-tag">PAT</span></h4>
                <p className="cat-group-desc">Mais segurança, simplicidade e eficiência, mantenha o padrão</p>
              </div>
              <div className="cat-grid">
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-cart-shopping"></i></div>
                  <h5>Alimentação</h5>
                  <p>Apoio às compras de alimentos para o dia a dia do colaborador e da família.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-utensils"></i></div>
                  <h5>Refeição</h5>
                  <p>Refeições prontas para a rotina de trabalho, com praticidade na hora de se alimentar.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-theater-masks"></i></div>
                  <h5>Cultura</h5>
                  <p>Cinema, teatro, shows, museus, livrarias e eventos — lazer e desenvolvimento pessoal para o colaborador.</p>
                </article>
              </div>
            </div>

            <div className="cat-group">
              <div className="cat-group-head">
                <h4 className="cat-group-title">Multibeneficios</h4>
                <p className="cat-group-desc">saúde, educação, deslocamento, premiação e muito mais!</p>
              </div>
              <div className="cat-grid">
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-utensils"></i></div>
                  <h5>Alimentação e Refeição</h5>
                  <p>As duas modalidades em uma única solução, com liberdade para usar em cada categoria, conforme as regras aplicáveis.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-hospital"></i></div>
                  <h5>Saúde</h5>
                  <p>Farmácias, consultas, exames e outros serviços habilitados.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-graduation-cap"></i></div>
                  <h5>Educação</h5>
                  <p>Incentivo ao aprendizado contínuo e ao desenvolvimento profissional e pessoal.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-car"></i></div>
                  <h5>Mobilidade</h5>
                  <p>Transporte urbano, aplicativos de mobilidade e outras soluções de locomoção, conforme a rede habilitada.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-gas-pump"></i></div>
                  <h5>Combustível</h5>
                  <p>Abastecimento em postos habilitados, apoiando os deslocamentos dos profissionais, conforme as condições de utilização.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-laptop"></i></div>
                  <h5>Trabalho Remoto</h5>
                  <p>Apoio às despesas do home office — internet, energia e recursos necessários ao trabalho à distância.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-trophy"></i></div>
                  <h5>Premiação</h5>
                  <p>Reconheça resultados, metas alcançadas e desempenho de destaque, reforçando a cultura de reconhecimento.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-hands-holding-circle"></i></div>
                  <h5>Incentivo</h5>
                  <p>Campanhas de engajamento, desafios corporativos e ações de motivação para o comprometimento do time.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-calendar-check"></i></div>
                  <h5>Assiduidade</h5>
                  <p>Reconhecimento da presença e pontualidade conforme os critérios de frequência estabelecidos pela empresa.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-birthday-cake"></i></div>
                  <h5>Aniversário</h5>
                  <p>Um benefício comemorativo para celebrar o aniversário dos colaboradores e fortalecer o pertencimento.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-snowflake"></i></div>
                  <h5>Natal</h5>
                  <p>Presente de fim de ano que pode substituir ou complementar a cesta natalina, com liberdade de escolha.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-layer-group"></i></div>
                  <h5>Multiuso <span className="cat-tag">uso livre</span></h5>
                  <p>Diferentes possibilidades em uma única solução, com regras e categorias definidas pela política da empresa.</p>
                </article>
                <article className="cat-card">
                  <div className="cat-card-ico-wrap"><i className="cat-card-ico fa-solid fa-wallet"></i></div>
                  <h5>Saldo Livre <span className="cat-tag">uso livre</span></h5>
                  <p>Valores com utilização mais flexível, conforme as condições do produto e a rede de aceitação.</p>
                </article>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
