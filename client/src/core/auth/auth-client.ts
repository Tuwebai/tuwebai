import type { AuthChangeEvent } from '@supabase/supabase-js';

import { publicEnv } from '@/core/config/public-env';
import { supabaseBrowserClient } from '@/core/auth/supabase-browser-client';
import {
  mapSupabaseUserToAuthSessionUser,
  type AuthActionInfo,
  type AuthSessionCredential,
  type AuthSessionUser,
} from '@/core/auth/auth-session-user';

const getAuthBaseUrl = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return publicEnv.authRedirectBaseUrl ?? window.location.origin;
};

const getAuthRedirectUrl = (path = '/auth/action') => {
  const authBaseUrl = getAuthBaseUrl();
  if (!authBaseUrl) {
    return undefined;
  }

  return new URL(path, authBaseUrl).toString();
};

const getAuthDashboardUrl = () => {
  const authBaseUrl = getAuthBaseUrl();
  if (!authBaseUrl) {
    return undefined;
  }

  return new URL('/panel', authBaseUrl).toString();
};

const ensureAuthSessionUser = (
  user: Parameters<typeof mapSupabaseUserToAuthSessionUser>[0] | null,
): AuthSessionUser => {
  if (!user) {
    throw new Error('auth_user_unavailable');
  }

  return mapSupabaseUserToAuthSessionUser(user);
};

const isRecoveryEvent = (event: AuthChangeEvent): boolean => event === 'PASSWORD_RECOVERY';

export { type AuthActionInfo, type AuthSessionCredential, type AuthSessionUser };

export const observeAuthState = (
  listener: (user: AuthSessionUser | null) => void,
) => {
  const {
    data: { subscription },
  } = supabaseBrowserClient.auth.onAuthStateChange((event, session) => {
    const authUser = session?.user
      ? mapSupabaseUserToAuthSessionUser(session.user)
      : null;

    if (isRecoveryEvent(event) && session?.user) {
      listener(authUser);
      return;
    }

    listener(authUser);
  });

  return () => {
    subscription.unsubscribe();
  };
};

export const getCurrentAuthUser = async (): Promise<AuthSessionUser | null> => {
  const {
    data: { user },
  } = await supabaseBrowserClient.auth.getUser();

  return user ? mapSupabaseUserToAuthSessionUser(user) : null;
};

export const signInWithEmailPassword = async (
  email: string,
  password: string,
): Promise<AuthSessionCredential> => {
  const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    session: data.session,
    user: ensureAuthSessionUser(data.user),
  };
};

export const signInWithGooglePopup = async (): Promise<void> => {
  const { data, error } = await supabaseBrowserClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: getAuthDashboardUrl(),
    },
  });

  if (error) {
    throw error;
  }

  if (data.url && typeof window !== 'undefined') {
    window.location.assign(data.url);
  }
};

export const reloadAuthUser = async (_user: AuthSessionUser): Promise<void> => {
  const { error } = await supabaseBrowserClient.auth.refreshSession();
  if (error) {
    throw error;
  }
};

export const signOutAuthSession = async (): Promise<void> => {
  const { error } = await supabaseBrowserClient.auth.signOut();
  if (error) {
    throw error;
  }
};

export const registerAuthUser = async (
  email: string,
  password: string,
): Promise<AuthSessionCredential> => {
  const { data, error } = await supabaseBrowserClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    throw error;
  }

  return {
    session: data.session,
    user: ensureAuthSessionUser(data.user),
  };
};

export const updateAuthUserProfile = async (
  _user: AuthSessionUser,
  profile: { displayName?: string | null },
): Promise<void> => {
  if (!profile.displayName?.trim()) {
    return;
  }

  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession();
  if (!session) {
    return;
  }

  const { error } = await supabaseBrowserClient.auth.updateUser({
    data: {
      display_name: profile.displayName.trim(),
      name: profile.displayName.trim(),
    },
  });

  if (error) {
    throw error;
  }
};

export const sendAuthVerificationEmail = async (
  user: AuthSessionUser,
  config: { url: string; handleCodeInApp: boolean },
): Promise<void> => {
  if (!user.email?.trim()) {
    return;
  }

  const { error } = await supabaseBrowserClient.auth.resend({
    email: user.email,
    options: {
      emailRedirectTo: config.url,
    },
    type: 'signup',
  });

  if (error) {
    throw error;
  }
};

export const sendAuthPasswordResetEmail = async (
  email: string,
  config: { url: string; handleCodeInApp: boolean },
): Promise<void> => {
  const { error } = await supabaseBrowserClient.auth.resetPasswordForEmail(email, {
    redirectTo: config.url,
  });

  if (error) {
    throw error;
  }
};

export const confirmAuthPasswordReset = async (
  _code: string,
  newPassword: string,
): Promise<void> => {
  const { error } = await supabaseBrowserClient.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
};

export const getCurrentAccessToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession();

  return session?.access_token ?? null;
};

export const verifyAuthPasswordResetCode = async (_code: string): Promise<string> => {
  const {
    data: { user },
  } = await supabaseBrowserClient.auth.getUser();

  return user?.email ?? '';
};

export const inspectAuthActionCode = async (_code: string): Promise<AuthActionInfo> => {
  const {
    data: { user },
  } = await supabaseBrowserClient.auth.getUser();

  return {
    data: {
      email: user?.email,
    },
  };
};

export const applyAuthActionCode = async (_code: string): Promise<void> => {};

export const verifyAuthTokenHash = async (
  tokenHash: string,
  type: 'signup' | 'email' | 'recovery' | 'email_change',
): Promise<AuthSessionCredential> => {
  const verificationType = type === 'email_change' ? 'email_change' : type;
  const { data, error } = await supabaseBrowserClient.auth.verifyOtp({
    token_hash: tokenHash,
    type: verificationType,
  });

  if (error) {
    throw error;
  }

  return {
    session: data.session,
    user: ensureAuthSessionUser(data.user),
  };
};
