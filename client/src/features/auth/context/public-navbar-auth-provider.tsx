import { useCallback, useMemo, type ReactNode } from 'react';
import { useAuthSessionRuntime } from '@/features/auth/hooks/use-auth-session-runtime';
import {
  AuthActionsContext,
  AuthStateContext,
  DEFAULT_AUTH_ACTIONS,
  DEFAULT_AUTH_STATE,
  type AuthActions,
  type AuthState,
} from '@/features/auth/context/auth-context';
import {
  signOutCurrentAuthSession,
  type AuthSessionUser,
} from '@/features/auth/services/auth-session.service';
import { syncAuthSessionUser } from '@/features/auth/services/auth-user-sync';

interface PublicNavbarAuthProviderProps {
  children: ReactNode;
}

export function PublicNavbarAuthProvider({ children }: PublicNavbarAuthProviderProps) {
  const syncUser = useCallback((authUser: AuthSessionUser | null) => syncAuthSessionUser(authUser), []);
  const { user, setUserState, isLoadingAuth, ensureAuthReady } = useAuthSessionRuntime({ syncUser });

  const logout = useCallback(async () => {
    await signOutCurrentAuthSession();
    setUserState(null);
  }, []);

  const stateValue = useMemo<AuthState>(() => ({
    ...DEFAULT_AUTH_STATE,
    user,
    isLoading: isLoadingAuth,
    isAuthenticated: !!user,
  }), [isLoadingAuth, user]);

  const actionsValue = useMemo<AuthActions>(() => ({
    ...DEFAULT_AUTH_ACTIONS,
    ensureAuthReady,
    logout,
  }), [ensureAuthReady, logout]);

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}
