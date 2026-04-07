import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendBrevoTransactionalEmail } from '../_shared/brevo.ts';
import { buildCorsPreflightResponse, buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';
import { encodeNewsletterToken, getSubscriberDocumentId } from '../_shared/newsletter-token.ts';

type SubscriberStatus = 'pending_confirmation' | 'subscribed';

interface NewsletterSubscriberRow {
  confirmed_at: string | null;
  created_at: string;
  email: string;
  email_normalized: string;
  first_source: string;
  last_source: string;
  sources: string[] | null;
  status: SubscriberStatus;
  submission_count: number;
}

const parsePayload = async (request: Request): Promise<{ email: string; source: string } | null> => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) {
    return null;
  }

  const email = normalizeEmail(body.email);
  const source = normalizeString(body.source) ?? 'website';

  if (!email) {
    return null;
  }

  return { email, source };
};

const uniqueSources = (sources: string[]): string[] => Array.from(new Set(sources.filter(Boolean)));

const buildConfirmationEmail = (confirmationUrl: string) => ({
  htmlContent: [
    '<h1>Confirma tu suscripcion</h1>',
    '<p>Recibimos tu solicitud para sumarte al newsletter de TuWeb.ai.</p>',
    `<p><a href="${confirmationUrl}">Confirmar suscripcion</a></p>`,
    '<p>Si no solicitaste esta suscripcion, podes ignorar este mensaje.</p>',
  ].join(''),
  textContent: [
    'Recibimos tu solicitud para sumarte al newsletter de TuWeb.ai.',
    '',
    'Confirma tu suscripcion desde este enlace:',
    confirmationUrl,
    '',
    'Si no solicitaste esta suscripcion, podes ignorar este mensaje.',
  ].join('\n'),
});

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
  const sessionSecret = normalizeString(Deno.env.get('SESSION_SECRET'));
  const frontendUrl = normalizeString(Deno.env.get('FRONTEND_URL')) ?? 'https://tuweb-ai.com';

  if (!supabaseUrl || !serviceRoleKey || !sessionSecret) {
    return buildJsonResponse(500, { success: false, message: 'Newsletter no esta configurado.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const emailNormalized = payload.email;
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const nowIso = new Date().toISOString();
  const { data: existing, error: existingError } = await supabase
    .from('newsletter_subscribers')
    .select('email,email_normalized,status,created_at,confirmed_at,first_source,last_source,sources,submission_count')
    .eq('external_subscriber_id', subscriberId)
    .maybeSingle<NewsletterSubscriberRow>();

  if (existingError) {
    console.error('newsletter_subscribe.lookup_failed', { code: existingError.code, message: existingError.message, requestId });
    return buildJsonResponse(500, { success: false, message: 'No se pudo procesar la suscripcion.', requestId });
  }

  const row = {
    email: existing?.email ?? emailNormalized,
    email_normalized: emailNormalized,
    status: (existing?.status === 'subscribed' ? 'subscribed' : 'pending_confirmation') as SubscriberStatus,
    created_at: existing?.created_at ?? nowIso,
    updated_at: nowIso,
    last_submitted_at: nowIso,
    first_source: existing?.first_source ?? payload.source,
    last_source: payload.source,
    sources: uniqueSources([...(existing?.sources ?? []), payload.source]),
    submission_count: typeof existing?.submission_count === 'number' ? existing.submission_count + 1 : 1,
    consent_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
    consent_user_agent: normalizeString(request.headers.get('user-agent')),
    consent_submitted_at: nowIso,
    external_subscriber_id: subscriberId,
    confirmed_at: existing?.status === 'subscribed' ? existing.confirmed_at ?? nowIso : null,
  };

  const { error: upsertError } = await supabase
    .from('newsletter_subscribers')
    .upsert(row, { onConflict: 'email_normalized' });

  if (upsertError) {
    console.error('newsletter_subscribe.upsert_failed', { code: upsertError.code, message: upsertError.message, requestId });
    return buildJsonResponse(500, { success: false, message: 'No se pudo procesar la suscripcion.', requestId });
  }

  const confirmationToken = await encodeNewsletterToken(emailNormalized, 'newsletter-confirmation', sessionSecret);
  const confirmationUrl = `${frontendUrl.replace(/\/+$/, '')}/newsletter/confirm/${encodeURIComponent(confirmationToken)}`;
  const emailContent = buildConfirmationEmail(confirmationUrl);

  try {
    await sendBrevoTransactionalEmail({
      htmlContent: emailContent.htmlContent,
      senderEmail:
        normalizeEmail(Deno.env.get('NEWSLETTER_FROM_EMAIL')) ??
        normalizeEmail(Deno.env.get('SMTP_FROM_EMAIL')) ??
        normalizeEmail(Deno.env.get('SMTP_USER')) ??
        'news@tuweb-ai.com',
      senderName: normalizeString(Deno.env.get('SMTP_FROM_NAME')) ?? 'TuWeb.ai',
      subject: 'Confirma tu suscripcion al newsletter de TuWeb.ai',
      textContent: emailContent.textContent,
      to: emailNormalized,
    });
  } catch (error) {
    console.error('newsletter_subscribe.email_failed', {
      error: error instanceof Error ? error.message : String(error),
      requestId,
    });
    return buildJsonResponse(500, { success: false, message: 'No se pudo enviar el email de confirmacion.', requestId });
  }

  return buildJsonResponse(202, {
    success: true,
    message: 'Suscripcion registrada. Procesaremos la confirmacion en breve.',
    requestId,
  });
});
