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
        .from('user_privacy_settings')
        .select('marketing_consent,analytics_consent,profile_email_visible,profile_status_visible,updated_at,updated_by')
        .eq('user_id', appUser.id)
        .limit(1)
        .maybeSingle<{
          analytics_consent: boolean;
          marketing_consent: boolean;
          profile_email_visible: boolean;
          profile_status_visible: boolean;
          updated_at: string;
          updated_by: 'self' | 'admin' | 'system';
        }>();

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudo obtener la privacidad.', requestId });
      }

      return buildJsonResponse(200, {
        success: true,
        data: {
          marketingConsent: data?.marketing_consent ?? false,
          analyticsConsent: data?.analytics_consent ?? false,
          profileEmailVisible: data?.profile_email_visible ?? true,
          profileStatusVisible: data?.profile_status_visible ?? true,
          updatedAt: data?.updated_at,
          updatedBy: data?.updated_by === 'self' ? 'self' : undefined,
        },
        requestId,
      });
    }

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      const { data: current } = await serviceClient
        .from('user_privacy_settings')
        .select('marketing_consent,analytics_consent,profile_email_visible,profile_status_visible')
        .eq('user_id', appUser.id)
        .limit(1)
        .maybeSingle<{
          analytics_consent: boolean;
          marketing_consent: boolean;
          profile_email_visible: boolean;
          profile_status_visible: boolean;
        }>();

      const next = {
        user_id: appUser.id,
        marketing_consent:
          typeof body?.marketingConsent === 'boolean'
            ? body.marketingConsent
            : (current?.marketing_consent ?? false),
        analytics_consent:
          typeof body?.analyticsConsent === 'boolean'
            ? body.analyticsConsent
            : (current?.analytics_consent ?? false),
        profile_email_visible:
          typeof body?.profileEmailVisible === 'boolean'
            ? body.profileEmailVisible
            : (current?.profile_email_visible ?? true),
        profile_status_visible:
          typeof body?.profileStatusVisible === 'boolean'
            ? body.profileStatusVisible
            : (current?.profile_status_visible ?? true),
        updated_by: 'self',
        updated_at: new Date().toISOString(),
      };

      const { error } = await serviceClient
        .from('user_privacy_settings')
        .upsert(next, { onConflict: 'user_id' });

      if (error) {
        return buildJsonResponse(500, { success: false, message: 'No se pudo actualizar la privacidad.', requestId });
      }

      return buildJsonResponse(200, {
        success: true,
        data: {
          marketingConsent: next.marketing_consent,
          analyticsConsent: next.analytics_consent,
          profileEmailVisible: next.profile_email_visible,
          profileStatusVisible: next.profile_status_visible,
          updatedAt: next.updated_at,
          updatedBy: 'self',
        },
        requestId,
      });
    }

    return buildJsonResponse(405, { success: false, message: 'Metodo no permitido.', requestId });
  } catch {
    return buildJsonResponse(401, { success: false, message: 'No autorizado.', requestId });
  }
});
