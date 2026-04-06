import { createClient } from '@supabase/supabase-js';
import { supabasePublicConfig } from '@/core/supabase/supabase-public-config';

const STORAGE_KEY = 'tuwebai-auth';

export const supabaseBrowserClient = createClient(
  supabasePublicConfig.url ?? 'https://invalid.local',
  supabasePublicConfig.anonKey ?? 'invalid-anon-key',
  {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
      storageKey: STORAGE_KEY,
    },
  },
);
