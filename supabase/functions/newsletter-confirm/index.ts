import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildCorsPreflightResponse, buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';
import {
  decodeNewsletterToken,
  encodeNewsletterToken,
  getSubscriberDocumentId,
} from '../_shared/newsletter-token.ts';

interface NewsletterSubscriberRow {
  confirmed_at: string | null;
  email: string;
  last_source: string;
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
  const frontendUrl = normalizeString(Deno.env.get('FRONTEND_URL')) ?? 'https://tuweb-ai.com';
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!token || !sessionSecret || !supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(400, { success: false, message: 'El enlace de confirmacion no es valido o ya vencio.', requestId });
  }

  const decoded = await decodeNewsletterToken(token, 'newsletter-confirmation', sessionSecret);
  if (!decoded) {
    return buildJsonResponse(400, { success: false, message: 'El enlace de confirmacion no es valido o ya vencio.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('email,status,confirmed_at,unsubscribed_at,last_source')
    .eq('external_subscriber_id', subscriberId)
    .maybeSingle<NewsletterSubscriberRow>();

  if (error || !subscriber) {
    return buildJsonResponse(404, {
      success: false,
      message: 'No encontramos una suscripcion pendiente para este enlace.',
      requestId,
    });
  }

  const nowIso = new Date().toISOString();
  const justConfirmed = subscriber.status !== 'subscribed';
  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update({
      confirmed_at: subscriber.confirmed_at ?? nowIso,
      status: 'subscribed',
      unsubscribed_at: null,
      updated_at: nowIso,
    })
    .eq('external_subscriber_id', subscriberId);

  if (updateError) {
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo confirmar la suscripcion en este momento.',
      requestId,
    });
  }

  const unsubscribeToken = await encodeNewsletterToken(
    decoded.emailNormalized,
    'newsletter-unsubscribe',
    sessionSecret,
  );

  if (justConfirmed) {
    try {
      await sendBrevoTransactionalEmail({
        senderEmail:
          normalizeEmail(Deno.env.get('NEWSLETTER_FROM_EMAIL')) ??
          normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ??
          normalizeEmail(Deno.env.get('SMTP_USER')) ??
          'news@tuweb-ai.com',
        senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
        subject: 'Bienvenido al newsletter de TuWeb.ai',
        textContent: [
          'Tu suscripcion al newsletter de TuWeb.ai ya quedo activa.',
          '',
          'Podes empezar desde el blog:',
          `${frontendUrl.replace(/\/+$/, '')}/blog`,
        ].join('\n'),
        to: subscriber.email,
      });
    } catch (emailError) {
      console.error('newsletter_confirm.welcome_email_failed', {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        requestId,
      });
    }
  }

  return buildJsonResponse(200, {
    success: true,
    message: justConfirmed
      ? 'Tu email fue confirmado correctamente. Ya quedaste suscripto.'
      : 'Tu suscripcion ya estaba confirmada.',
    unsubscribeToken,
    justConfirmed,
    requestId,
  });
});
