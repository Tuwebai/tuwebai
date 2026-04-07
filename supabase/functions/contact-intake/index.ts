import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildCorsPreflightResponse, buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';

interface ContactPayload {
  email: string;
  message: string;
  name: string;
  title?: string | null;
}

const parsePayload = async (request: Request): Promise<ContactPayload | null> => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) {
    return null;
  }

  const name = normalizeString(body.name);
  const email = normalizeEmail(body.email);
  const title = normalizeString(body.title);
  const message = normalizeString(body.message);

  if (!name || name.length < 2 || !email || !message || message.length < 10) {
    return null;
  }

  return { name, email, title, message };
};

const buildNotificationMessage = (payload: ContactPayload) =>
  [
    'Nuevo contacto desde tuweb-ai.com',
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
    `Asunto: ${payload.title || 'Consulta web'}`,
    '',
    payload.message,
  ].join('\n');

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return buildCorsPreflightResponse();
  }

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const payload = await parsePayload(request);
  if (!payload) {
    return buildJsonResponse(400, { success: false, message: 'Payload invalido.', requestId });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(500, { success: false, message: 'Supabase no esta configurado.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const submission = {
    channel: 'contact',
    email: payload.email,
    message: payload.message,
    name: payload.name,
    payload: {
      createdAt: new Date().toISOString(),
      email: payload.email,
      message: payload.message,
      name: payload.name,
      source: 'website',
      title: payload.title ?? 'Consulta web',
    },
    source: 'website',
    status: 'received',
    title: payload.title ?? 'Consulta web',
  };

  const { error } = await supabase.from('public_submissions').insert(submission);
  if (error) {
    console.error('contact_intake.insert_failed', { code: error.code, message: error.message, requestId });
    return buildJsonResponse(500, { success: false, message: 'No se pudo registrar la consulta.', requestId });
  }

  const contactToEmail =
    normalizeEmail(Deno.env.get('CONTACT_TO_EMAIL')) ??
    normalizeEmail(Deno.env.get('SMTP_USER')) ??
    'hola@tuweb-ai.com';

  try {
    await sendBrevoTransactionalEmail({
      senderEmail:
        normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ??
        normalizeEmail(Deno.env.get('SMTP_USER')) ??
        'no-reply@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: payload.title || 'Nuevo contacto desde TuWeb.ai',
      textContent: buildNotificationMessage(payload),
      to: contactToEmail,
    });
  } catch (error) {
    console.error('contact_intake.notification_failed', {
      error: error instanceof Error ? error.message : String(error),
      requestId,
    });
  }

  return buildJsonResponse(202, {
    success: true,
    message: 'Mensaje recibido. Te respondemos a la brevedad.',
    requestId,
  });
});
