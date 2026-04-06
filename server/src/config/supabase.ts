import { env } from './env.config';

export interface SupabaseRuntimeConfig {
  anonKey?: string;
  dbUrl?: string;
  isAuthClientReady: boolean;
  isDatabaseReady: boolean;
  isEnabled: boolean;
  isServerReady: boolean;
  serviceRoleKey?: string;
  url?: string;
}

const normalizeOptional = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const supabaseUrl = normalizeOptional(env.SUPABASE_URL);
const supabaseAnonKey = normalizeOptional(env.SUPABASE_ANON_KEY);
const supabaseServiceRoleKey = normalizeOptional(env.SUPABASE_SERVICE_ROLE_KEY);
const supabaseDbUrl = normalizeOptional(env.SUPABASE_DB_URL);

export const supabaseConfig: SupabaseRuntimeConfig = {
  anonKey: supabaseAnonKey,
  dbUrl: supabaseDbUrl,
  isAuthClientReady: !!(supabaseUrl && supabaseAnonKey),
  isDatabaseReady: !!(supabaseUrl && supabaseServiceRoleKey && supabaseDbUrl),
  isEnabled: !!supabaseUrl,
  isServerReady: !!(supabaseUrl && supabaseServiceRoleKey),
  serviceRoleKey: supabaseServiceRoleKey,
  url: supabaseUrl,
};
