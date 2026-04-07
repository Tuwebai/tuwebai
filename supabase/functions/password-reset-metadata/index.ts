import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { buildJsonResponse, normalizeEmail, normalizeString } from '../_shared/json.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const email = normalizeEmail(body?.email);
  const passwordChangedAt = normalizeString(body?.passwordChangedAt);
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!email || !passwordChangedAt || !supabaseUrl || !serviceRoleKey) {
    return buildJsonResponse(400, { success: false, message: 'Payload invalido.', requestId });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { error } = await supabase
    .from('users')
    .update({
      password_changed_at: passwordChangedAt,
      updated_at: new Date().toISOString(),
    })
    .eq('email', email);

  if (error) {
    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo registrar el cambio de contrasena.',
      requestId,
    });
  }

  return buildJsonResponse(200, {
    success: true,
    message: 'Cambio de contrasena registrado.',
    requestId,
  });
});
