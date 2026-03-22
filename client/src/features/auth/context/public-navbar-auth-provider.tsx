import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

import { mergeFirebaseUserData } from '@/features/auth/services/auth-avatar';
import {
  AuthActionsContext,
  AuthStateContext,
  DEFAULT_AUTH_ACTIONS,
  DEFAULT_AUTH_STATE,
  type AuthActions,
  type AuthState,
} from '@/features/auth/context/auth-context';
import type { User } from '@/features/auth/types';

type FirebaseModule = typeof import('@/lib/firebase');
type FirebaseAuthModule = typeof import('firebase/auth');
type UsersServiceModule = typeof import('@/features/users/services/users.service');

const PUBLIC_AUTH_BOOT_DELAY_MS = 2500;

let firebasePromise: Promise<FirebaseModule> | null = null;
let firebaseAuthPromise: Promise<FirebaseAuthModule> | null = null;
let usersServicePromise: Promise<UsersServiceModule> | null = null;

const getFirebase = () => {
  if (!firebasePromise) {
    firebasePromise = import('@/lib/firebase');
  }

  return firebasePromise;
};

const getFirebaseAuth = () => {
  if (!firebaseAuthPromise) {
    firebaseAuthPromise = import('firebase/auth');
  }

  return firebaseAuthPromise;
};

const getUsersService = () => {
  if (!usersServicePromise) {
    usersServicePromise = import('@/features/users/services/users.service');
  }

  return usersServicePromise;
};

const shouldEagerlyInitializeAuth = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const { pathname } = window.location;
  return pathname.startsWith('/panel') || pathname.startsWith('/auth/');
};

interface PublicNavbarAuthProviderProps {
  children: ReactNode;
}

export function PublicNavbarAuthProvider({ children }: PublicNavbarAuthProviderProps) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(shouldEagerlyInitializeAuth);
  const latestUserRef = useRef<User | null>(null);
  const authResolvedRef = useRef(false);
  const authReadyPromiseRef = useRef<Promise<User | null> | null>(null);
  const authReadyResolverRef = useRef<((value: User | null) => void) | null>(null);
  const startAuthRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    latestUserRef.current = user;
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

    const syncUser = async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        return null;
      }

      const { getUser, setUser } = await getUsersService();
      const persistedUser = await getUser(firebaseUser.uid);
      const mergedUser = mergeFirebaseUserData(firebaseUser, persistedUser);

      if (!persistedUser) {
        await setUser(mergedUser);
      }

      return mergedUser;
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

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) {
            return;
          }

          const nextUser = await syncUser(firebaseUser);

          if (!isMounted) {
            return;
          }

          setUserState(nextUser);
          setIsLoadingAuth(false);
          resolveAuthReady(nextUser);
        });

        if (isMounted) {
          unsubscribeFn = unsubscribe;
        } else {
          unsubscribe();
        }
      } catch (error) {
        console.error('Error inicializando auth liviano del navbar:', error);
        resolveAuthReady(null);

        if (isMounted) {
          setUserState(null);
          setIsLoadingAuth(false);
        }
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

  const logout = useCallback(async () => {
    const [{ auth }, { signOut }] = await Promise.all([getFirebase(), getFirebaseAuth()]);
    await signOut(auth);
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
