import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildCorsPreflightResponse, buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';
import { decodeNewsletterToken, getSubscriberDocumentId } from '../_shared/newsletter-token.ts';

interface NewsletterSubscriberRow {
  email: string;
  status: 'pending_confirmation' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  unsubscribed_at: string | null;
}

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return buildCorsPreflightResponse();
  }

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const token = normalizeString(body?.token);
  const sessionSecret = normalizeString(Deno.env.get('SESSION_SECRET'));
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!token || !sessionSecret || !supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(400, { success: false, message: 'El enlace de baja no es valido o ya vencio.', requestId });
  }

  const decoded = await decodeNewsletterToken(token, 'newsletter-unsubscribe', sessionSecret);
  if (!decoded) {
    return buildJsonResponse(400, { success: false, message: 'El enlace de baja no es valido o ya vencio.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('email,status,unsubscribed_at')
    .eq('external_subscriber_id', subscriberId)
    .maybeSingle<NewsletterSubscriberRow>();

  if (error || !subscriber) {
    return buildJsonResponse(404, {
      success: false,
      message: 'No encontramos una suscripcion activa para este enlace.',
      requestId,
    });
  }

  const nowIso = new Date().toISOString();
  const alreadyUnsubscribed = subscriber.status === 'unsubscribed';
  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: subscriber.unsubscribed_at ?? nowIso,
      updated_at: nowIso,
    })
    .eq('external_subscriber_id', subscriberId);

  if (updateError) {
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo procesar la baja en este momento.',
      requestId,
    });
  }

  try {
    await sendBrevoTransactionalEmail({
      senderEmail:
        normalizeEmail(Deno.env.get('NEWSLETTER_FROM_EMAIL')) ??
        normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ??
        normalizeEmail(Deno.env.get('SMTP_USER')) ??
        'news@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: 'Tu suscripcion al newsletter de TuWeb.ai fue cancelada',
      textContent: 'Tu baja del newsletter de TuWeb.ai se proceso correctamente.',
      to: subscriber.email,
    });
  } catch (emailError) {
    console.error('newsletter_unsubscribe.email_failed', {
      error: emailError instanceof Error ? emailError.message : String(emailError),
      requestId,
    });
  }

  return buildJsonResponse(200, {
    success: true,
    message: alreadyUnsubscribed
      ? 'Tu suscripcion ya estaba dada de baja.'
      : 'Tu email fue dado de baja correctamente.',
    requestId,
  });
});
