import { backendApi } from '@/lib/backend-api';
import { SupabaseEdgeInvokeError, invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { UserPrivacySettings, UpdateUserPrivacyPayload } from '../types/privacy';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '../types/privacy';

const shouldSkipBackendFallback = (error: unknown): boolean =>
  error instanceof SupabaseEdgeInvokeError && (error.status === 401 || error.status === 403);

export async function getUserPrivacy(uid: string): Promise<UserPrivacySettings> {
  let res: { data?: UserPrivacySettings } | null = null;

  try {
    res = await invokeSupabaseEdge<{ data?: UserPrivacySettings }>('user-privacy');
  } catch (error) {
    if (shouldSkipBackendFallback(error)) {
      return DEFAULT_USER_PRIVACY_SETTINGS;
    }

    res = await backendApi.getUserPrivacy(uid);
  }

  return {
    ...DEFAULT_USER_PRIVACY_SETTINGS,
    ...(res?.data ?? {}),
  };
}

export async function updateUserPrivacy(uid: string, data: UpdateUserPrivacyPayload): Promise<UserPrivacySettings> {
  let res: { data?: UserPrivacySettings } | null = null;

  try {
    res = await invokeSupabaseEdge<{ data?: UserPrivacySettings }>('user-privacy', {
      body: data,
    });
  } catch (error) {
    if (shouldSkipBackendFallback(error)) {
      return {
        ...DEFAULT_USER_PRIVACY_SETTINGS,
        ...data,
      };
    }

    res = await backendApi.setUserPrivacy(uid, data);
  }

  return {
    ...DEFAULT_USER_PRIVACY_SETTINGS,
    ...(res?.data ?? {}),
  };
}
