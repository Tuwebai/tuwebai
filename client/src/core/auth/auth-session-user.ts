import type { Session, User as SupabaseUser, UserIdentity } from '@supabase/supabase-js';

export interface AuthSessionProviderInfo {
  photoURL?: string | null;
  providerId: string;
}

export interface AuthSessionUser {
  displayName?: string | null;
  email?: string | null;
  metadata: {
    creationTime?: string;
  };
  photoURL?: string | null;
  providerData: AuthSessionProviderInfo[];
  sessionUserId: string;
  uid: string;
}

export interface AuthSessionCredential {
  session: Session | null;
  user: AuthSessionUser;
}

export interface AuthActionInfo {
  data: {
    email?: string;
    previousEmail?: string;
  };
}

const getIdentityEmail = (identity: UserIdentity): string | undefined => {
  const identityData = identity.identity_data;
  if (identityData && typeof identityData === 'object' && typeof identityData.email === 'string') {
    return identityData.email;
  }

  return undefined;
};

const getIdentityPhoto = (identity: UserIdentity): string | undefined => {
  const identityData = identity.identity_data;
  if (!identityData || typeof identityData !== 'object') {
    return undefined;
  }

  const photoCandidate = identityData.avatar_url ?? identityData.picture ?? identityData.photo_url;
  return typeof photoCandidate === 'string' ? photoCandidate : undefined;
};

export const mapSupabaseUserToAuthSessionUser = (
  user: SupabaseUser,
  options: { appUid?: string } = {},
): AuthSessionUser => {
  const providers = Array.isArray(user.identities) ? user.identities : [];
  const providerData = providers.map((identity) => ({
    photoURL: getIdentityPhoto(identity) ?? null,
    providerId: identity.provider,
  }));
  const email =
    user.email ??
    providers.map(getIdentityEmail).find((value) => typeof value === 'string' && value.trim().length > 0) ??
    null;
  const displayNameCandidate = user.user_metadata?.display_name ?? user.user_metadata?.name;

  return {
    displayName: typeof displayNameCandidate === 'string' ? displayNameCandidate : null,
    email,
    metadata: {
      creationTime: user.created_at,
    },
    photoURL:
      typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : providerData.find((provider) => provider.photoURL)?.photoURL ?? null,
    providerData,
    sessionUserId: user.id,
    uid: options.appUid ?? user.id,
  };
};
