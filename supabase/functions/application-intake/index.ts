import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = normalizeString(body?.name);
  const email = normalizeEmail(body?.email);
  const position = normalizeString(body?.position);
  const department = normalizeString(body?.department);
  const type = normalizeString(body?.type);
  const phone = normalizeString(body?.phone) ?? '';
  const experience = normalizeString(body?.experience) ?? '';
  const portfolio = normalizeString(body?.portfolio) ?? '';
  const message = normalizeString(body?.message) ?? '';
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!name || !email || !position || !department || !type || !supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(400, { success: false, message: 'Payload invalido.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const payload = {
    appliedAt: new Date().toISOString(),
    department,
    email,
    experience,
    message,
    name,
    phone,
    portfolio,
    position,
    source: 'website',
    status: 'pending',
    type,
  };

  const { error } = await supabase.from('public_submissions').insert({
    channel: 'applications',
    email,
    message,
    name,
    payload,
    source: 'website',
    status: 'received',
    title: `Aplicacion: ${position}`,
  });

  if (error) {
    return buildJsonResponse(500, { success: false, message: 'No se pudo registrar la aplicacion.', requestId });
  }

  try {
    await sendBrevoTransactionalEmail({
      senderEmail: normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'no-reply@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: `Nueva aplicacion: ${position}`,
      textContent: [
        `Posicion: ${position}`,
        `Departamento: ${department}`,
        `Tipo: ${type}`,
        `Nombre: ${name}`,
        `Email: ${email}`,
        `Telefono: ${phone || 'No provisto'}`,
        `Experiencia: ${experience || 'No provista'}`,
        `Portfolio: ${portfolio || 'No provisto'}`,
        '',
        `Mensaje: ${message || 'Sin mensaje adicional'}`,
      ].join('\n'),
      to: normalizeEmail(Deno.env.get('CONTACT_TO_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'hola@tuweb-ai.com',
    });
  } catch {}

  return buildJsonResponse(201, {
    success: true,
    message: 'Aplicacion recibida y pendiente de revision.',
    requestId,
  });
});
