import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthSessionUser } from '@/core/auth/auth-client';
import { useAuthProviderActions } from '../hooks/use-auth-provider-actions';
import { useAuthSessionRuntime } from '../hooks/use-auth-session-runtime';
import { syncAuthSessionUser } from '../services/auth-user-sync';
import type { PasswordInfo, User } from '../types';
import {
  AuthActionsContext,
  AuthStateContext,
  type AuthActions,
  type AuthState,
} from './auth-context';

export { useAuth, useAuthActions, useAuthState, useOptionalAuthState } from './auth-context';

const AUTH_TIMEOUT_MS = 2500;

const derivePasswordInfo = (user: User | null): PasswordInfo => {
  if (!user || user.authProvider !== 'password' || !user.passwordChangedAt) {
    return {
      changedAt: null,
      daysSinceChange: null,
    };
  }

  const changedAt = new Date(user.passwordChangedAt);
  if (Number.isNaN(changedAt.getTime())) {
    return {
      changedAt: null,
      daysSinceChange: null,
    };
  }

  const diffMs = Date.now() - changedAt.getTime();
  const daysSinceChange = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return {
    changedAt: user.passwordChangedAt,
    daysSinceChange,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    changedAt: null,
    daysSinceChange: null,
  });
  const [isLoadingPasswordInfo, setIsLoadingPasswordInfo] = useState(false);
  const syncUser = useCallback(
    (authUser: AuthSessionUser | null) =>
      syncAuthSessionUser(authUser, { timeoutMs: AUTH_TIMEOUT_MS }),
    [],
  );
  const { user, setUserState, isLoadingAuth, ensureAuthReady } = useAuthSessionRuntime({ syncUser });
  const {
    clearError,
    isMutatingAuth,
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    setUserImage,
    updateUserProfile,
    uploadProfileImage,
  } = useAuthProviderActions({
    setError,
    setUserState,
    user,
  });

  const isLoading = isLoadingAuth;

  useEffect(() => {
    setPasswordInfo(derivePasswordInfo(user));
    setIsLoadingPasswordInfo(false);
  }, [user]);

  const fetchPasswordInfo = useCallback(async () => {
    setIsLoadingPasswordInfo(true);
    setPasswordInfo(derivePasswordInfo(user));
    setIsLoadingPasswordInfo(false);
  }, [user]);

  const stateValue = useMemo<AuthState>(() => ({
    user,
    passwordInfo,
    isLoading,
    isMutatingAuth,
    isLoadingPasswordInfo,
    isAuthenticated: !!user,
    error,
  }), [
    user,
    passwordInfo,
    isLoading,
    isMutatingAuth,
    isLoadingPasswordInfo,
    error,
  ]);

  const actionsValue = useMemo<AuthActions>(() => ({
    ensureAuthReady,
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    updateUserProfile,
    fetchPasswordInfo,
    uploadProfileImage,
    clearError,
    setUserImage,
  }), [
    ensureAuthReady,
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    updateUserProfile,
    fetchPasswordInfo,
    uploadProfileImage,
    clearError,
    setUserImage,
  ]);

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};
