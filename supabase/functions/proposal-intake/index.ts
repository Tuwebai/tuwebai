import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
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
  const nombre = normalizeString(body?.nombre);
  const email = normalizeEmail(body?.email);
  const tipoProyecto = normalizeString(body?.tipo_proyecto);
  const servicios = normalizeString(body?.servicios);
  const presupuesto = normalizeString(body?.presupuesto);
  const plazo = normalizeString(body?.plazo);
  const detalles = normalizeString(body?.detalles);
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!nombre || !email || !tipoProyecto || !detalles || !supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(400, { success: false, message: 'Payload invalido.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const payload = {
    nombre,
    email,
    tipo_proyecto: tipoProyecto,
    servicios,
    presupuesto,
    plazo,
    detalles,
    source: 'website',
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase.from('public_submissions').insert({
    channel: 'propuesta',
    email,
    message: detalles,
    name: nombre,
    payload,
    source: 'website',
    status: 'received',
    title: 'Nueva solicitud de propuesta',
  });

  if (error) {
    return buildJsonResponse(500, { success: false, message: 'No se pudo procesar la solicitud en este momento.', requestId });
  }

  try {
    await sendBrevoTransactionalEmail({
      senderEmail: normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'no-reply@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: 'Nueva solicitud de propuesta',
      textContent: [
        'Nueva solicitud de propuesta',
        `Nombre: ${nombre}`,
        `Email: ${email}`,
        `Tipo de proyecto: ${tipoProyecto}`,
        `Servicios: ${servicios || 'No especificado'}`,
        `Presupuesto: ${presupuesto || 'No especificado'}`,
        `Plazo: ${plazo || 'No especificado'}`,
        '',
        'Detalles:',
        detalles,
      ].join('\n'),
      to: normalizeEmail(Deno.env.get('CONTACT_TO_EMAIL')) ?? normalizeEmail(Deno.env.get('SMTP_USER')) ?? 'hola@tuweb-ai.com',
    });
  } catch {}

  return buildJsonResponse(202, {
    success: true,
    message: 'Solicitud recibida. Procesaremos tu propuesta en breve.',
    requestId,
  });
});
