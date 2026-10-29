// JA Benefícios — envio de lead por e-mail via Web3Forms (API serverless, sem backend)
// Referência: https://docs.web3forms.com/getting-started/api-reference

/** Dados enviados no POST ao Web3Forms. */
export type LeadPayload = {
  /** E-mail do visitante — vira o reply-to da mensagem. */
  email: string;
  /** Identificador do formulário de origem (ex.: "ctaForm", "beneficiosForm"). */
  source: string;
  /** Campos extras do formulário de benefícios (opcional para os demais forms). */
  nome?: string;
  whatsapp?: string;
  empresa?: string;
  colaboradores?: string;
  area?: string;
  cargo?: string;
  procurado?: string;
  consent?: string;
};

/** Resultado do envio: enviado de verdade ou simulado (sem chave configurada). */
export type SendResult = "sent" | "demo";

/** Resposta da API (sucesso: {success:true,message} — ver docs acima). */
type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

const ENDPOINT = "https://api.web3forms.com/submit";
/** Teto de espera: rede ruim não deixa o botão travado em "Enviando…". */
const TIMEOUT_MS = 10_000;

/** Rótulo humano da origem do lead — aparece direto no e-mail recebido. */
function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    heroForm: "no formulário do topo da página",
    ctaForm: "no formulário do CTA final",
    beneficiosForm: "no formulário de benefícios completos (sem taxas de gestão)",
  };
  return labels[source] ?? `no formulário ${source}`;
}

/**
 * Envia o lead ao Web3Forms por fetch JSON (CORS habilitado no cliente).
 * Sem `VITE_WEB3FORMS_KEY` cai em modo demo — nenhum e-mail sai, mas o fluxo
 * completo (botão, reset) continua exercitado em dev e build.
 */
export async function sendLeadEmail(payload: LeadPayload): Promise<SendResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
  if (!accessKey) {
    console.warn("[mail] VITE_WEB3FORMS_KEY ausente — modo demo, nenhum e-mail enviado.");
    return "demo";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const camposExtras: string[] = [];
    if (payload.nome) camposExtras.push(`• Nome: ${payload.nome}`);
    if (payload.whatsapp) camposExtras.push(`• WhatsApp: ${payload.whatsapp}`);
    if (payload.empresa) camposExtras.push(`• Empresa: ${payload.empresa}`);
    if (payload.colaboradores) camposExtras.push(`• Colaboradores: ${payload.colaboradores}`);
    if (payload.area) camposExtras.push(`• Área: ${payload.area}`);
    if (payload.cargo) camposExtras.push(`• Cargo atual: ${payload.cargo}`);
    if (payload.procurado) camposExtras.push(`• Procura: ${payload.procurado}`);
    if (payload.consent) camposExtras.push(`• Consentimento: ${payload.consent}`);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: accessKey,
        email: payload.email,
        from_name: "Site JA Benefícios",
        subject: "Nova solicitação de contato comercial — JA Benefícios",
        message: [
          `Nova solicitação de contato comercial ${sourceLabel(payload.source)}.`,
          ``,
          `• Responder para: ${payload.email}`,
          ...camposExtras,
          `• Onde a pessoa estava: ${window.location.href}`,
          `• Quando: ${new Date().toLocaleString("pt-BR")}`,
          ``,
          `É só responder a este e-mail — a mensagem chega direto para a pessoa. 🙂`,
        ].join("\n"),
        // Honeypot: bots preenchem o checkbox oculto #botcheck e são recusados.
        botcheck: false,
      }),
    });

    const data = (await res.json().catch(() => null)) as Web3FormsResponse | null;
    if (!res.ok || data?.success !== true) {
      throw new Error(data?.message ?? `Falha no envio (HTTP ${res.status})`);
    }
    return "sent";
  } finally {
    clearTimeout(timer);
  }
}
