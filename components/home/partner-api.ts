/**
 * Where a Service Partner request goes. This is the single place to connect a backend.
 *
 * - If NEXT_PUBLIC_PARTNER_API_URL is set, the request is POSTed there as JSON
 *   ({ fullName, email, mobile }) and any 2xx response counts as success.
 * - Otherwise it is handed to WhatsApp with the details prefilled, the same way the
 *   Contact page enquiry works, so a request is never silently lost.
 *
 * Nothing here signs anyone in or creates an account.
 */
export type PartnerRequest = { fullName: string; email: string; mobile: string | null };
export type PartnerChannel = "api" | "whatsapp";
export type PartnerSubmitResult = { ok: true; channel: PartnerChannel } | { ok: false; message: string };

const API_URL = process.env.NEXT_PUBLIC_PARTNER_API_URL;
const WHATSAPP_NUMBER = "917688866933";
const PHONE_DISPLAY = "76888 66933";

export async function submitPartnerRequest(request: PartnerRequest): Promise<PartnerSubmitResult> {
  // Runs synchronously inside the click, before any await, so the browser allows the WhatsApp window.
  if (!API_URL) return handOffToWhatsApp(request);

  try {
    const response = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
    if (!response.ok) return { ok: false, message: `We couldn't send your details. Please try again, or call ${PHONE_DISPLAY}.` };
    return { ok: true, channel: "api" };
  } catch {
    return { ok: false, message: "Network problem. Please check your connection and try again." };
  }
}

function handOffToWhatsApp({ fullName, email, mobile }: PartnerRequest): PartnerSubmitResult {
  const message = [
    "Hello, I would like to connect as a Service Partner.",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Mobile: ${mobile ? `+91 ${mobile}` : "Not provided"}`,
  ].join("\n");
  const win = window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  if (!win) return { ok: false, message: `Your browser blocked the WhatsApp window. Allow pop-ups for this site, or call ${PHONE_DISPLAY}.` };
  win.opener = null;
  return { ok: true, channel: "whatsapp" };
}
