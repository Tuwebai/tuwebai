import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../../../config/supabase';

const resolveSupabaseAdminClient = () => {
  if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
    throw new Error('supabase_admin_client_unavailable');
  }

  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const supabaseAdminClient = resolveSupabaseAdminClient();
