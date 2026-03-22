import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/shared/ui/use-toast';
import {
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useConfirmPasswordResetMutation,
  useUpdateProfileMutation,
} from '../hooks/use-auth-mutations';
import { isGoogleAuthUser, mergeFirebaseUserData } from '../services/auth-avatar';
import { getAuthErrorMessage } from '../services/auth-error';
import type { PasswordInfo, RegisterData, User } from '../types';
import {
  AuthActionsContext,
  AuthStateContext,
  type AuthActions,
  type AuthState,
} from './auth-context';

export { useAuth, useAuthActions, useAuthState, useOptionalAuthState } from './auth-context';

type FirebaseModule = typeof import('@/lib/firebase');
type FirebaseAuthModule = typeof import('firebase/auth');
type UsersServiceModule = typeof import('@/features/users/services/users.service');

let firebasePromise: Promise<FirebaseModule> | null = null;
let fireauthPromise: Promise<FirebaseAuthModule> | null = null;
let usersServicePromise: Promise<UsersServiceModule> | null = null;

const getFirebase = () => {
  if (!firebasePromise) firebasePromise = import('@/lib/firebase');
  return firebasePromise;
};

const getFirebaseAuth = () => {
  if (!fireauthPromise) fireauthPromise = import('firebase/auth');
  return fireauthPromise;
};

const getUsersService = () => {
  if (!usersServicePromise) usersServicePromise = import('@/features/users/services/users.service');
  return usersServicePromise;
};

const AUTH_TIMEOUT_MS = 2500;
const PUBLIC_AUTH_BOOT_DELAY_MS = 2500;

const shouldEagerlyInitializeAuth = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  const { pathname } = window.location;
  return pathname.startsWith('/panel') || pathname.startsWith('/auth/');
};

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => (
  new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(fallback);
    }, timeoutMs);

    promise
      .then((value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(fallback);
      });
  })
);

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
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(shouldEagerlyInitializeAuth);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    changedAt: null,
    daysSinceChange: null,
  });
  const [isLoadingPasswordInfo, setIsLoadingPasswordInfo] = useState(false);
  const latestUserRef = useRef<User | null>(null);
  const authResolvedRef = useRef(false);
  const authReadyPromiseRef = useRef<Promise<User | null> | null>(null);
  const authReadyResolverRef = useRef<((value: User | null) => void) | null>(null);
  const startAuthRef = useRef<(() => void) | null>(null);

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const confirmPasswordResetMutation = useConfirmPasswordResetMutation();

  const isAnyMutationPending =
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    logoutMutation.isPending ||
    registerMutation.isPending ||
    updateProfileMutation.isPending ||
    resetPasswordMutation.isPending ||
    confirmPasswordResetMutation.isPending;

  const isLoading = isLoadingAuth;
  const isMutatingAuth = isAnyMutationPending;

  useEffect(() => {
    latestUserRef.current = user;
    setPasswordInfo(derivePasswordInfo(user));
    setIsLoadingPasswordInfo(false);
  }, [user]);

  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    let isMounted = true;
    let authStarted = false;
    let idleTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let onUserIntent: (() => void) | null = null;
    let onVisibilityChange: (() => void) | null = null;

    const cleanupDeferredBoot = () => {
      if (typeof window !== 'undefined' && onUserIntent) {
        window.removeEventListener('pointerdown', onUserIntent);
        window.removeEventListener('keydown', onUserIntent);
      }

      if (typeof window !== 'undefined' && onVisibilityChange) {
        window.removeEventListener('visibilitychange', onVisibilityChange);
      }

      if (idleTimeoutId) {
        clearTimeout(idleTimeoutId);
        idleTimeoutId = null;
      }
    };

    const resolveAuthReady = (nextUser: User | null) => {
      authResolvedRef.current = true;

      if (authReadyResolverRef.current) {
        authReadyResolverRef.current(nextUser);
        authReadyResolverRef.current = null;
      }
    };

    const initAuth = async () => {
      if (authStarted || !isMounted) {
        return;
      }

      authStarted = true;
      cleanupDeferredBoot();
      setIsLoadingAuth(true);

      try {
        const { auth } = await getFirebase();
        const { onAuthStateChanged } = await getFirebaseAuth();
        const { getUser, setUser } = await getUsersService();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (!isMounted) return;

          if (firebaseUser) {
            await withTimeout(firebaseUser.reload(), AUTH_TIMEOUT_MS, undefined);
            const currentFirebaseUser = auth.currentUser ?? firebaseUser;
            const persistedUser = await withTimeout(getUser(currentFirebaseUser.uid), AUTH_TIMEOUT_MS, null);
            let dbUser = mergeFirebaseUserData(currentFirebaseUser, persistedUser);
            if (!persistedUser) {
              await setUser(dbUser);
            } else if (
              (
                dbUser.authProvider !== persistedUser.authProvider ||
                dbUser.passwordChangedAt !== persistedUser.passwordChangedAt ||
                (
                  isGoogleAuthUser(currentFirebaseUser) &&
                  (
                dbUser.uid !== persistedUser.uid ||
                dbUser.email !== persistedUser.email ||
                dbUser.name !== persistedUser.name ||
                dbUser.username !== persistedUser.username ||
                dbUser.image !== persistedUser.image
                  )
                )
              )
            ) {
              await setUser(dbUser);
            }
            if (isMounted) setUserState(dbUser);
            resolveAuthReady(dbUser);
          } else {
            setUserState(null);
            resolveAuthReady(null);
          }

          if (isMounted) setIsLoadingAuth(false);
        });

        if (isMounted) unsubscribeFn = unsubscribe;
        else unsubscribe();
      } catch (err) {
        console.error('Error inicializando Auth:', err);
        resolveAuthReady(null);
        if (isMounted) setIsLoadingAuth(false);
      }
    };

    const startAuth = () => {
      void initAuth();
    };

    startAuthRef.current = startAuth;

    if (shouldEagerlyInitializeAuth()) {
      startAuth();
    } else {
      onUserIntent = () => {
        startAuth();
      };

      onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          onUserIntent?.();
        }
      };

      window.addEventListener('pointerdown', onUserIntent, { passive: true, once: true });
      window.addEventListener('keydown', onUserIntent, { once: true });
      window.addEventListener('visibilitychange', onVisibilityChange, { once: true });

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => startAuth(), { timeout: PUBLIC_AUTH_BOOT_DELAY_MS });
      } else {
        idleTimeoutId = setTimeout(startAuth, PUBLIC_AUTH_BOOT_DELAY_MS);
      }
    }

    return () => {
      isMounted = false;
      startAuthRef.current = null;
      if (!authResolvedRef.current && authReadyResolverRef.current) {
        authReadyResolverRef.current(null);
        authReadyResolverRef.current = null;
      }
      cleanupDeferredBoot();
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al iniciar sesión'));
      throw error;
    }
  }, [loginMutation]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { dbUser } = await googleLoginMutation.mutateAsync();
      setUserState(dbUser);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al iniciar sesión con Google'));
      throw error;
    }
  }, [googleLoginMutation]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
      setUserState(null);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al cerrar sesión'));
      throw error;
    }
  }, [logoutMutation]);

  const register = useCallback(async (userData: RegisterData) => {
    setError(null);
    try {
      const newUser = await registerMutation.mutateAsync(userData);
      setUserState(newUser);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al registrar usuario'));
      throw error;
    }
  }, [registerMutation]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    try {
      await resetPasswordMutation.mutateAsync(email);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al solicitar restablecimiento de contraseña'));
      throw error;
    }
  }, [resetPasswordMutation]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setError(null);
    try {
      await confirmPasswordResetMutation.mutateAsync({ code: token, newPassword });
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al restablecer contraseña'));
      throw error;
    }
  }, [confirmPasswordResetMutation]);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    setError(null);
    try {
      await updateProfileMutation.mutateAsync({ uid: user.uid, data });
      setUserState((prevUser) => (prevUser ? { ...prevUser, ...data } : null));
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al actualizar perfil'));
      throw error;
    }
  }, [user, updateProfileMutation]);

  const fetchPasswordInfo = useCallback(async () => {
    setIsLoadingPasswordInfo(true);
    setPasswordInfo(derivePasswordInfo(user));
    setIsLoadingPasswordInfo(false);
  }, [user]);

  const uploadProfileImage = useCallback(async (imageFile: File) => {
    if (!user) return;
    setError(null);
    try {
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      await updateProfileMutation.mutateAsync({ uid: user.uid, data: { image: imageData } });
      setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageData } : null));
      toast({ title: 'Imagen actualizada', description: 'Tu foto de perfil ha sido actualizada.' });
    } catch (error: unknown) {
      const message = getAuthErrorMessage(error, 'Error al subir imagen');
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw error;
    }
  }, [user, updateProfileMutation, toast]);

  const setUserImage = useCallback((imageUrl: string) => {
    if (user) {
      setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageUrl } : null));
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  const ensureAuthReady = useCallback(async () => {
    if (authResolvedRef.current) {
      return latestUserRef.current;
    }

    if (!authReadyPromiseRef.current) {
      authReadyPromiseRef.current = new Promise<User | null>((resolve) => {
        authReadyResolverRef.current = resolve;
      });
    }

    startAuthRef.current?.();

    return authReadyPromiseRef.current;
  }, []);

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

