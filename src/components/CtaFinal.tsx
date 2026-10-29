import React, { useState, useEffect } from "react";
import { sendLeadEmail } from "../mail";

interface FormData {
  nome: string;
  email: string;
  empresa: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  empresa?: string;
}

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ']{2,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ']{2,})+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const CtaFinal: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    empresa: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "demo">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Temporary success message timeout (7 seconds)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === "success" || status === "demo") {
      timer = setTimeout(() => {
        setStatus("idle");
      }, 7000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    const trimmed = value.trim();
    if (name === "nome") {
      if (!trimmed) return "Por favor, informe seu nome completo.";
      if (!NAME_REGEX.test(trimmed)) {
        return "Por favor, informe seu nome e sobrenome (ex.: Maria Silva).";
      }
    }
    if (name === "email") {
      if (!trimmed) return "Por favor, informe seu e-mail corporativo.";
      if (!EMAIL_REGEX.test(trimmed)) {
        return "Por favor, insira um e-mail válido (ex.: nome@empresa.com.br).";
      }
    }
    if (name === "empresa") {
      if (!trimmed) return "Por favor, informe o nome da sua empresa.";
      if (trimmed.length < 2) {
        return "O nome da empresa deve ter pelo menos 2 caracteres.";
      }
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Validate immediately on keystroke
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nomeError = validateField("nome", formData.nome);
    const emailError = validateField("email", formData.email);
    const empresaError = validateField("empresa", formData.empresa);

    const newErrors: FormErrors = {
      nome: nomeError,
      email: emailError,
      empresa: empresaError,
    };

    setErrors(newErrors);

    if (nomeError || emailError || empresaError) {
      if (nomeError) {
        document.getElementById("ctaNome")?.focus();
      } else if (emailError) {
        document.getElementById("ctaEmail")?.focus();
      } else if (empresaError) {
        document.getElementById("ctaEmpresa")?.focus();
      }
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await sendLeadEmail({
        email: formData.email.trim(),
        nome: formData.nome.trim(),
        empresa: formData.empresa.trim(),
        source: "ctaForm",
      });

      if (result === "sent") {
        setStatus("success");
        setFormData({ nome: "", email: "", empresa: "" });
        setErrors({});
      } else {
        // Demo mode (simulated)
        setStatus("demo");
        setFormData({ nome: "", email: "", empresa: "" });
        setErrors({});
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Não foi possível enviar sua mensagem. Tente novamente."
      );
    }
  };

  return (
    <section className="section section-cta" id="cta-final" aria-labelledby="ctaFinalTitle">
      <div className="container center" data-animate>
        <h2 className="light" id="ctaFinalTitle">Pronto para simplificar os benefícios da sua empresa?</h2>
        <p className="cta-final-description">
          Preencha os dados abaixo e fale com nossa equipe comercial sem compromisso.
        </p>

        <div className="cta-form-wrapper">
          <form className="cta-form" onSubmit={handleSubmit} noValidate aria-label="Formulário de contato comercial">
            <div className="cta-field">
              <label htmlFor="ctaNome">
                Nome completo <span aria-hidden="true">*</span>
              </label>
              <div className="cta-input-control">
                <input
                  type="text"
                  id="ctaNome"
                  name="nome"
                  className="cta-input"
                  value={formData.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Seu nome e sobrenome"
                  required
                  autoComplete="name"
                  aria-invalid={!!errors.nome}
                  aria-describedby={errors.nome ? "ctaNomeErr" : undefined}
                />
              </div>
              {errors.nome && (
                <p id="ctaNomeErr" className="cta-field-error" role="alert">
                  {errors.nome}
                </p>
              )}
            </div>

            <div className="cta-field">
              <label htmlFor="ctaEmail">
                E-mail corporativo <span aria-hidden="true">*</span>
              </label>
              <div className="cta-input-control">
                <input
                  type="email"
                  id="ctaEmail"
                  name="email"
                  className="cta-input"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="seu@empresa.com.br"
                  required
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "ctaEmailErr" : undefined}
                />
              </div>
              {errors.email && (
                <p id="ctaEmailErr" className="cta-field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="cta-field cta-field--full">
              <label htmlFor="ctaEmpresa">
                Nome da empresa <span aria-hidden="true">*</span>
              </label>
              <div className="cta-input-control">
                <input
                  type="text"
                  id="ctaEmpresa"
                  name="empresa"
                  className="cta-input"
                  value={formData.empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nome da sua empresa"
                  required
                  autoComplete="organization"
                  aria-invalid={!!errors.empresa}
                  aria-describedby={errors.empresa ? "ctaEmpresaErr" : undefined}
                />
              </div>
              {errors.empresa && (
                <p id="ctaEmpresaErr" className="cta-field-error" role="alert">
                  {errors.empresa}
                </p>
              )}
            </div>

            {status === "success" && (
              <div className="cta-status-ok" role="status" tabIndex={-1}>
                ✓ Solicitação enviada com sucesso! Um consultor entrará em contato em até 1 dia útil.
              </div>
            )}

            {status === "demo" && (
              <div className="cta-status-ok" role="status" tabIndex={-1}>
                ✓ Solicitação recebida! Em breve entraremos em contato.
              </div>
            )}

            {status === "error" && (
              <div className="cta-status-err" role="alert" tabIndex={-1}>
                {errorMessage || "Ocorreu um erro ao enviar. Tente novamente ou fale no WhatsApp."}
              </div>
            )}

            <div className="cta-field cta-field--full">
              <button
                type="submit"
                className="btn btn-yellow cta-submit-btn"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <span className="btn-loading-wrap">
                    <svg
                      className="btn-spinner"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                      <path d="M12 3a9 9 0 0 1 9 9" />
                    </svg>
                    <span>Enviando...</span>
                  </span>
                ) : (
                  <>
                    Quero falar com a JÁ <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
