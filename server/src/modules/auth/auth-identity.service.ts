import type { AuthUser } from '../../shared/types/auth-user';

export interface AuthIdentityResponse {
  admin: boolean;
  appUserId: string | null;
  authUserId: string | null;
  email: string | null;
  role: 'admin' | 'user';
  uid: string;
}

export const resolveAuthIdentityResponse = (authUser: AuthUser): AuthIdentityResponse => ({
  admin: authUser.role === 'admin' || authUser.admin === true,
  appUserId: authUser.appUserId ?? null,
  authUserId: authUser.authUserId ?? null,
  email: authUser.email ?? null,
  role: authUser.role === 'admin' ? 'admin' : 'user',
  uid: authUser.uid,
});
