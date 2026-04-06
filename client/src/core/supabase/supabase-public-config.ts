import { publicEnv } from '@/core/config/public-env';

export interface SupabasePublicConfig {
  anonKey?: string;
  isAuthReady: boolean;
  isEnabled: boolean;
  url?: string;
}

export const supabasePublicConfig: SupabasePublicConfig = {
  anonKey: publicEnv.supabaseAnonKey,
  isAuthReady: !!(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey),
  isEnabled: !!publicEnv.supabaseUrl,
  url: publicEnv.supabaseUrl,
};
