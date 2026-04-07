import { supabaseConfig } from '../../config/supabase';
import type { ServerAuthProvider } from '../../core/auth/server-auth-provider';
import type { AuthUser } from '../../shared/types/auth-user';
import { supabaseAdminRestRequest } from '../database/supabase/supabase-admin-rest';

interface SupabaseAuthApiUser {
  app_metadata?: Record<string, unknown>;
  email?: string;
  id: string;
  role?: string;
  user_metadata?: Record<string, unknown>;
}

interface AppUserLookupRow {
  id: string;
  email: string;
  legacy_auth_uid: string;
  role: string;
  supabase_auth_user_id: string | null;
}

const SUPABASE_AUTH_TIMEOUT_MS = 8000;
const APP_USER_SELECT = 'id,legacy_auth_uid,email,role,supabase_auth_user_id';

const resolveClaimRole = (authUser: SupabaseAuthApiUser): 'admin' | 'user' | null => {
  const appMetadataRole = authUser.app_metadata?.role;
  const directRole = authUser.role;
  const userMetadataRole = authUser.user_metadata?.role;
  const candidate = [appMetadataRole, directRole, userMetadataRole].find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );

  if (typeof candidate !== 'string') {
    return null;
  }

  return candidate.trim().toLowerCase() === 'admin' ? 'admin' : 'user';
};

const buildSupabaseAuthHeaders = (token: string): Record<string, string> => ({
  apikey: supabaseConfig.anonKey ?? supabaseConfig.serviceRoleKey!,
  Authorization: `Bearer ${token}`,
});

const fetchSupabaseAuthUser = async (token: string): Promise<SupabaseAuthApiUser> => {
  if (!supabaseConfig.url || (!supabaseConfig.anonKey && !supabaseConfig.serviceRoleKey)) {
    throw new Error('auth_provider_unavailable');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUPABASE_AUTH_TIMEOUT_MS);

  try {
    const response = await fetch(`${supabaseConfig.url}/auth/v1/user`, {
      headers: buildSupabaseAuthHeaders(token),
      method: 'GET',
      signal: controller.signal,
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('invalid_auth_token');
    }

    if (!response.ok) {
      throw new Error(`supabase_auth_verify_failed_${response.status}`);
    }

    return (await response.json()) as SupabaseAuthApiUser;
  } finally {
    clearTimeout(timeout);
  }
};

const findAppUserBySupabaseAuthId = async (
  supabaseAuthUserId: string,
): Promise<AppUserLookupRow | null> => {
  const rows = await supabaseAdminRestRequest<AppUserLookupRow[]>(
    `/users?select=${APP_USER_SELECT}&supabase_auth_user_id=eq.${encodeURIComponent(supabaseAuthUserId)}&limit=1`,
  );

  return rows[0] ?? null;
};

const findAppUserByEmail = async (email: string): Promise<AppUserLookupRow | null> => {
  const rows = await supabaseAdminRestRequest<AppUserLookupRow[]>(
    `/users?select=${APP_USER_SELECT}&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&limit=1`,
  );

  return rows[0] ?? null;
};

const linkSupabaseAuthUser = async (legacyAuthUid: string, supabaseAuthUserId: string): Promise<void> => {
  await supabaseAdminRestRequest<void>(
    `/users?legacy_auth_uid=eq.${encodeURIComponent(legacyAuthUid)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        supabase_auth_user_id: supabaseAuthUserId,
      }),
    },
  );
};

const resolveAppAuthUser = async (authUser: SupabaseAuthApiUser): Promise<AuthUser> => {
  const claimRole = resolveClaimRole(authUser);
  const directMatch = await findAppUserBySupabaseAuthId(authUser.id);
  if (directMatch) {
    const role = directMatch.role === 'admin' || claimRole === 'admin' ? 'admin' : 'user';
    return {
      appUserId: directMatch.id,
      uid: directMatch.legacy_auth_uid,
      authUserId: directMatch.supabase_auth_user_id ?? authUser.id,
      email: directMatch.email,
      admin: role === 'admin',
      role,
    };
  }

  const normalizedEmail = authUser.email?.trim().toLowerCase();
  if (!normalizedEmail) {
    const role = claimRole ?? 'user';
    return {
      uid: authUser.id,
      authUserId: authUser.id,
      admin: role === 'admin',
      role,
    };
  }

  const emailMatch = await findAppUserByEmail(normalizedEmail);
  if (!emailMatch) {
    const role = claimRole ?? 'user';
    return {
      uid: authUser.id,
      authUserId: authUser.id,
      email: normalizedEmail,
      admin: role === 'admin',
      role,
    };
  }

  if (!emailMatch.supabase_auth_user_id) {
    await linkSupabaseAuthUser(emailMatch.legacy_auth_uid, authUser.id);
  }

  const role = emailMatch.role === 'admin' || claimRole === 'admin' ? 'admin' : 'user';
  return {
    appUserId: emailMatch.id,
    uid: emailMatch.legacy_auth_uid,
    authUserId: emailMatch.supabase_auth_user_id ?? authUser.id,
    email: emailMatch.email,
    admin: role === 'admin',
    role,
  };
};

export const createSupabaseServerAuthProvider = (): ServerAuthProvider => ({
  async verifyAccessToken(token: string): Promise<AuthUser> {
    const authUser = await fetchSupabaseAuthUser(token);
    return resolveAppAuthUser(authUser);
  },
});
