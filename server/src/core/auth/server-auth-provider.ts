import type { AuthUser } from '../../shared/types/auth-user';
import { createSupabaseServerAuthProvider } from '../../infrastructure/auth/supabase-auth-provider';

export interface ServerAuthProvider {
  verifyAccessToken(token: string): Promise<AuthUser>;
}

let providerInstance: ServerAuthProvider | null = null;

const createServerAuthProvider = (): ServerAuthProvider => {
  return createSupabaseServerAuthProvider();
};

export const getServerAuthProvider = (): ServerAuthProvider => {
  if (!providerInstance) {
    providerInstance = createServerAuthProvider();
  }

  return providerInstance;
};
