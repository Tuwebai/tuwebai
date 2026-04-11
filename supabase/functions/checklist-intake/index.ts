import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildCorsPreflightResponse, buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return buildCorsPreflightResponse();
  }

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = normalizeString(body?.name);
  const email = normalizeEmail(body?.email);
  const lastWebsiteRefresh = normalizeString(body?.lastWebsiteRefresh);
  const source = normalizeString(body?.source) ?? 'website';
  const frontendUrl = normalizeString(Deno.env.get('FRONTEND_URL')) ?? 'https://tuweb-ai.com';

  if (!name || !email || !lastWebsiteRefresh) {
    return buildJsonResponse(400, { success: false, message: 'Payload invalido.', requestId });
  }

  try {
    await sendBrevoTransactionalEmail({
      senderEmail: normalizeEmail(Deno.env.get('NEWSLETTER_FROM_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'news@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: 'Tu checklist web gratis de TuWeb.ai',
      textContent: [
        `${name.split(/\s+/)[0] || 'Hola'}, aca tenes tu checklist web gratis de TuWeb.ai.`,
        '',
        'Descargalo desde este enlace:',
        `${frontendUrl.replace(/\/+$/, '')}/checklist-web-tuwebai-branded.pdf`,
        '',
        'Version interactiva:',
        `${frontendUrl.replace(/\/+$/, '')}/checklist-web-gratis`,
      ].join('\n'),
      to: email,
    });
  } catch {
    return buildJsonResponse(500, { success: false, message: 'No se pudo enviar el checklist en este momento.', requestId });
  }

  try {
    await sendBrevoTransactionalEmail({
      senderEmail: normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'no-reply@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: 'Nueva solicitud de checklist web gratis',
      textContent: `Nombre: ${name}\nEmail: ${email}\nUltima renovacion web: ${lastWebsiteRefresh}\nSource: ${source}`,
      to: normalizeEmail(Deno.env.get('CONTACT_TO_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'hola@tuweb-ai.com',
    });
  } catch {}

  return buildJsonResponse(202, {
    success: true,
    message: 'Solicitud recibida. Te enviamos el checklist por email.',
    requestId,
  });
});
