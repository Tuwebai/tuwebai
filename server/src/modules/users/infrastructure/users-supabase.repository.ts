import { createHash } from 'node:crypto';

import {
  supabaseAdminRestRequest,
  isSupabaseAdminRestReady,
} from '../../../infrastructure/database/supabase/supabase-admin-rest';
import type {
  PaymentDocument,
  UserDocument,
  UserPreferencesDocument,
  UserPrivacyDocument,
  UsersRepository,
} from '../domain/users.repository';

interface UserRow {
  id: string;
  auth_provider: string;
  created_at: string;
  email: string;
  auth_uid: string;
  full_name: string | null;
  image_url: string | null;
  is_active: boolean;
  project_id: string | null;
  password_changed_at: string | null;
  role: string;
  supabase_auth_user_id: string | null;
  updated_at: string;
  username: string | null;
  user_preferences: {
    dark_mode: boolean;
    email_notifications: boolean;
    language: string | null;
    newsletter: boolean;
    updated_at: string;
  } | null;
  user_privacy_settings: {
    analytics_consent: boolean;
    marketing_consent: boolean;
    profile_email_visible: boolean;
    profile_status_visible: boolean;
    updated_at: string;
    updated_by: 'self' | 'admin' | 'system';
  } | null;
}

const USERS_SELECT =
  'id,auth_uid,supabase_auth_user_id,email,username,full_name,image_url,auth_provider,password_changed_at,role,is_active,project_id,created_at,updated_at,user_preferences(email_notifications,newsletter,dark_mode,language,updated_at),user_privacy_settings(marketing_consent,analytics_consent,profile_email_visible,profile_status_visible,updated_at,updated_by)';

const createDeterministicUuid = (input: string): string => {
  const hash = createHash('sha256').update(input).digest('hex');
  const hex = hash.slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ['8', '9', 'a', 'b'][parseInt(hex[16], 16) % 4];
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20, 32).join('')}`;
};

const mapPreferences = (preferences: UserRow['user_preferences']): UserPreferencesDocument | undefined => {
  if (!preferences) {
    return undefined;
  }

  return {
    emailNotifications: preferences.email_notifications,
    newsletter: preferences.newsletter,
    darkMode: preferences.dark_mode,
    language: preferences.language ?? undefined,
    updatedAt: preferences.updated_at,
  };
};

const mapPrivacy = (privacy: UserRow['user_privacy_settings']): UserPrivacyDocument | undefined => {
  if (!privacy) {
    return undefined;
  }

  return {
    marketingConsent: privacy.marketing_consent,
    analyticsConsent: privacy.analytics_consent,
    profileEmailVisible: privacy.profile_email_visible,
    profileStatusVisible: privacy.profile_status_visible,
    updatedAt: privacy.updated_at,
    updatedBy: privacy.updated_by,
  };
};

const mapRowToDocument = (row: UserRow): UserDocument => ({
  appUserId: row.id,
  uid: row.supabase_auth_user_id ?? row.auth_uid,
  authUserId: row.supabase_auth_user_id ?? undefined,
  email: row.email,
  username: row.username ?? undefined,
  name: row.full_name ?? row.username ?? undefined,
  image: row.image_url ?? undefined,
  authProvider: row.auth_provider === 'password' || row.auth_provider === 'google' ? row.auth_provider : undefined,
  passwordChangedAt: row.password_changed_at,
  role: row.role,
  isActive: row.is_active,
  projectId: row.project_id ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  preferences: mapPreferences(row.user_preferences),
  privacy: mapPrivacy(row.user_privacy_settings),
});

const buildUserRow = (uid: string, payload: Partial<UserDocument>) => ({
  id: payload.appUserId ?? createDeterministicUuid(`user:${uid}`),
  profile_id: createDeterministicUuid(`profile:${uid}`),
  supabase_auth_user_id: payload.authUserId ?? null,
  auth_uid: uid,
  email: payload.email?.trim().toLowerCase(),
  username: payload.username?.trim() || null,
  full_name: payload.name?.trim() || payload.username?.trim() || null,
  image_url: payload.image?.trim() || null,
  auth_provider: payload.authProvider ?? 'unknown',
  role: payload.role?.trim() || 'user',
  is_active: payload.isActive ?? true,
  project_id: payload.projectId?.trim() || null,
  password_changed_at: payload.passwordChangedAt ?? null,
  created_at: payload.createdAt ?? new Date().toISOString(),
  updated_at: payload.updatedAt ?? new Date().toISOString(),
});

const buildPreferencesRow = (uid: string, payload: Partial<UserDocument>) => ({
  user_id: createDeterministicUuid(`user:${uid}`),
  email_notifications: payload.preferences?.emailNotifications ?? true,
  newsletter: payload.preferences?.newsletter ?? false,
  dark_mode: payload.preferences?.darkMode ?? false,
  language: payload.preferences?.language ?? null,
  created_at: payload.createdAt ?? new Date().toISOString(),
  updated_at: payload.preferences?.updatedAt ?? payload.updatedAt ?? new Date().toISOString(),
});

const buildPrivacyRow = (uid: string, payload: Partial<UserDocument>) => ({
  user_id: createDeterministicUuid(`user:${uid}`),
  marketing_consent: payload.privacy?.marketingConsent ?? false,
  analytics_consent: payload.privacy?.analyticsConsent ?? false,
  profile_email_visible: payload.privacy?.profileEmailVisible ?? true,
  profile_status_visible: payload.privacy?.profileStatusVisible ?? true,
  updated_by: payload.privacy?.updatedBy ?? 'self',
  created_at: payload.createdAt ?? new Date().toISOString(),
  updated_at: payload.privacy?.updatedAt ?? payload.updatedAt ?? new Date().toISOString(),
});

const findUserByEmail = async (
  email: string,
): Promise<{ id: string; data: UserDocument } | null> => {
  const rows = await supabaseAdminRestRequest<UserRow[]>(
    `/users?select=${USERS_SELECT}&email=eq.${encodeURIComponent(email.trim().toLowerCase())}&limit=1`,
  );

  if (!rows[0]) {
    return null;
  }

  return {
    id: rows[0].supabase_auth_user_id ?? rows[0].auth_uid,
    data: mapRowToDocument(rows[0]),
  };
};

const findUserRowByIdentity = async (uid: string): Promise<UserRow | null> => {
  const byAuthUserId = await supabaseAdminRestRequest<UserRow[]>(
    `/users?select=${USERS_SELECT}&supabase_auth_user_id=eq.${encodeURIComponent(uid)}&limit=1`,
  );

  if (byAuthUserId[0]) {
    return byAuthUserId[0];
  }

  const rows = await supabaseAdminRestRequest<UserRow[]>(
    `/users?select=${USERS_SELECT}&auth_uid=eq.${encodeURIComponent(uid)}&limit=1`,
  );

  return rows[0] ?? null;
};

const findUserByUid = async (uid: string): Promise<UserDocument | null> => {
  const row = await findUserRowByIdentity(uid);
  return row ? mapRowToDocument(row) : null;
};

const findUserByAuthUserId = async (authUserId: string): Promise<UserDocument | null> => {
  const rows = await supabaseAdminRestRequest<UserRow[]>(
    `/users?select=${USERS_SELECT}&supabase_auth_user_id=eq.${encodeURIComponent(authUserId)}&limit=1`,
  );

  return rows[0] ? mapRowToDocument(rows[0]) : null;
};

const getPaymentsByOwnerIds = async (ownerIds: string[]): Promise<PaymentDocument[]> => {
  const paymentsById = new Map<string, PaymentDocument>();

  for (const ownerId of ownerIds) {
    try {
      const rows = await supabaseAdminRestRequest<PaymentDocument[]>(
        `/payments?select=*&user_id=eq.${encodeURIComponent(ownerId)}`,
      );
      for (const row of rows) {
        paymentsById.set(String(row.id), row);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('relation "public.payments" does not exist') ||
          error.message.includes("Could not find the table 'public.payments'"))
      ) {
        return [];
      }

      throw error;
    }
  }

  return Array.from(paymentsById.values());
};

const upsertUserByUid = async (uid: string, payload: Partial<UserDocument>): Promise<void> => {
  const currentRow = await findUserRowByIdentity(uid);
  const current = currentRow ? mapRowToDocument(currentRow) : null;
  const persistedAuthUid = currentRow?.auth_uid ?? uid;
  const nextPayload: Partial<UserDocument> = {
    ...current,
    ...payload,
    uid: payload.authUserId ?? current?.authUserId ?? uid,
    preferences: {
      ...(current?.preferences ?? {}),
      ...(payload.preferences ?? {}),
    },
    privacy: {
      ...(current?.privacy ?? {}),
      ...(payload.privacy ?? {}),
    },
  };

  await supabaseAdminRestRequest('/users?on_conflict=auth_uid', {
    method: 'POST',
    body: JSON.stringify([buildUserRow(persistedAuthUid, nextPayload)]),
  });
  await supabaseAdminRestRequest('/user_preferences?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify([buildPreferencesRow(persistedAuthUid, nextPayload)]),
  });
  await supabaseAdminRestRequest('/user_privacy_settings?on_conflict=user_id', {
    method: 'POST',
    body: JSON.stringify([buildPrivacyRow(persistedAuthUid, nextPayload)]),
  });
};

const getUserPaymentsByUid = async (uid: string): Promise<PaymentDocument[]> => {
  const ownerIds = Array.from(
    new Set([uid, (await findUserByUid(uid))?.appUserId].filter((value): value is string => typeof value === 'string' && value.length > 0)),
  );
  return getPaymentsByOwnerIds(ownerIds);
};

export const createUsersSupabaseRepository = (): UsersRepository => ({
  findByAuthUserId: findUserByAuthUserId,
  findByEmail: findUserByEmail,
  findByUid: findUserByUid,
  getPaymentsByUid: getUserPaymentsByUid,
  isAvailable: () => isSupabaseAdminRestReady(),
  upsertByUid: upsertUserByUid,
});
