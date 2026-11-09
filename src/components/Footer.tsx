import React from "react";
import { WhatsappIcon, whatsappLink } from "./whatsapp";

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigateHome: (target?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onNavigateHome }) => {
  const goToSection = (target: string) => (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    onNavigateHome(target);
  };

  return (
    <footer className="site-footer" id="siteFooter">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#topo" aria-label="JÁ Benefícios" onClick={goToSection("topo")}>
            <img 
              className="brand-logo brand-logo--footer" 
              src="/logo-ja-negativo.svg" 
              alt="JÁ Benefícios" 
              width="132" 
              height="59" 
              loading="lazy"
              decoding="async" 
            />
          </a>
          <p className="footer-tagline">
            Mais liberdade para quem usa.
            <br />
            Mais praticidade para quem gerencia.
          </p>
          <p className="footer-description">Uma solução de benefícios pensada para empresas e colaboradores.</p>
        </div>

        <nav aria-label="Institucional">
          <h2>Institucional</h2>
          <a href="#topo" onClick={goToSection("topo")}>Início</a>
          <a href="#ecossistema" onClick={goToSection("ecossistema")}>Benefícios</a>
        </nav>

        <nav aria-label="Soluções">
          <h2>Soluções</h2>
          <a href="#custo-zero" onClick={goToSection("custo-zero")}>Empresas</a>
          <a href="#suporte" onClick={goToSection("suporte")}>Colaboradores</a>
          <a href="#app" onClick={goToSection("app")}>Aplicativo</a>
        </nav>

        <nav aria-label="Atendimento">
          <h2>Atendimento</h2>
          <a href="#faq" onClick={goToSection("faq")}>Central de ajuda</a>
          <div className="footer-social">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappIcon />
              <span>Conversar pelo WhatsApp</span>
            </a>
          </div>
        </nav>
      </div>

      <section className="container footer-downloads" aria-labelledby="footerAppTitle">
        <div className="footer-downloads-copy">
          <h2 id="footerAppTitle">Leve seus benefícios com você</h2>
          <p>Acesse o aplicativo Já Digital.</p>
        </div>
        <div className="footer-store-links">
          <a href="https://apps.apple.com/br/app/ja-digital/id6497330228" target="_blank" rel="noopener noreferrer">
            <img src="/app-store-pt-br.svg" alt="Baixar o Já Digital na App Store" width="168" height="56" loading="lazy" decoding="async" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=br.com.jadigital&hl=pt_BR" target="_blank" rel="noopener noreferrer">
            <img src="/google-play-pt-br.png" alt="Baixar o Já Digital no Google Play" width="168" height="65" loading="lazy" decoding="async" />
          </a>
        </div>
      </section>

      <div className="container footer-legal-strip">
        <h2>Dados da empresa</h2>
        <div className="footer-legal-details">
          <p className="footer-legal-name">Já Benefícios e Pagamentos Ltda.</p>
          <p>CNPJ 52.316.137/0001-53</p>
          <p>PAT FA000031</p>
        </div>
        <address>Rua Barão de Teffé, 160, Sala 403, Condomínio Helbor Office, Jundiaí/SP, CEP 13208-761</address>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 JÁ Benefícios. Todos os direitos reservados.</span>
        <nav className="footer-links" aria-label="Links legais">
          <a href="/privacidade" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>Privacidade</a>
          <a href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" target="_blank" rel="noopener noreferrer">Código de Defesa do Consumidor</a>
          <a href="https://www.procon.sp.gov.br/" target="_blank" rel="noopener noreferrer">Procon-SP</a>
        </nav>
      </div>
    </footer>
  );
};
