import { invokeSupabaseEdge } from '@/lib/supabase-edge';

export interface UserPreferencesSettings {
  darkMode?: boolean;
  emailNotifications?: boolean;
  language?: string;
  newsletter?: boolean;
  updatedAt?: string;
}

export async function getUserPreferences(): Promise<UserPreferencesSettings | null> {
  const res = await invokeSupabaseEdge<{ data?: UserPreferencesSettings | null }>('user-preferences');
  return res?.data ?? null;
}

export async function updateUserPreferences(
  payload: Partial<UserPreferencesSettings>,
): Promise<UserPreferencesSettings | null> {
  const res = await invokeSupabaseEdge<{ data?: UserPreferencesSettings | null }>('user-preferences', {
    body: payload,
  });
  return res?.data ?? null;
}
