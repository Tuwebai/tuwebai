import { buildJsonResponse } from '../_shared/json.ts';
import { createServiceClient, requireAuthenticatedAppUser } from '../_shared/auth.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  try {
    const appUser = await requireAuthenticatedAppUser(request);
    const serviceClient = createServiceClient();
    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get('limit') ?? '0');
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.floor(limitParam) : null;

    const { data, error } = await serviceClient
      .from('payments')
      .select('*')
      .or(`user_id.eq.${appUser.id},user_id.eq.${appUser.authUid}`)
      .order('date', { ascending: false })
      .limit(limit ?? 100);

    if (error) {
      return buildJsonResponse(500, { success: false, message: 'No se pudieron obtener pagos.', requestId });
    }

    return buildJsonResponse(200, {
      success: true,
      data: data ?? [],
      requestId,
    });
  } catch {
    return buildJsonResponse(401, { success: false, message: 'No autorizado.', requestId });
  }
});
