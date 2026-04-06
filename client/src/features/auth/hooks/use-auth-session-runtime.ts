import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import {
  observeAuthSessionState,
  type AuthSessionUser,
} from '@/features/auth/services/auth-session.service';
import type { User } from '@/features/auth/types';

const PUBLIC_AUTH_BOOT_DELAY_MS = 2500;

const hasAuthCallbackState = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

  return (
    searchParams.has('code') ||
    searchParams.has('token_hash') ||
    searchParams.has('error') ||
    hashParams.has('access_token') ||
    hashParams.has('refresh_token') ||
    hashParams.has('type')
  );
};

const shouldEagerlyInitializeAuth = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  const { pathname } = window.location;
  return pathname.startsWith('/panel') || pathname.startsWith('/auth/') || hasAuthCallbackState();
};

interface UseAuthSessionRuntimeOptions {
  syncUser: (authUser: AuthSessionUser | null) => Promise<User | null>;
}

interface UseAuthSessionRuntimeResult {
  ensureAuthReady: () => Promise<User | null>;
  isLoadingAuth: boolean;
  setUserState: Dispatch<SetStateAction<User | null>>;
  user: User | null;
}

export const useAuthSessionRuntime = ({
  syncUser,
}: UseAuthSessionRuntimeOptions): UseAuthSessionRuntimeResult => {
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

      if (!authReadyResolverRef.current) {
        return;
      }

      authReadyResolverRef.current(nextUser);
      authReadyResolverRef.current = null;
    };

    const initAuth = async () => {
      if (authStarted || !isMounted) {
        return;
      }

      authStarted = true;
      cleanupDeferredBoot();
      setIsLoadingAuth(true);

      try {
        const unsubscribe = observeAuthSessionState(async (authUser) => {
          if (!isMounted) {
            return;
          }

          const nextUser = await syncUser(authUser);

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
        console.error('Error inicializando runtime de auth:', error);
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
  }, [syncUser]);

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

  return {
    ensureAuthReady,
    isLoadingAuth,
    setUserState,
    user,
  };
};
