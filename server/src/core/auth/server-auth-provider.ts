import type { AuthUser } from '../../shared/types/auth-user';
import { createFirebaseServerAuthProvider } from '../../infrastructure/auth/firebase-admin-provider';

export interface ServerAuthProvider {
  verifyAccessToken(token: string): Promise<AuthUser>;
}

let providerInstance: ServerAuthProvider | null = null;

const createServerAuthProvider = (): ServerAuthProvider => {
  // Punto unico de swap cuando Supabase Auth reemplace al provider legacy.
  return createFirebaseServerAuthProvider();
};

export const getServerAuthProvider = (): ServerAuthProvider => {
  if (!providerInstance) {
    providerInstance = createServerAuthProvider();
  }

  return providerInstance;
};
