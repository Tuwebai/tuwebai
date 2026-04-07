import { buildCorsPreflightResponse, buildJsonResponse } from '../_shared/json.ts';
import { createServiceClient, requireAuthenticatedAppUser } from '../_shared/auth.ts';

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method === 'OPTIONS') {
    return buildCorsPreflightResponse();
  }

  try {
    const appUser = await requireAuthenticatedAppUser(request);
    const serviceClient = createServiceClient();

    if (request.method === 'GET') {
      const { data, error } = await serviceClient
        .from('user_preferences')
        .select('email_notifications,newsletter,dark_mode,language,updated_at')
        .eq('user_id', appUser.id)
        .limit(1)
        .maybeSingle<{
          dark_mode: boolean;
          email_notifications: boolean;
          language: string | null;
          newsletter: boolean;
          updated_at: string;
        }>();

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudieron obtener preferencias.', requestId });
      }

      return buildJsonResponse(200, {
        success: true,
        data: data
          ? {
              emailNotifications: data.email_notifications,
              newsletter: data.newsletter,
              darkMode: data.dark_mode,
              language: data.language ?? undefined,
              updatedAt: data.updated_at,
            }
          : null,
        requestId,
      });
    }

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      const { data: current } = await serviceClient
        .from('user_preferences')
        .select('email_notifications,newsletter,dark_mode,language')
        .eq('user_id', appUser.id)
        .limit(1)
        .maybeSingle<{
          dark_mode: boolean;
          email_notifications: boolean;
          language: string | null;
          newsletter: boolean;
        }>();

      const next = {
        user_id: appUser.id,
        email_notifications:
          typeof body?.emailNotifications === 'boolean'
            ? body.emailNotifications
            : (current?.email_notifications ?? true),
        newsletter:
          typeof body?.newsletter === 'boolean'
            ? body.newsletter
            : (current?.newsletter ?? false),
        dark_mode:
          typeof body?.darkMode === 'boolean'
            ? body.darkMode
            : (current?.dark_mode ?? false),
        language:
          typeof body?.language === 'string'
            ? body.language
            : (current?.language ?? null),
        updated_at: new Date().toISOString(),
      };

      const { error } = await serviceClient.from('user_preferences').upsert(next, { onConflict: 'user_id' });

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudieron actualizar preferencias.', requestId });
      }

      return buildJsonResponse(200, {
        success: true,
        data: {
          emailNotifications: next.email_notifications,
          newsletter: next.newsletter,
          darkMode: next.dark_mode,
          language: next.language ?? undefined,
          updatedAt: next.updated_at,
        },
        requestId,
      });
    }

    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  } catch {
    return buildJsonResponse(401, { success: false, message: 'No autorizado.', requestId });
  }
});
