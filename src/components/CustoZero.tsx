import React, { useState } from "react";
import { sendLeadEmail, LeadPayload } from "../mail";
import { WhatsappIcon, whatsappLink } from "./whatsapp";

interface FormErrors {
  nome?: string;
  whatsapp?: string;
  email?: string;
  empresa?: string;
  colaboradores?: string;
  area?: string;
  procurado?: string;
  cargo?: string;
  consent?: string;
  general?: string;
}

interface LeadFormState {
  nome: string;
  whatsapp: string;
  email: string;
  empresa: string;
  colaboradores: string;
  area: string;
  cargo: string;
  procurado: string;
  consent: boolean;
  botcheck: boolean;
}

/** Os 8 campos simples do lead; consent, honeypot e submit ficam explícitos abaixo. */
interface FieldDef {
  id: string;
  name: Exclude<keyof LeadFormState, "consent" | "botcheck">;
  label: string;
  type: "text" | "tel" | "email" | "select";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "tel";
  maxLength?: number;
  /** Select: pares [valor, rótulo]; ausente = input. */
  options?: [string, string][];
  icon: React.ReactNode;
}

const FORM_FIELDS: FieldDef[] = [
  {
    id: "bfNome",
    name: "nome",
    label: "Nome completo",
    type: "text",
    required: true,
    placeholder: "Digite seu nome completo",
    autoComplete: "name",
    icon: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21v-3a7 7 0 0 1 14 0v3Z" />
      </>
    ),
  },
  {
    id: "bfWhatsApp",
    name: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    required: true,
    placeholder: "(DD) 9 0000-0000",
    autoComplete: "tel",
    inputMode: "tel",
    maxLength: 18,
    icon: (
      <>
        <path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z" />
        <path d="M9 7c-2 3 2 7 5 7l1-2-3-1-1 1-2-3 1-1Z" />
      </>
    ),
  },
  {
    id: "bfEmail",
    name: "email",
    label: "E-mail corporativo",
    type: "email",
    required: true,
    placeholder: "seu@empresa.com.br",
    autoComplete: "email",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
  },
  {
    id: "bfEmpresa",
    name: "empresa",
    label: "Nome da empresa",
    type: "text",
    required: true,
    placeholder: "Digite o nome da empresa",
    autoComplete: "organization",
    icon: <path d="M6 21V3h9v18M15 9h4v12M3 21h18M9 6h3M9 10h3M9 14h3M10 21v-3" />,
  },
  {
    id: "bfColaboradores",
    name: "colaboradores",
    label: "Número de colaboradores",
    type: "select",
    required: true,
    options: [
      ["1-10", "1 a 10"],
      ["11-50", "11 a 50"],
      ["51-100", "51 a 100"],
      ["101-250", "101 a 250"],
      ["251-500", "251 a 500"],
      ["500+", "Acima de 500"],
    ],
    icon: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M2 21v-3a7 7 0 0 1 14 0v3M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 4 5" />
      </>
    ),
  },
  {
    id: "bfArea",
    name: "area",
    label: "Sua área",
    type: "select",
    required: true,
    options: [
      ["rh", "Recursos Humanos (RH)"],
      ["financeiro", "Financeiro"],
      ["administrativo", "Administrativo"],
      ["diretoria", "Diretoria / Sócios"],
      ["outro", "Outra área"],
    ],
    icon: (
      <>
        <path d="M12 3v9h9A9 9 0 1 1 12 3Z" />
        <path d="M16 3v5h5a8 8 0 0 0-5-5Z" />
      </>
    ),
  },
  {
    id: "bfCargo",
    name: "cargo",
    label: "Cargo atual",
    type: "text",
    placeholder: "Seu cargo",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V3h8v4" />
      </>
    ),
  },
  {
    id: "bfProcurado",
    name: "procurado",
    label: "O que você procura?",
    type: "select",
    required: true,
    options: [
      ["conhecer", "Conhecer o JÁ Benefícios"],
      ["contratar", "Contratar benefícios para minha empresa"],
      ["migrar", "Substituir meu fornecedor atual"],
      ["proposta", "Solicitar uma proposta comercial"],
      ["outro", "Outro assunto"],
    ],
    icon: (
      <>
        <circle cx="10" cy="10" r="7" />
        <path d="m15 15 6 6" />
      </>
    ),
  },
];

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
  const validateField = (name: string, value: any): string | undefined => {
    if (name === "nome") {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed) return "Este campo é obrigatório";
      const parts = trimmed.split(/\s+/).filter(Boolean);
      if (parts.length < 2 || !/^[A-Za-zÀ-ÖØ-öø-ÿ']{2,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ']{2,})+$/.test(trimmed)) {
        return "Informe seu nome e sobrenome (ex.: Maria Silva)";
      }
    }
    if (name === "whatsapp") {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed) return "Este campo é obrigatório";
      const digitsOnly = trimmed.replace(/\D/g, "");
      if (digitsOnly.length < 10 || digitsOnly.length > 13) {
        return "WhatsApp inválido. Use (DD) 9 0000-0000";
      }
    }
    if (name === "email") {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed) return "Este campo é obrigatório";
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
        return "E-mail inválido. Ex.: nome@empresa.com.br";
      }
    }
    if (name === "empresa") {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (!trimmed) return "Este campo é obrigatório";
      if (trimmed.length < 2) return "Nome da empresa deve ter pelo menos 2 caracteres";
    }
    if (name === "colaboradores" && !value) return "Este campo é obrigatório";
    if (name === "area" && !value) return "Este campo é obrigatório";
    if (name === "procurado" && !value) return "Este campo é obrigatório";
    if (name === "consent" && !value) return "É preciso aceitar a Política de Privacidade para enviar";
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // Validate immediately on change/keystroke
    const err = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const val = type === "checkbox" ? checked : value;

    const err = validateField(name, val);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const fieldsToValidate = ["nome", "whatsapp", "email", "empresa", "colaboradores", "area", "procurado", "consent"];

    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field as keyof typeof formData]);
      if (err) newErrors[field as keyof FormErrors] = err;
    });

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
                Implantação gratuita
              </span>
            </li>
            <li>
              <span className="chip chip--mensal">
                <i className="fa-solid fa-calendar-days chip-ico" aria-hidden="true"></i>
                Zero mensalidade
              </span>
            </li>
            <li>
              <span className="chip chip--cartao">
                <i className="fa-solid fa-credit-card chip-ico" aria-hidden="true"></i>
                1ª via dos cartões<br />sem custo
              </span>
            </li>
          </ul>

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
                Vamos encontrar a solução ideal para sua empresa?
              </h3>
              <p className="form-subtitle">
                Conte um pouco sobre sua empresa. Nossa equipe entrará em contato por WhatsApp ou e-mail para apresentar uma proposta personalizada que simplifique a gestão dos benefícios e amplie as opções do seu time — sem compromisso.
              </p>

              <div className="beneficios-grid">
                {FORM_FIELDS.map((field) => (
                  <div className="form-field" key={field.id}>
                    <label htmlFor={field.id}>{field.label} {field.required && <span className="required" aria-hidden="true">*</span>}</label>
                    <div className="form-control">
                      <svg className="form-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{field.icon}</svg>
                      {field.options ? (
                        <select id={field.id} name={field.name} value={formData[field.name]} onChange={handleChange} onBlur={handleBlur} required={field.required} aria-invalid={!!errors[field.name]}>
                          <option value="">Selecione</option>
                          {field.options.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        <input type={field.type} id={field.id} name={field.name} value={formData[field.name]} onChange={handleChange} onBlur={handleBlur} placeholder={field.placeholder} required={field.required} autoComplete={field.autoComplete} inputMode={field.inputMode} maxLength={field.maxLength} aria-invalid={!!errors[field.name]} />
                      )}
                    </div>
                    {errors[field.name] && <p className="field-error">{errors[field.name]}</p>}
                  </div>
                ))}

                <div className="form-field beneficios-full">
                  <label className="form-consent" htmlFor="bfConsent">
                    <input type="checkbox" id="bfConsent" name="consent" checked={formData.consent} onChange={handleChange} onBlur={handleBlur} required aria-invalid={!!errors.consent} />
                    <span className="form-consent-text">
                      Concordo em ser contatado pela equipe comercial e aceito a{" "}
                      <a href="/privacidade" onClick={(e) => { e.preventDefault(); if (onOpenPrivacy) onOpenPrivacy(); }}>
                        Política de Privacidade
                      </a>.
                    </span>
                  </label>
                  {errors.consent && <p className="field-error">{errors.consent}</p>}
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
                  <ul className="form-trust" aria-label="Compromissos de atendimento">
                    <li>Atendimento consultivo, sem compromisso</li>
                    <li>Suporte dedicado a RH</li>
                  </ul>
                </div>
              </div>
            </form>

            {status === "success" && (
              <p id="beneficiosFormOk" className="form-ok" role="status" tabIndex={-1}>
                Enviado! <strong>Um consultor nomeado</strong> vai te chamar no WhatsApp ou e-mail com a proposta para sua empresa.
              </p>
            )}

            {(status === "error" || status === "demo") && (
              <p id="beneficiosFormErr" className="form-err" role="alert" tabIndex={-1}>
                <span>{errorMessage}</span>{" "}
                <span className="form-err-action">
                  Se preferir, chame direto no{" "}
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>.
                </span>
              </p>
            )}

            <p className="form-whatsapp-note">
              Se preferir, fale com a gente pelo WhatsApp{" "}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Fale com a gente pelo WhatsApp">
                <WhatsappIcon />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
