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

    const { data, error } = await serviceClient
      .from('projects')
      .select('id,user_id,owner_email,name,type,description,priority,start_date,estimated_end_date,overall_progress,status,phases,attachments,created_at,updated_at')
      .or(`user_id.eq.${appUser.id},user_id.eq.${appUser.authUid}`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle<{
        attachments: Record<string, unknown>[] | null;
        created_at: string;
        description: string | null;
        estimated_end_date: string | null;
        id: string;
        name: string;
        overall_progress: number;
        owner_email: string | null;
        phases: Record<string, unknown>[] | null;
        priority: string | null;
        start_date: string | null;
        status: 'active' | 'completed' | 'on-hold';
        type: string;
        updated_at: string;
        user_id: string | null;
      }>();

    if (error) {
      return buildJsonResponse(500, { success: false, message: 'No se pudo obtener el proyecto.', requestId });
    }

    return buildJsonResponse(200, {
      success: true,
      data: data
        ? {
            id: data.id,
            userId: data.user_id ?? undefined,
            ownerEmail: data.owner_email ?? undefined,
            name: data.name,
            type: data.type,
            description: data.description ?? undefined,
            priority: data.priority ?? undefined,
            startDate: data.start_date ?? undefined,
            estimatedEndDate: data.estimated_end_date ?? undefined,
            overallProgress: data.overall_progress,
            status: data.status,
            phases: Array.isArray(data.phases) ? data.phases : [],
            attachments: Array.isArray(data.attachments) ? data.attachments : [],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          }
        : null,
      requestId,
    });
  } catch {
    return buildJsonResponse(401, { success: false, message: 'No autorizado.', requestId });
  }
});
