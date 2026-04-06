import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

type PublicSubmissionChannel = 'contact' | 'consulta' | 'propuesta' | 'applications';

interface PublicSubmissionPayload {
  channel: PublicSubmissionChannel;
  email?: string | null;
  message?: string | null;
  name?: string | null;
  payload: Record<string, unknown>;
  source?: string | null;
  status?: 'received';
  title?: string | null;
}

const allowedChannels: PublicSubmissionChannel[] = ['contact', 'consulta', 'propuesta', 'applications'];

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
} as const;

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parsePayload = (value: unknown): PublicSubmissionPayload | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (!allowedChannels.includes(value.channel as PublicSubmissionChannel)) {
    return null;
  }

  if (!isRecord(value.payload)) {
    return null;
  }

  return {
    channel: value.channel as PublicSubmissionChannel,
    email: normalizeString(value.email)?.toLowerCase() ?? null,
    message: normalizeString(value.message),
    name: normalizeString(value.name),
    payload: value.payload,
    source: normalizeString(value.source) ?? 'website',
    status: 'received',
    title: normalizeString(value.title),
  };
};

const buildUnauthorizedResponse = () =>
  new Response(JSON.stringify({ success: false, message: 'No autorizado.' }), {
    headers: jsonHeaders,
    status: 401,
  });

const buildJsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    headers: jsonHeaders,
    status,
  });

Deno.serve(async (request) => {
  const requestId = request.headers.get('x-request-id')?.trim() || crypto.randomUUID();

  if (request.method !== 'POST') {
    return buildJsonResponse(405, {
      success: false,
      message: 'Metodo no permitido.',
      requestId,
    });
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  const authHeader = request.headers.get('authorization')?.trim();

  if (!serviceRoleKey || authHeader !== `Bearer ${serviceRoleKey}`) {
    console.error('public_submission_intake.unauthorized', { requestId });
    return buildUnauthorizedResponse();
  }

  const parsedBody = parsePayload(await request.json().catch(() => null));

  if (!parsedBody) {
    console.warn('public_submission_intake.invalid_payload', { requestId });
    return buildJsonResponse(400, {
      success: false,
      message: 'Payload invalido.',
      requestId,
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();

  if (!supabaseUrl) {
    console.error('public_submission_intake.missing_supabase_url', { requestId });
    return buildJsonResponse(500, {
      success: false,
      message: 'Supabase no esta configurado.',
      requestId,
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from('public_submissions')
    .insert(parsedBody)
    .select('id')
    .single();

  if (error) {
    console.error('public_submission_intake.insert_failed', {
      requestId,
      code: error.code,
      message: error.message,
    });

    return buildJsonResponse(500, {
      success: false,
      message: 'No se pudo guardar la solicitud.',
      requestId,
    });
  }

  console.info('public_submission_intake.accepted', {
    channel: parsedBody.channel,
    requestId,
    submissionId: data.id,
  });

  return buildJsonResponse(202, {
    success: true,
    data: {
      id: data.id,
    },
    requestId,
  });
});
