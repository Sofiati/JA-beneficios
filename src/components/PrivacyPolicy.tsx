import React from "react";

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <main id="main" tabIndex={-1}>
      <section className="section">
        <div className="container narrow">
          <div className="iub_content legal_pp">
            <div className="iub_header">
              <a 
                className="link-arrow" 
                href="#topo" 
                onClick={(e) => { e.preventDefault(); onBack(); }}
              >
                ← Voltar para o início
              </a>
              <h1>Política de Privacidade do serviço <strong>jadigital.com.br</strong></h1>
              <p>
                Para receber informações sobre os seus dados pessoais, os propósitos e as partes de informação que são compartilhadas, entre em contato com o Proprietário.
              </p>
            </div>

            <details className="pp-sec" open>
              <summary>Proprietário e Controlador de Dados</summary>
              <div className="pp-body">
                <p><strong>Proprietário e Controlador de Dados:</strong> Já Digital Instituição de Pagamento S.A</p>
                <p>
                  Para mais informações sobre o controlador, entre em contato com o seguinte endereço de e-mail:{" "}
                  <a href="mailto:privacidade@jadigital.com.br">privacidade@jadigital.com.br</a>
                </p>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Tipos de Dados coletados</summary>
              <div className="pp-body">
                <p>Uso de Dados e outros dados coletados</p>
                <p>
                  Detalhes completos sobre cada tipo de Dados Pessoais coletados são fornecidos nas seções dedicadas desta política de privacidade ou por textos explicativos específicos exibidos antes da coleta de Dados.<br />
                  Os Dados Pessoais poderão ser fornecidos livremente pelo Usuário, ou, no caso dos Dados de Utilização, coletados automaticamente ao se utilizar este Aplicativo.<br />
                  A menos que especificado diferentemente todos os Dados solicitados por este Aplicativo são obrigatórios e a falta de fornecimento destes Dados poderá impossibilitar este Aplicativo de fornecer os seus Serviços. Nos casos em que este Aplicativo afirmar especificamente que alguns Dados não forem obrigatórios, os Usuários ficam livres para deixarem de comunicar estes Dados sem nenhuma consequência para a disponibilidade ou o funcionamento do Serviço.<br />
                  Os Usuários que tiverem dúvidas a respeito de quais Dados Pessoais são obrigatórios estão convidados a entrar em contato com o Proprietário.<br />
                  Quaisquer usos de cookies – ou de outras ferramentas de rastreamento – por este Aplicativo ou pelos proprietários de serviços terceiros utilizados por este Aplicativo serão para a finalidade de fornecer os Serviços solicitados pelo Usuário, além das demais finalidades descritas no presente documento e na Política de Cookies.
                </p>
                <p>Os Usuários ficam responsáveis por quaisquer Dados Pessoais de terceiros que forem obtidos, publicados ou compartilhados através deste Serviço (este Aplicativo).</p>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Modo e local de processamento dos Dados</summary>
              <div className="pp-body">
                <h3>Método de processamento</h3>
                <p>
                  O Proprietário tomará as medidas de segurança adequadas para impedir o acesso não autorizado, divulgação, alteração ou destruição não autorizada dos Dados.<br />
                  O processamento dos Dados é realizado utilizando computadores e /ou ferramentas de TI habilitadas, seguindo procedimentos organizacionais e meios estritamente relacionados com os fins indicados. Além do Proprietário, em alguns casos, os Dados podem ser acessados por certos tipos de pessoas encarregadas, envolvidas com a operação deste Serviço (este Aplicativo) (administração, vendas, marketing, administração legal do sistema) ou pessoas externas (como fornecedores terceirizados de serviços técnicos, carteiros, provedores de hospedagem, empresas de TI, agências de comunicação) nomeadas, quando necessário, como Processadores de Dados por parte do Proprietário. A lista atualizada destas partes pode ser solicitada ao Proprietário a qualquer momento.
                </p>

                <h3>Lugar</h3>
                <p>
                  Os dados são processados nas sedes de operação dos Proprietários, e em quaisquer outros lugares onde as partes envolvidas com o processamento estiverem localizadas.<br />
                  Dependendo da localização do Usuário as transferências de dados poderão envolver a transferência dos Dados do Usuário para outro país que não seja o seu. Para descobrirem mais sobre o local de processamento de tais Dados transferidos os Usuários poderão verificar a seção contendo os detalhes sobre o processamento de Dados Pessoais.
                </p>

                <h3>Período de conservação</h3>
                <p>
                  Salvo especificação em contrário neste documento, os Dados Pessoais serão tratados e armazenados pelo tempo necessário para as finalidades para as quais foram coletados, e poderão ser retidos por mais tempo em razão de qualquer obrigação legal aplicável ou com base no consentimento dos Usuários.
                </p>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Política de Cookies</summary>
              <div className="pp-body">
                <p>Política de Cookies do jadigital.com.br</p>
                <p>
                  Este documento informa os Usuários sobre as tecnologias que ajudam este Aplicativo a alcançar as finalidades descritas abaixo. Tais tecnologias permitem ao Proprietário acessar e armazenar informações (por exemplo, usando um Cookie) ou usar recursos (por exemplo, executando um script) em um dispositivo de um Usuário à medida que interagem com este Aplicativo.
                </p>
                <p>
                  Para fins de simplicidade, todas estas tecnologias são definidas como "Rastreadores" neste documento – a menos que haja um motivo para diferenciá-las. Por exemplo, enquanto Cookies podem ser usados em navegadores de web e dispositivos móveis, seria incorreto falar sobre Cookies no contexto de aplicativos móveis, pois eles são um rastreador baseado em um navegador. Por este motivo, neste documento, o termo Cookies somente é usado onde ele especificamente indicar aquele tipo específico de Rastreador.
                </p>
                <p>
                  Algumas das finalidades para as quais Rastreadores são usados também podem exigir a permissão do Usuário. Sempre que a permissão for dada, ela pode be livremente retirada a qualquer momento, seguindo as instruções fornecidas neste documento.
                </p>
                <p>
                  Este Aplicativo usa apenas Rastreadores gerenciados diretamente pelo Proprietário (conhecidos como Rastreadores "próprios"). Os períodos de validade e expiração dos Cookies próprios e outros Rastreadores similares poderão variar, dependendo do prazo estabelecido pelo Proprietário. Alguns deles expiram quando do término da sessão de navegação do Usuário.
                </p>
                <h3>Como este Aplicativo usa Rastreadores</h3>
                <h4>Necessários</h4>
                <p>
                  Este Aplicativo usa Cookies conhecidos como Cookies "técnicos" e outros Rastreadores similares para executar atividades que são estritamente necessárias para operar ou prestar o Serviço.
                </p>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Informações adicionais para usuários</summary>
              <div className="pp-body">
                <h3>Base jurídica para o processamento</h3>
                <p>O Proprietário poderá processar os Dados Pessoais relacionados ao Usuário se uma das hipóteses a seguir se aplicar:</p>
                <ul>
                  <li>os Usuários tenham dado a sua anuência para uma ou mais finalidades específicas.</li>
                  <li>o fornecimento dos Dados for necessário para o cumprimento de um contrato com o Usuário e/ou quaisquer obrigações pré-contratuais do mesmo;</li>
                  <li>o processamento for necessário para o cumprimento de uma obrigação jurídica à qual o Proprietário estiver sujeito;</li>
                  <li>o processamento estiver relacionado a uma tarefa que for executada no interesse público ou no exercício de uma autorização oficial na qual o Proprietário estiver investido;</li>
                  <li>o processamento for necessário para a finalidade de interesses legítimos perseguidos pelo Proprietário ou por um terceiro;</li>
                </ul>

                <h3>Mais informações sobre o tempo de retenção</h3>
                <p>
                  Salvo especificação em contrário neste documento, os Dados Pessoais serão tratados e armazenados pelo tempo necessário para as finalidades para as quais foram coletados, e poderão ser retidos por mais tempo em razão de qualquer obrigação legal aplicável ou com base no consentimento dos Usuários.
                </p>

                <h3>Os direitos dos Usuários com base no Regulamento Geral de Proteção de Dados (GDPR)</h3>
                <p>Os Usuários poderão exercer determinados direitos a respeito dos seus Dados processados pelo Proprietário.</p>
                <ul>
                  <li><strong>Retirar a sua anuência a qualquer momento.</strong></li>
                  <li><strong>Objetar o processamento dos seus Dados.</strong></li>
                  <li><strong>Acessar os seus Dados.</strong></li>
                  <li><strong>Verificar e pedir retificação.</strong></li>
                  <li><strong>Restringir o processamento dos seus Dados.</strong></li>
                  <li><strong>Ter os seus Dados Pessoais apagados ou retirados de outra maneira.</strong></li>
                  <li><strong>Receber os seus Dados e ter os mesmos transferidos para outro controlador.</strong></li>
                  <li><strong>Registrar uma reclamação.</strong></li>
                </ul>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Informações adicionais sobre a coleta e processamento de Dados</summary>
              <div className="pp-body">
                <h3>Ação jurídica</h3>
                <p>
                  Os Dados Pessoais dos Usuários podem ser utilizados para fins jurídicos pelo Proprietário em juízo ou nas etapas conducentes à possível ação jurídica decorrente de uso indevido deste Serviço (este Aplicativo) ou dos Serviços relacionados.
                </p>
                <h3>Informações adicionais sobre os Dados Pessoais do Usuário</h3>
                <p>
                  Além das informações contidas nesta política de privacidade, este Aplicativo poderá fornecer ao Usuário informações adicionais e contextuais sobre os serviços específicos ou a coleta e processamento de Dados Pessoais mediante solicitação.
                </p>
                <h3>Logs do sistema e manutenção</h3>
                <p>
                  Para fins de operação e manutenção, este Aplicativo e quaisquer serviços de terceiros poderão coletar arquivos que gravam a interação com este Aplicativo (logs do sistema) ou usar outros Dados Pessoais (tais como endereço IP) para esta finalidade.
                </p>
              </div>
            </details>

            <details className="pp-sec">
              <summary>Definições e referências jurídicas</summary>
              <div className="pp-body">
                <h4>Dados Pessoais (ou Dados)</h4>
                <p>Quaisquer informações que permitam a identificação ou identificabilidade de uma pessoa física.</p>

                <h4>Dados de Uso</h4>
                <p>As informações coletadas automaticamente através deste Aplicativo (ou serviços de terceiros contratados).</p>

                <h4>Usuário</h4>
                <p>A pessoa que usa este Aplicativo.</p>

                <h4>Titular dos Dados</h4>
                <p>A pessoa física a quem os Dados Pessoais se referem.</p>

                <h4>Controlador de Dados (ou Proprietário)</h4>
                <p>Já Digital Instituição de Pagamento S.A.</p>
              </div>
            </details>

            <div className="iub_footer">
              <p>Última atualização: 5 de fevereiro de 2024</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
