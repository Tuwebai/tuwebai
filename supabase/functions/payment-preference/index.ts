import { buildJsonResponse, normalizeString } from '../_shared/json.ts';

const paymentPlanConfig = {
  avanzado: { title: 'Web Comercial', unitPrice: 780000 },
  esencial: { title: 'Presencia Profesional', unitPrice: 420000 },
  premium: { title: 'Sistema a Medida', unitPrice: 1400000 },
} as const;

type PaymentPlan = keyof typeof paymentPlanConfig;

const parsePayload = async (request: Request): Promise<{ plan: PaymentPlan } | null> => {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) {
    return null;
  }

  const plan = normalizeString(body.plan);
  if (!plan || !(plan in paymentPlanConfig)) {
    return null;
  }

  return { plan: plan as PaymentPlan };
};

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const payload = await parsePayload(request);
  if (!payload) {
    return buildJsonResponse(400, { success: false, message: 'Plan invalido.', requestId });
  }

  const accessToken = normalizeString(Deno.env.get('MERCADOPAGO_ACCESS_TOKEN'));
  const frontendUrl = normalizeString(Deno.env.get('FRONTEND_URL')) ?? 'https://tuweb-ai.com';
  const backendUrl = normalizeString(Deno.env.get('BACKEND_URL'));

  if (!accessToken) {
    return buildJsonResponse(503, { success: false, message: 'Mercado Pago no esta configurado.', requestId });
  }

  const plan = paymentPlanConfig[payload.plan];
  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
      'X-Idempotency-Key': requestId,
    },
    body: JSON.stringify({
      items: [
        {
          id: payload.plan,
          title: plan.title,
          unit_price: plan.unitPrice,
          quantity: 1,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: `${frontendUrl.replace(/\/+$/, '')}/pago-exitoso`,
        failure: `${frontendUrl.replace(/\/+$/, '')}/pago-fallido`,
        pending: `${frontendUrl.replace(/\/+$/, '')}/pago-pendiente`,
      },
      auto_return: 'approved',
      ...(backendUrl ? { notification_url: `${backendUrl.replace(/\/+$/, '')}/webhook/mercadopago` } : {}),
      external_reference: `tuwebai-${payload.plan}-${Date.now()}`,
    }),
  });

  const body = await response.json().catch(() => null) as { init_point?: string; message?: string } | null;
  if (!response.ok || !body?.init_point) {
    return buildJsonResponse(response.status >= 400 ? response.status : 500, {
      success: false,
      message: body?.message || 'Error al crear preferencia de pago.',
      requestId,
    });
  }

  return buildJsonResponse(200, {
    init_point: body.init_point,
    requestId,
    success: true,
  });
});
