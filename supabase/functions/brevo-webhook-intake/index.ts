import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

type NewsletterProviderEvent = 'hard_bounce' | 'soft_bounce' | 'complaint' | 'unsubscribe';
type SubscriberStatus = 'pending_confirmation' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
type SubscriptionEventType = 'unsubscribed' | 'bounced' | 'complained';

interface NewsletterSubscriberRow {
  id: string;
  status: SubscriberStatus;
  unsubscribed_at: string | null;
  bounced_at: string | null;
  complained_at: string | null;
}

interface BrevoWebhookPayload {
  email: string;
  event: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
} as const;

const mapBrevoEvent = (event: string): NewsletterProviderEvent | null => {
  const normalized = event.trim().toLowerCase();

  if (normalized.includes('hard') && normalized.includes('bounce')) return 'hard_bounce';
  if (normalized.includes('soft') && normalized.includes('bounce')) return 'soft_bounce';
  if (normalized.includes('spam') || normalized.includes('complaint')) return 'complaint';
  if (normalized.includes('unsubscribe')) return 'unsubscribe';

  return null;
};

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const buildJsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    headers: jsonHeaders,
    status,
  });

const isBrevoWebhookPayload = (value: unknown): value is BrevoWebhookPayload =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Record<string, unknown>).email === 'string' &&
  typeof (value as Record<string, unknown>).event === 'string';

const resolveReceiptKey = async (rawBody: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawBody));
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
};

const resolveNextSubscriberState = (
  subscriber: NewsletterSubscriberRow,
  providerEvent: NewsletterProviderEvent,
  nowIso: string,
) => ({
  status:
    providerEvent === 'complaint'
      ? 'complained'
      : providerEvent === 'unsubscribe'
        ? 'unsubscribed'
        : 'bounced',
  unsubscribed_at:
    providerEvent === 'unsubscribe' ? subscriber.unsubscribed_at || nowIso : subscriber.unsubscribed_at,
  bounced_at:
    providerEvent === 'hard_bounce' || providerEvent === 'soft_bounce'
      ? subscriber.bounced_at || nowIso
      : subscriber.bounced_at,
  complained_at: providerEvent === 'complaint' ? subscriber.complained_at || nowIso : subscriber.complained_at,
  updated_at: nowIso,
});

const resolveEventType = (providerEvent: NewsletterProviderEvent): SubscriptionEventType => {
  if (providerEvent === 'complaint') {
    return 'complained';
  }

  if (providerEvent === 'unsubscribe') {
    return 'unsubscribed';
  }

  return 'bounced';
};

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, {
      success: false,
      message: 'Metodo no permitido.',
      requestId,
    });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  const authHeader = request.headers.get('authorization')?.trim();
  const webhookToken = Deno.env.get('BREVO_WEBHOOK_TOKEN')?.trim();
  const providedWebhookToken = request.headers.get('x-brevo-webhook-token')?.trim() || '';

  if (!serviceRoleKey || authHeader !== `Bearer ${serviceRoleKey}`) {
    console.error('brevo_webhook_intake.unauthorized_service', { requestId });
    return buildJsonResponse(401, {
      success: false,
      message: 'No autorizado.',
      requestId,
    });
  }

  if (webhookToken && providedWebhookToken !== webhookToken) {
    console.warn('brevo_webhook_intake.invalid_token', { requestId });
    return buildJsonResponse(401, {
      success: false,
      message: 'Webhook no autorizado.',
      requestId,
    });
  }

  const rawBody = await request.text();
  const parsedBody = JSON.parse(rawBody || 'null') as unknown;

  if (!isBrevoWebhookPayload(parsedBody)) {
    console.warn('brevo_webhook_intake.invalid_payload', { requestId });
    return buildJsonResponse(400, {
      success: false,
      message: 'Payload invalido.',
      requestId,
    });
  }

  const providerEvent = mapBrevoEvent(parsedBody.event);
  if (!providerEvent) {
    return buildJsonResponse(202, {
      success: true,
      message: 'Evento ignorado.',
      requestId,
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();
  if (!supabaseUrl) {
    console.error('brevo_webhook_intake.missing_supabase_url', { requestId });
    return buildJsonResponse(500, {
      success: false,
      message: 'Supabase no esta configurado.',
      requestId,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const emailNormalized = normalizeEmail(parsedBody.email);
  const receiptKey = await resolveReceiptKey(rawBody);
  const receiptSource = `brevo_webhook:${receiptKey}`;

  const { data: subscriber, error: subscriberError } = await supabase
    .from('newsletter_subscribers')
    .select('id,status,unsubscribed_at,bounced_at,complained_at')
    .eq('email_normalized', emailNormalized)
    .maybeSingle<NewsletterSubscriberRow>();

  if (subscriberError) {
    console.error('brevo_webhook_intake.subscriber_lookup_failed', {
      requestId,
      code: subscriberError.code,
      message: subscriberError.message,
    });
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo procesar el webhook de Brevo.',
      requestId,
    });
  }

  if (!subscriber) {
    return buildJsonResponse(404, {
      success: false,
      message: 'No encontramos un suscriptor para este evento.',
      requestId,
    });
  }

  const { data: duplicateEvent, error: duplicateLookupError } = await supabase
    .from('newsletter_subscription_events')
    .select('id')
    .eq('subscriber_id', subscriber.id)
    .eq('source', receiptSource)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (duplicateLookupError) {
    console.error('brevo_webhook_intake.receipt_lookup_failed', {
      requestId,
      code: duplicateLookupError.code,
      message: duplicateLookupError.message,
    });
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo procesar el webhook de Brevo.',
      requestId,
    });
  }

  if (duplicateEvent) {
    return buildJsonResponse(200, {
      success: true,
      message: 'Webhook duplicado ignorado.',
      requestId,
    });
  }

  const nowIso = new Date().toISOString();
  const nextState = resolveNextSubscriberState(subscriber, providerEvent, nowIso);
  const eventType = resolveEventType(providerEvent);

  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update(nextState)
    .eq('id', subscriber.id);

  if (updateError) {
    console.error('brevo_webhook_intake.subscriber_update_failed', {
      requestId,
      code: updateError.code,
      message: updateError.message,
    });
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo procesar el webhook de Brevo.',
      requestId,
    });
  }

  const { error: eventInsertError } = await supabase.from('newsletter_subscription_events').insert({
    subscriber_id: subscriber.id,
    event_type: eventType,
    source: receiptSource,
    event_at: nowIso,
    payload: {
      provider: 'brevo',
      providerEvent,
      rawEvent: parsedBody.event,
      receiptKey,
      requestId,
    },
  });

  if (eventInsertError) {
    console.error('brevo_webhook_intake.event_insert_failed', {
      requestId,
      code: eventInsertError.code,
      message: eventInsertError.message,
    });
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo procesar el webhook de Brevo.',
      requestId,
    });
  }

  console.info('brevo_webhook_intake.accepted', {
    emailNormalized,
    eventType,
    requestId,
    subscriberId: subscriber.id,
  });

  return buildJsonResponse(200, {
    success: true,
    message: 'Evento de proveedor aplicado correctamente.',
    requestId,
  });
});
