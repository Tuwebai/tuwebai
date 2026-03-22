import { createContext, useContext, useMemo } from 'react';

import type { PasswordInfo, RegisterData, User } from '../types';

export interface AuthState {
  user: User | null;
  passwordInfo: PasswordInfo;
  isLoading: boolean;
  isMutatingAuth: boolean;
  isLoadingPasswordInfo: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  ensureAuthReady: () => Promise<User | null>;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  fetchPasswordInfo: () => Promise<void>;
  uploadProfileImage: (imageFile: File) => Promise<void>;
  clearError: () => void;
  setUserImage: (imageUrl: string) => void;
}

const DEFAULT_PASSWORD_INFO: PasswordInfo = {
  changedAt: null,
  daysSinceChange: null,
};

export const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  passwordInfo: DEFAULT_PASSWORD_INFO,
  isLoading: false,
  isMutatingAuth: false,
  isLoadingPasswordInfo: false,
  isAuthenticated: false,
  error: null,
};

const unsupportedAction = async () => {
  throw new Error('Accion de auth no disponible fuera de AuthProvider');
};

export const DEFAULT_AUTH_ACTIONS: AuthActions = {
  ensureAuthReady: async () => null,
  login: unsupportedAction,
  loginWithGoogle: unsupportedAction,
  logout: unsupportedAction,
  register: unsupportedAction,
  requestPasswordReset: unsupportedAction,
  resetPassword: unsupportedAction,
  updateUserProfile: unsupportedAction,
  fetchPasswordInfo: async () => {},
  uploadProfileImage: unsupportedAction,
  clearError: () => {},
  setUserImage: () => {},
};

export const AuthStateContext = createContext<AuthState | undefined>(undefined);
export const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

export const useOptionalAuthState = () => useContext(AuthStateContext) ?? DEFAULT_AUTH_STATE;

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useOptionalAuthActions = () => useContext(AuthActionsContext) ?? DEFAULT_AUTH_ACTIONS;

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
};
