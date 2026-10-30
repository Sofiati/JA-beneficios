import React from "react";

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onNavigateHome }) => {
  return (
    <footer className="site-footer" id="siteFooter">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#topo" aria-label="JÁ Benefícios" onClick={onNavigateHome}>
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
          <h3>Institucional</h3>
          <a href="#topo" onClick={onNavigateHome}>Início</a>
          <a href="#ecossistema" onClick={onNavigateHome}>Benefícios</a>
        </nav>

        <nav aria-label="Soluções">
          <h3>Soluções</h3>
          <a href="#custo-zero" onClick={onNavigateHome}>Para empresas</a>
          <a href="#suporte" onClick={onNavigateHome}>Para colaboradores</a>
          <a href="#app" onClick={onNavigateHome}>Aplicativo</a>
        </nav>

        <nav aria-label="Atendimento">
          <h3>Atendimento</h3>
          <a href="#faq" onClick={onNavigateHome}>Central de ajuda</a>
          <div className="footer-social">
            <a
              href="https://wa.me/5511910993348?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20J%C3%81%20Benef%C3%ADcios."
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Conversar pelo WhatsApp</span>
            </a>
          </div>
        </nav>
      </div>

      <section className="container footer-downloads" aria-labelledby="footerAppTitle">
        <div className="footer-downloads-copy">
          <h3 id="footerAppTitle">Leve seus benefícios com você</h3>
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
        <h3>Dados da empresa</h3>
        <div className="footer-legal-details">
          <p className="footer-legal-name">Já Benefícios e Pagamentos Ltda.</p>
          <p>CNPJ 52.316.137/0001-53</p>
          <p>PAT FA000031</p>
        </div>
        <address>Rua Barão de Teffé, 160, Sala 403, Condomínio Helbor Office · Jundiaí/SP · CEP 13208-761</address>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 JÁ Benefícios. Todos os direitos reservados.</span>
        <nav className="footer-links" aria-label="Links legais">
          <a href="#privacidade" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>Privacidade</a>
          <a href="https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" target="_blank" rel="noopener noreferrer">Código de Defesa do Consumidor</a>
          <a href="https://www.procon.sp.gov.br/" target="_blank" rel="noopener noreferrer">Procon-SP</a>
        </nav>
      </div>
    </footer>
  );
};
