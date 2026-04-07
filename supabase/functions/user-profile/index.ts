import { buildJsonResponse, normalizeString } from '../_shared/json.ts';
import { createServiceClient, requireAuthenticatedAppUser } from '../_shared/auth.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  try {
    const appUser = await requireAuthenticatedAppUser(request);
    const serviceClient = createServiceClient();

    if (request.method === 'GET') {
      const { data, error } = await serviceClient
        .from('users')
        .select('auth_uid,email,username,full_name,image_url,auth_provider,password_changed_at,role,is_active,project_id,created_at,updated_at')
        .eq('auth_uid', appUser.authUid)
        .limit(1)
        .maybeSingle<{
          auth_uid: string;
          auth_provider: string;
          created_at: string;
          email: string;
          full_name: string | null;
          image_url: string | null;
          is_active: boolean;
          password_changed_at: string | null;
          project_id: string | null;
          role: string;
          updated_at: string;
          username: string | null;
        }>();

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudo obtener el usuario.', requestId });
      }

      return buildJsonResponse(200, {
        success: true,
        data: data
          ? {
              uid: data.auth_uid,
              email: data.email,
              username: data.username ?? undefined,
              name: data.full_name ?? data.username ?? undefined,
              image: data.image_url ?? undefined,
              authProvider:
                data.auth_provider === 'password' || data.auth_provider === 'google'
                  ? data.auth_provider
                  : undefined,
              passwordChangedAt: data.password_changed_at,
              role: data.role,
              isActive: data.is_active,
              projectId: data.project_id ?? undefined,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            }
          : null,
        requestId,
      });
    }

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      const update = {
        email: normalizeString(body?.email)?.toLowerCase() ?? appUser.email,
        username: normalizeString(body?.username),
        full_name: normalizeString(body?.name) ?? normalizeString(body?.username),
        image_url: normalizeString(body?.image),
        updated_at: new Date().toISOString(),
      };

      const { error } = await serviceClient
        .from('users')
        .update(update)
        .eq('auth_uid', appUser.authUid);

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudo actualizar el usuario.', requestId });
      }

      return buildJsonResponse(200, { success: true, requestId });
    }

    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return buildJsonResponse(message === 'unauthorized' ? 401 : 403, {
      success: false,
      message: 'No autorizado.',
      requestId,
    });
  }
});
