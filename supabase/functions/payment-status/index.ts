import { buildCorsPreflightResponse, buildJsonResponse, normalizeString } from '../_shared/json.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return buildCorsPreflightResponse();
  }

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const paymentId = normalizeString(body?.paymentId);
  const accessToken = normalizeString(Deno.env.get('MERCADOPAGO_ACCESS_TOKEN'));

  if (!paymentId || !accessToken) {
    return buildJsonResponse(400, { success: false, message: 'paymentId invalido.', requestId });
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

  const data = await response.json().catch(() => null) as Record<string, unknown> | null;

  if (!response.ok || !data) {
    return buildJsonResponse(404, { success: false, message: 'No se pudo obtener el estado del pago.', requestId });
  }

  return buildJsonResponse(200, {
    success: true,
    data: {
      id: data.id ?? null,
      status: data.status ?? null,
      status_detail: data.status_detail ?? null,
      transaction_amount: data.transaction_amount ?? null,
      currency_id: data.currency_id ?? null,
      date_approved: data.date_approved ?? null,
      payment_method_id: data.payment_method_id ?? null,
    },
    requestId,
  });
});
