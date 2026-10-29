import React, { useState } from "react";
import { sendLeadEmail, LeadPayload } from "../mail";

interface FormErrors {
  nome?: string;
  whatsapp?: string;
  email?: string;
  empresa?: string;
  colaboradores?: string;
  area?: string;
  procurado?: string;
  consent?: string;
  general?: string;
}

export const CustoZero: React.FC<{ onOpenPrivacy?: () => void }> = ({ onOpenPrivacy }) => {
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    empresa: "",
    colaboradores: "",
    area: "",
    cargo: "",
    procurado: "",
    consent: false,
    botcheck: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "demo">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) newErrors.nome = "Este campo é obrigatório";
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "Este campo é obrigatório";
    } else if (!/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(formData.whatsapp.replace(/\s/g, ""))) {
      newErrors.whatsapp = "WhatsApp inválido. Use (DD) 9 0000-0000";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Este campo é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "E-mail inválido. Ex.: nome@empresa.com.br";
    }

    if (!formData.empresa.trim()) newErrors.empresa = "Este campo é obrigatório";
    if (!formData.colaboradores) newErrors.colaboradores = "Este campo é obrigatório";
    if (!formData.area) newErrors.area = "Este campo é obrigatório";
    if (!formData.procurado) newErrors.procurado = "Este campo é obrigatório";
    if (!formData.consent) newErrors.consent = "É preciso aceitar a Política de Privacidade para enviar";

    setErrors(newErrors);
    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      setErrorMessage(
        errorCount === 1
          ? "Falta 1 campo para enviar. Revise o destaque abaixo."
          : `Faltam ${errorCount} campos para enviar. Revise os destaques abaixo.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.botcheck) {
      // Silent honeypot check
      return;
    }

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const payload: LeadPayload = {
        source: "beneficiosForm",
        email: formData.email,
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        empresa: formData.empresa,
        colaboradores: formData.colaboradores,
        area: formData.area,
        cargo: formData.cargo,
        procurado: formData.procurado,
        consent: formData.consent ? "Sim" : "Não",
      };

      const result = await sendLeadEmail(payload);

      if (result === "demo") {
        setStatus("demo");
        setErrorMessage("Formulário em modo de demonstração: nenhum dado foi enviado neste ambiente.");
      } else {
        setStatus("success");
        setFormData({
          nome: "",
          whatsapp: "",
          email: "",
          empresa: "",
          colaboradores: "",
          area: "",
          cargo: "",
          procurado: "",
          consent: false,
          botcheck: false,
        });
      }
    } catch (err) {
      console.error("[mail] err:", err);
      setStatus("error");
      setErrorMessage("Não foi possível enviar agora. Verifique sua conexão e tente novamente.");
    }
  };

  return (
    <section className="section section-orange" id="custo-zero">
      <svg className="zero-art zero-art--left" viewBox="0 0 240 420" aria-hidden="true">
        <path d="M210 0a150 150 0 0 0 0 300M210 200A190 190 0 0 0 20 390" fill="none" stroke="var(--ja-mostarda)" strokeWidth="90" />
        <path d="M105 0a105 105 0 0 0 65 98" fill="none" stroke="var(--ja-verde)" strokeWidth="10" />
      </svg>
      <svg className="zero-art zero-art--right" viewBox="0 0 260 280" aria-hidden="true">
        <path d="M15 220A200 200 0 0 0 215 20" fill="none" stroke="var(--ja-mostarda)" strokeWidth="90" />
        <path d="M205 195a240 240 0 0 0 50-75" fill="none" stroke="var(--ja-verde)" strokeWidth="10" />
      </svg>
      
      <div className="container">
        <header className="custo-zero-header" data-animate>
          <h2 className="zero-heading">
            Benefícios completos,<br />
            <span className="zero-highlight">sem taxas de gestão.</span>
          </h2>
          <p className="zero-sub" id="zero-services-title">Taxa zero nos serviços:</p>

          <ul className="zero-chips" aria-labelledby="zero-services-title">
            <li>
              <span className="chip chip--implanta">
                <i className="fa-solid fa-rocket chip-ico" aria-hidden="true"></i>
                Implantação
              </span>
            </li>
            <li>
              <span className="chip chip--mensal">
                <i className="fa-solid fa-calendar-days chip-ico" aria-hidden="true"></i>
                Mensalidade
              </span>
            </li>
            <li>
              <span className="chip chip--cartao">
                <i className="fa-solid fa-credit-card chip-ico" aria-hidden="true"></i>
                Emissão da primeira<br />via do cartão
              </span>
            </li>
          </ul>

          <p className="zero-shipping">Frete dos cartões físicos cobrado à parte, com valor variável conforme a região.</p>
          <p className="zero-note">Condições comerciais sujeitas à confirmação na proposta.</p>
        </header>

        <div className="custo-zero-card">
          <div className="custo-zero-form">
            <form 
              className="beneficios-form" 
              id="beneficiosForm" 
              noValidate 
              onSubmit={handleSubmit}
              data-animate
            >
              <input type="checkbox" name="botcheck" id="botcheckBeneficios" className="honeypot" tabIndex={-1} aria-hidden="true" autoComplete="off" checked={formData.botcheck} onChange={(e) => setFormData(p => ({ ...p, botcheck: e.target.checked }))} />

              <h3 className="form-title">
                Receba a proposta para sua empresa<br />
                em até 1 dia útil
              </h3>
              <p className="form-subtitle">
                Preencha os campos abaixo. Um consultor nomeado entra em contato pelo WhatsApp ou e-mail para entender seu time e enviar a proposta — sem compromisso.
              </p>

              <div className="beneficios-grid">
                <div className="form-field">
                  <label htmlFor="bfNome">Nome completo <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3Z"/></svg>
                    <input type="text" id="bfNome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" required autoComplete="name" aria-invalid={!!errors.nome} />
                  </div>
                  {errors.nome && <p className="field-error">{errors.nome}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfWhatsApp">WhatsApp <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z"/><path d="M9 7c-2 3 2 7 5 7l1-2-3-1-1 1-2-3 1-1Z"/></svg>
                    <input type="tel" id="bfWhatsApp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(DD) 9 0000-0000" required autoComplete="tel" inputMode="tel" maxLength={18} aria-invalid={!!errors.whatsapp} />
                  </div>
                  {errors.whatsapp && <p className="field-error">{errors.whatsapp}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfEmail">E-mail corporativo <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/></svg>
                    <input type="email" id="bfEmail" name="email" value={formData.email} onChange={handleChange} placeholder="seu@empresa.com.br" required autoComplete="email" aria-invalid={!!errors.email} />
                  </div>
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfEmpresa">Nome da empresa <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 21V3h9v18M15 9h4v12M3 21h18M9 6h3M9 10h3M9 14h3M10 21v-3"/></svg>
                    <input type="text" id="bfEmpresa" name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Digite o nome da empresa" required autoComplete="organization" aria-invalid={!!errors.empresa} />
                  </div>
                  {errors.empresa && <p className="field-error">{errors.empresa}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfColaboradores">Número de colaboradores <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 4 5"/></svg>
                    <select id="bfColaboradores" name="colaboradores" value={formData.colaboradores} onChange={handleChange} required aria-invalid={!!errors.colaboradores}>
                      <option value="">Selecione</option>
                      <option value="1-10">1 a 10</option>
                      <option value="11-50">11 a 50</option>
                      <option value="51-100">51 a 100</option>
                      <option value="101-250">101 a 250</option>
                      <option value="251-500">251 a 500</option>
                      <option value="500+">Acima de 500</option>
                    </select>
                  </div>
                  {errors.colaboradores && <p className="field-error">{errors.colaboradores}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfArea">Sua área <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v9h9A9 9 0 1 1 12 3Z"/><path d="M16 3v5h5a8 8 0 0 0-5-5Z"/></svg>
                    <select id="bfArea" name="area" value={formData.area} onChange={handleChange} required aria-invalid={!!errors.area}>
                      <option value="">Selecione</option>
                      <option value="rh">Recursos Humanos (RH)</option>
                      <option value="financeiro">Financeiro</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="diretoria">Diretoria / Sócios</option>
                      <option value="outro">Outra área</option>
                    </select>
                  </div>
                  {errors.area && <p className="field-error">{errors.area}</p>}
                </div>

                <div className="form-field">
                  <label htmlFor="bfCargo">Cargo atual</label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4"/></svg>
                    <input type="text" id="bfCargo" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Seu cargo" />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="bfProcurado">O que você procura? <span className="required" aria-hidden="true">*</span></label>
                  <div className="form-control">
                    <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>
                    <select id="bfProcurado" name="procurado" value={formData.procurado} onChange={handleChange} required aria-invalid={!!errors.procurado}>
                      <option value="">Selecione</option>
                      <option value="conhecer">Conhecer o JÁ Benefícios</option>
                      <option value="contratar">Contratar benefícios para minha empresa</option>
                      <option value="migrar">Substituir meu fornecedor atual</option>
                      <option value="proposta">Solicitar uma proposta comercial</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>
                  {errors.procurado && <p className="field-error">{errors.procurado}</p>}
                </div>

                <div className="form-field beneficios-full">
                  <label className="form-consent" htmlFor="bfConsent">
                    <input type="checkbox" id="bfConsent" name="consent" checked={formData.consent} onChange={handleChange} required aria-invalid={!!errors.consent} />
                    <span className="form-consent-text">
                      Concordo em ser contatado pela equipe comercial e aceito a{" "}
                      <a href="#privacidade" onClick={(e) => { e.preventDefault(); if (onOpenPrivacy) onOpenPrivacy(); }}>
                        Política de Privacidade
                      </a>.
                    </span>
                  </label>
                  {errors.consent && <p className="field-error">{errors.consent}</p>}
                  <p className="form-reassurance">
                    Após o envio, <strong>um consultor nomeado</strong> entra em contato em até <strong>1 dia útil</strong> pelo WhatsApp ou e-mail. Sem spam, sem compromisso.
                  </p>
                </div>

                <div className="form-field beneficios-full">
                  <button 
                    type="submit" 
                    className="btn btn-yellow btn-zero-submit" 
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Enviando…" : (
                      <>Solicitar contato comercial <span aria-hidden="true">→</span></>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {status === "success" && (
              <p id="beneficiosFormOk" className="form-ok" role="status" tabIndex={-1}>
                Enviado! <strong>Um consultor nomeado</strong> vai te chamar no WhatsApp ou e-mail em até <strong>1 dia útil</strong> com a proposta para sua empresa.
              </p>
            )}

            {(status === "error" || status === "demo") && (
              <p id="beneficiosFormErr" className="form-err" role="alert" tabIndex={-1}>
                <span>{errorMessage}</span>{" "}
                <span className="form-err-action">
                  Se preferir, chame direto no{" "}
                  <a href="https://wa.me/5511910993348?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20J%C3%81%20Benef%C3%ADcios." target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>.
                </span>
              </p>
            )}

            <p className="form-whatsapp-note">
              Se preferir, fale com a gente pelo WhatsApp{" "}
              <a href="https://wa.me/5511910993348?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20J%C3%81%20Benef%C3%ADcios." target="_blank" rel="noopener noreferrer" aria-label="Fale com a gente pelo WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.05-.52-.099-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
