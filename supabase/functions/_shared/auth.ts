import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { normalizeString } from './json.ts';

interface AuthenticatedAppUser {
  authUid: string;
  email: string;
  id: string;
}

const createAuthClient = (request: Request) => {
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const anonKey = normalizeString(Deno.env.get('SUPABASE_ANON_KEY'));

  if (!supabaseUrl || !anonKey) {
    throw new Error('supabase_auth_env_missing');
  }

  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: request.headers.get('authorization') ?? '',
      },
    },
  });
};

export const createServiceClient = () => {
  const supabaseUrl = normalizeString(Deno.env.get('SUPABASE_URL'));
  const serviceRoleKey = normalizeString(Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('supabase_service_env_missing');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};

export const requireAuthenticatedAppUser = async (
  request: Request,
): Promise<AuthenticatedAppUser> => {
  const authClient = createAuthClient(request);
  const { data: authData, error: authError } = await authClient.auth.getUser();

  if (authError || !authData.user) {
    throw new Error('unauthorized');
  }

  const serviceClient = createServiceClient();
  const email = authData.user.email?.trim().toLowerCase() ?? '';

  const { data: appUser, error: appUserError } = await serviceClient
    .from('users')
    .select('id,auth_uid,email')
    .or(`supabase_auth_user_id.eq.${authData.user.id},email.eq.${email}`)
    .limit(1)
    .maybeSingle<{ auth_uid: string; email: string; id: string }>();

  if (appUserError || !appUser?.auth_uid) {
    throw new Error('app_user_not_found');
  }

  return {
    authUid: appUser.auth_uid,
    email: appUser.email,
    id: appUser.id,
  };
};
