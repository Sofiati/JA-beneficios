import React, { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";

interface FaqItem {
  grupo?: string;
  pergunta: string;
  resposta: string;
}

const STATIC_FAQ: FaqItem[] = [
  {
    grupo: "Contratação e custos",
    pergunta: "A implantação tem algum custo?",
    resposta: "Não há custo de implantação, mensalidade nem cobrança pela emissão da primeira via do cartão. Os únicos custos são o frete dos cartões físicos, com valor variável conforme a região, e os créditos que a empresa carrega para os colaboradores."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Existe mensalidade ou taxa por colaborador?",
    resposta: "Não. A JÁ Benefícios não cobra mensalidade nem taxa por colaborador. Além dos créditos carregados, a empresa paga apenas o frete dos cartões físicos, com valor variável conforme a região. Serviços adicionais são informados antes do fechamento."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Quanto custa a segunda via do cartão?",
    resposta: "A emissão da primeira via é gratuita. Para a segunda via e outros serviços adicionais, o valor é informado na proposta comercial e confirmado pelo atendimento antes da solicitação. Em caso de perda ou roubo, o primeiro passo é bloquear o cartão pelo app."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Qual o prazo de emissão e entrega dos cartões?",
    resposta: "O prazo depende da conferência da base de colaboradores e da região de entrega, e é confirmado na proposta comercial. A emissão começa após a assinatura do contrato e o cadastro da base. O cartão é liberado para uso no recebimento, com a recarga feita pela própria empresa na plataforma."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Como funciona a implantação na empresa?",
    resposta: "Após análise das obrigações e responsabilidades da empresa perante o PAT, assinamos o contrato e realizamos o cadastro da base de funcionários para dar sequência à emissão dos cartões. A partir daí, a recarga passa a ser feita pela própria empresa na plataforma de venda de benefícios, com créditos pré-pagos — a empresa paga somente pelos créditos dos colaboradores."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Existe prazo de fidelidade ou multa por cancelamento?",
    resposta: "Não há contrato de fidelidade nem multa por cancelamento. A operação segue as regras combinadas na proposta comercial, e a empresa pode encerrar quando quiser."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Como migro do meu fornecedor atual?",
    resposta: "A troca é planejada com a equipe comercial. O processo começa pelo cadastro da base de colaboradores e pela emissão dos novos cartões; a partir daí, a recarga passa a ser feita na nossa plataforma. Como não há custo de implantação nem fidelidade, o calendário da migração pode ser alinhado com o contrato atual da empresa."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Como funcionam as 16 categorias no mesmo cartão?",
    resposta: "O cartão físico tem dois chips — voucher e multisaldo — e o colaborador acompanha os saldos separados por categoria no app. Quais categorias a empresa contrata e como elas se distribuem entre os chips é definido na proposta com a equipe comercial, porque depende das regras de cada benefício. O PAT se refere a alimentação e refeição; o Vale-Cultura, quando contratado, pertence ao Programa de Cultura do Trabalhador, com legislação própria."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Cada categoria tem saldo separado?",
    resposta: "Sim. Os saldos são controlados por categoria e aparecem separados no app, com o extrato de cada um. A empresa define na contratação e nas recargas quanto vai para cada categoria, conforme as regras de cada benefício."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Onde posso utilizar o cartão JÁ Benefícios?",
    resposta: "Em qualquer estabelecimento que aceite a bandeira VISA. Para o saldo no chip voucher, é necessário informar ao estabelecimento que o pagamento é cartão voucher; o uso depende da rede habilitada para cada categoria. O detalhamento por categoria é confirmado na proposta."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Existe cartão virtual? Como funcionam as compras online?",
    resposta: "Sim. O app reúne a gestão do cartão físico e do cartão virtual: o colaborador acessa os dados completos para compras online, bloqueia e desbloqueia o cartão e acompanha o saldo."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Perdi o cartão ou esqueci a senha. O que faço?",
    resposta: "Bloqueie o cartão imediatamente pelo app. Em seguida, fale com o atendimento pelo e-mail falecom@jadigital.com.br ou pelo WhatsApp (11) 91099-3348 para solicitar a segunda via e receber as orientações. A senha do cartão também é consultada no app."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Quais funcionalidades estão disponíveis no aplicativo?",
    resposta: "Pelo app, o colaborador consulta saldos por categoria e extratos, acessa a senha e os dados do cartão para compras online, bloqueia e desbloqueia o cartão e gerencia o cartão físico e o virtual."
  },
  {
    grupo: "Gestão e rotina do RH",
    pergunta: "Como a empresa administra os benefícios?",
    resposta: "A empresa faz a recarga dos cartões de forma autônoma, pela nossa plataforma de venda de benefícios. Os créditos são pré-pagos: a empresa paga somente pelos créditos dos colaboradores."
  },
  {
    grupo: "Gestão e rotina do RH",
    pergunta: "Como incluir um colaborador ou desligar quem saiu da empresa?",
    resposta: "Na implantação, a base de colaboradores é cadastrada com apoio da nossa equipe. Depois disso, novas admissões entram nessa base e passam a receber recarga no calendário definido pela empresa. Em desligamentos, o atendimento orienta o bloqueio do cartão e o tratamento do saldo remanescente, conforme as regras de cada benefício."
  },
  {
    grupo: "Atendimento e conformidade",
    pergunta: "Como funciona o atendimento para empresas e colaboradores?",
    resposta: "Através dos nossos canais de atendimento: e-mail falecom@jadigital.com.br e WhatsApp (11) 91099-3348."
  },
  {
    grupo: "Atendimento e conformidade",
    pergunta: "O JÁ Benefícios atua em conformidade com o PAT?",
    resposta: "Sim. Nosso nº de Registro PAT é o FA000031, em conformidade com a Lei 14.442/2022 e com as normas do Programa de Alimentação do Trabalhador (PAT). Os dados cadastrais completos constam no rodapé desta página."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Quais cartões a JÁ oferece?",
    resposta: "A JÁ Benefícios oferece cartões corporativos com bandeira VISA que reúnem vários benefícios em um só cartão. As principais categorias são alimentação e refeição (PAT), Vale-Cultura (Programa de Cultura do Trabalhador) e categorias de saúde, educação, deslocamento e premiação (multibenefícios), com saldos separados por categoria no app."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Quais são as taxas e custos para a empresa?",
    resposta: "Não há custo de implantação, mensalidade nem taxa por colaborador. A empresa paga apenas pelos créditos carregados para os colaboradores e pelo frete dos cartões físicos, com valor variável conforme a região. Outros custos eventuais são informados na proposta comercial."
  },
  {
    grupo: "Cartão e plataforma",
    pergunta: "Como funciona o app do colaborador?",
    resposta: "Pelo app, o colaborador consulta saldos por categoria e extratos, acessa a senha e os dados do cartão para compras online, bloqueia e desbloqueia o cartão e gerencia o cartão físico e o virtual."
  },
  {
    grupo: "Contratação e custos",
    pergunta: "Como contratar para minha empresa?",
    resposta: "Fale com nossa equipe comercial pelo formulário de contato (role até o final da página) ou pelo WhatsApp. Após a proposta comercial, assinamos o contrato, cadastramos a base de colaboradores e emitimos os cartões. A partir daí, a empresa faz as recargas pela nossa plataforma de benefícios."
  }
];

export const FaqSection: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>(STATIC_FAQ);

  useEffect(() => {
    fetch("/faq.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FaqItem[]>;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.error("[faq] Error loading faq.json, using static fallback:", err);
      });
  }, []);

  // Inject or update Schema.org FAQPage JSON-LD in document head for search engine rich snippets
  useEffect(() => {
    if (!items || items.length === 0) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.pergunta,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.resposta,
        },
      })),
    };

    const scriptId = "faq-schema-jsonld";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.type = "application/ld+json";
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [items]);

  const grouped: { [key: string]: FaqItem[] } = {};
  items.forEach((item) => {
    const g = item.grupo?.trim() || "Perguntas";
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(item);
  });

  let globalIndex = 0;

  return (
    <section className="section section--white" id="faq">
      <div className="container">
        <div className="faq-search-box" style={{ marginBottom: "36px" }}>
          <SearchBar placeholder="O que você procura? Digite uma dúvida, benefício ou taxa (ex: PAT, frete, 1ª via, app)…" />
        </div>

        <div className="faq-layout">
          <div className="faq-aside" data-animate>
            <p className="eyebrow">Central de dúvidas</p>
            <h2>Perguntas frequentes</h2>
            <p className="lead">Tudo o que você precisa saber sobre o JÁ Benefícios, em respostas simples e diretas.</p>

            <div className="faq-help">
              <span className="faq-help-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                  <path d="M4 13h2.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
                  <path d="M20 13h-2.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z" />
                  <path d="M18.6 18.6v.9a2 2 0 0 1-2 2h-3.2" />
                </svg>
              </span>
              <h3>Ainda tem dúvidas?</h3>
              <p>Nossa equipe está pronta para ajudar você a conhecer a solução ideal para sua empresa.</p>
              <a href="#beneficiosForm" className="btn btn-cream">Conversar com um especialista <span aria-hidden="true">→</span></a>
            </div>
          </div>

          <div className="faq-list" id="faqList" data-animate>
            {Object.entries(grouped).map(([groupTitle, groupItems]) => (
              <React.Fragment key={groupTitle}>
                <h3 className="faq-group-title">{groupTitle}</h3>
                {groupItems.map((item) => {
                  const isFirst = globalIndex === 0;
                  globalIndex++;
                  return (
                    <details key={item.pergunta} className="faq-item" open={isFirst}>
                      <summary>{item.pergunta}</summary>
                      <p>{item.resposta}</p>
                    </details>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
