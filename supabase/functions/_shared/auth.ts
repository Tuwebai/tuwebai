import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { normalizeString } from './json.ts';

interface AuthenticatedAppUser {
  authUid: string;
  email: string;
  id: string;
}

const resolveAuthProvider = (providers: unknown): string => {
  if (!Array.isArray(providers) || providers.length === 0) {
    return 'unknown';
  }

  const [firstProvider] = providers;
  if (typeof firstProvider !== 'string') {
    return 'unknown';
  }

  return firstProvider === 'google' || firstProvider === 'email' ? firstProvider : firstProvider.trim() || 'unknown';
};

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

  if (appUserError) {
    throw new Error('app_user_not_found');
  }

  if (!appUser?.auth_uid) {
    const userId = crypto.randomUUID();
    const provider =
      resolveAuthProvider(authData.user.app_metadata?.providers) ||
      (typeof authData.user.app_metadata?.provider === 'string' ? authData.user.app_metadata.provider : 'unknown');
    const timestamp = new Date().toISOString();
    const username =
      typeof authData.user.user_metadata?.user_name === 'string'
        ? authData.user.user_metadata.user_name.trim()
        : typeof authData.user.user_metadata?.preferred_username === 'string'
          ? authData.user.user_metadata.preferred_username.trim()
          : null;
    const fullName =
      typeof authData.user.user_metadata?.full_name === 'string'
        ? authData.user.user_metadata.full_name.trim()
        : typeof authData.user.user_metadata?.name === 'string'
          ? authData.user.user_metadata.name.trim()
          : username;
    const imageUrl =
      typeof authData.user.user_metadata?.avatar_url === 'string'
        ? authData.user.user_metadata.avatar_url.trim()
        : null;

    const { error: insertUserError } = await serviceClient.from('users').insert({
      id: userId,
      auth_uid: authData.user.id,
      supabase_auth_user_id: authData.user.id,
      email,
      username,
      full_name: fullName,
      image_url: imageUrl,
      auth_provider: provider === 'email' ? 'password' : provider,
      role: 'user',
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    });

    if (insertUserError) {
      throw new Error('app_user_bootstrap_failed');
    }

    await serviceClient.from('user_preferences').insert({
      user_id: userId,
      email_notifications: true,
      newsletter: false,
      dark_mode: false,
      language: null,
      created_at: timestamp,
      updated_at: timestamp,
    });

    await serviceClient.from('user_privacy_settings').insert({
      user_id: userId,
      marketing_consent: false,
      analytics_consent: false,
      profile_email_visible: true,
      profile_status_visible: true,
      updated_by: 'self',
      created_at: timestamp,
      updated_at: timestamp,
    });

    return {
      authUid: authData.user.id,
      email,
      id: userId,
    };
  }

  return {
    authUid: appUser.auth_uid,
    email: appUser.email,
    id: appUser.id,
  };
};
