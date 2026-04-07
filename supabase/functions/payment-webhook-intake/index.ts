import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { buildJsonResponse, normalizeString } from '../_shared/json.ts';

type JsonRecord = Record<string, unknown>;

const readObject = (value: unknown): JsonRecord | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;

const readString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const verifyWebhookSignature = async (payload: string, signature: string, secret: string): Promise<boolean> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, '0')).join('');
  return expected === signature;
};

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  const accessToken = normalizeString(Deno.env.get('MERCADOPAGO_ACCESS_TOKEN'));
  const webhookSecret = normalizeString(Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET'));

  if (!supabaseUrl || !serviceRoleKey || !accessToken) {
    return buildJsonResponse(503, { success: false, message: 'Mercado Pago no esta configurado.', requestId });
  }

  const rawBody = await request.text();
  const body = JSON.parse(rawBody || 'null') as { data?: { id?: string | number }; type?: string } | null;
  const paymentId = body?.data?.id;
  const eventType = body?.type;

  if (webhookSecret) {
    const providedSignature = normalizeString(request.headers.get('x-signature'));
    if (!providedSignature || !(await verifyWebhookSignature(rawBody, providedSignature, webhookSecret))) {
      return buildJsonResponse(401, { success: false, message: 'Webhook invalido.', requestId });
    }
  }

  if (!paymentId || eventType !== 'payment') {
    return buildJsonResponse(202, { success: true, message: 'Evento ignorado.', requestId });
  }

  const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  const paymentDetails = await mpResponse.json().catch(() => null) as JsonRecord | null;

  if (!mpResponse.ok || !paymentDetails) {
    return buildJsonResponse(502, { success: false, message: 'No se pudo consultar Mercado Pago.', requestId });
  }

  const paymentStatus = readString(paymentDetails.status);
  const paymentStatusDetail = readString(paymentDetails.status_detail);
  const externalPaymentId = readString(paymentDetails.id) ?? String(paymentId);
  const externalReference = readString(paymentDetails.external_reference);
  const metadata = readObject(paymentDetails.metadata);
  const payer = readObject(paymentDetails.payer);
  const receiptKey = requestId
    ? `request:${requestId}`
    : `payment:${String(paymentId)}:status:${paymentStatus ?? 'unknown'}:${paymentStatusDetail ?? 'unknown'}`;

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  const { error: receiptError } = await supabase.from('payment_webhook_receipts').insert({
    event_type: 'payment',
    payload: body ?? {},
    payment_status: paymentStatus,
    payment_status_detail: paymentStatusDetail,
    provider: 'mercadopago',
    provider_payment_id: String(paymentId),
    provider_request_id: requestId,
    receipt_key: receiptKey,
  });

  if (receiptError && !receiptError.message.includes('duplicate key value')) {
    return buildJsonResponse(500, { success: false, message: 'No se pudo registrar el webhook.', requestId });
  }

  if (receiptError?.message.includes('duplicate key value')) {
    return buildJsonResponse(200, { success: true, message: 'Webhook duplicado ignorado.', requestId });
  }

  const { error: paymentError } = await supabase.from('payments').upsert(
    {
      amount: readNumber(paymentDetails.transaction_amount),
      approved_at: readString(paymentDetails.date_approved),
      currency: readString(paymentDetails.currency_id),
      date:
        readString(paymentDetails.date_created) ??
        readString(paymentDetails.date_last_updated) ??
        new Date().toISOString(),
      external_payment_id: externalPaymentId,
      external_reference: externalReference,
      payer_email: readString(payer?.email),
      payment_method_id: readString(paymentDetails.payment_method_id),
      plan_code: externalReference?.match(/^tuwebai-([a-z]+)-\d+$/i)?.[1]?.toLowerCase() ?? null,
      provider: 'mercadopago',
      raw_data: paymentDetails,
      status: paymentStatus ?? 'unknown',
      status_detail: paymentStatusDetail,
      user_id: readString(metadata?.user_id) ?? readString(metadata?.user_uid) ?? readString(metadata?.uid),
    },
    { onConflict: 'external_payment_id' },
  );

  if (paymentError) {
    return buildJsonResponse(500, { success: false, message: 'No se pudo sincronizar el pago.', requestId });
  }

  return buildJsonResponse(200, {
    success: true,
    message: 'Webhook procesado.',
    requestId,
  });
});
