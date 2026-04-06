import { supabaseConfig } from '../../config/supabase';
import type { ServerAuthProvider } from '../../core/auth/server-auth-provider';
import type { AuthUser } from '../../shared/types/auth-user';
import { supabaseAdminRestRequest } from '../database/supabase/supabase-admin-rest';

interface SupabaseAuthApiUser {
  email?: string;
  id: string;
}

interface AppUserLookupRow {
  id: string;
  email: string;
  firebase_uid: string;
  role: string;
  supabase_auth_user_id: string | null;
}

const SUPABASE_AUTH_TIMEOUT_MS = 8000;
const APP_USER_SELECT = 'id,firebase_uid,email,role,supabase_auth_user_id';

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

const linkSupabaseAuthUser = async (firebaseUid: string, supabaseAuthUserId: string): Promise<void> => {
  await supabaseAdminRestRequest<void>(
    `/users?firebase_uid=eq.${encodeURIComponent(firebaseUid)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        supabase_auth_user_id: supabaseAuthUserId,
      }),
    },
  );
};

const resolveAppAuthUser = async (authUser: SupabaseAuthApiUser): Promise<AuthUser> => {
  const directMatch = await findAppUserBySupabaseAuthId(authUser.id);
  if (directMatch) {
    return {
      appUserId: directMatch.id,
      uid: directMatch.firebase_uid,
      authUserId: directMatch.supabase_auth_user_id ?? authUser.id,
      email: directMatch.email,
      admin: directMatch.role === 'admin',
    };
  }

  const normalizedEmail = authUser.email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      uid: authUser.id,
      authUserId: authUser.id,
    };
  }

  const emailMatch = await findAppUserByEmail(normalizedEmail);
  if (!emailMatch) {
    return {
      uid: authUser.id,
      authUserId: authUser.id,
      email: normalizedEmail,
      admin: false,
    };
  }

  if (!emailMatch.supabase_auth_user_id) {
    await linkSupabaseAuthUser(emailMatch.firebase_uid, authUser.id);
  }

  return {
    appUserId: emailMatch.id,
    uid: emailMatch.firebase_uid,
    authUserId: emailMatch.supabase_auth_user_id ?? authUser.id,
    email: emailMatch.email,
    admin: emailMatch.role === 'admin',
  };
};

export const createSupabaseServerAuthProvider = (): ServerAuthProvider => ({
  async verifyAccessToken(token: string): Promise<AuthUser> {
    const authUser = await fetchSupabaseAuthUser(token);
    return resolveAppAuthUser(authUser);
  },
});
