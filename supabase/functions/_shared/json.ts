export const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-request-id, x-signature, x-brevo-webhook-token',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
} as const;

export const buildJsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    headers: jsonHeaders,
    status,
  });

export const buildCorsPreflightResponse = () =>
  new Response('ok', {
    headers: jsonHeaders,
    status: 200,
  });

export const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

export const normalizeEmail = (value: unknown): string | null => {
  const normalized = normalizeString(value)?.toLowerCase() ?? null;
  if (!normalized || !/^\S+@\S+\.\S+$/.test(normalized)) {
    return null;
  }

  return normalized;
};
