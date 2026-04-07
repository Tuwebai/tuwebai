import type {
  AuthSessionProviderInfo,
  AuthSessionUser,
} from '@/features/auth/services/auth-session.service';
import type { User } from '@/features/users/types';

const GOOGLE_PROVIDER_ID = 'google.com';
const PASSWORD_PROVIDER_ID = 'password';

const getProviderPhoto = (providerData: AuthSessionProviderInfo[]) =>
  providerData.find((provider) => provider.providerId === GOOGLE_PROVIDER_ID && provider.photoURL)?.photoURL?.trim() ||
  providerData.find((provider) => provider.photoURL)?.photoURL?.trim() ||
  '';

export const isGoogleAuthUser = (authUser: AuthSessionUser | null) =>
  !!authUser?.providerData.some((provider) => provider.providerId === GOOGLE_PROVIDER_ID);

const isPasswordAuthUser = (authUser: AuthSessionUser | null) =>
  !!authUser?.providerData.some((provider) => provider.providerId === PASSWORD_PROVIDER_ID);

const getIdentityLabel = (authUser: AuthSessionUser | null) =>
  authUser?.displayName?.trim() || '';

export const resolveAuthAvatar = (authUser: AuthSessionUser | null, persistedImage?: string) => {
  if (!authUser) {
    return persistedImage?.trim() || '';
  }

  const providerPhoto = authUser.photoURL?.trim() || getProviderPhoto(authUser.providerData);
  const storedPhoto = persistedImage?.trim() || '';

  if (isGoogleAuthUser(authUser)) {
    return providerPhoto || storedPhoto;
  }

  return storedPhoto || providerPhoto;
};

export const mergeAuthUserData = (
  authUser: AuthSessionUser,
  persistedUser?: Partial<User> | null,
): User => {
  const isGoogleUser = isGoogleAuthUser(authUser);
  const identityLabel = getIdentityLabel(authUser);

  return {
    authProvider: isGoogleUser
      ? 'google'
      : (persistedUser?.authProvider || (isPasswordAuthUser(authUser) ? 'password' : 'password')),
    uid: persistedUser?.uid || authUser.uid,
    email: authUser.email || persistedUser?.email || '',
    username: isGoogleUser ? (identityLabel || persistedUser?.username || '') : (persistedUser?.username || identityLabel || ''),
    name: isGoogleUser ? (identityLabel || persistedUser?.name || '') : (persistedUser?.name || identityLabel || ''),
    image: resolveAuthAvatar(authUser, persistedUser?.image),
    passwordChangedAt: isGoogleUser
      ? null
      : (persistedUser?.passwordChangedAt || persistedUser?.createdAt || authUser.metadata.creationTime || new Date().toISOString()),
    role: persistedUser?.role,
    isActive: persistedUser?.isActive ?? true,
    projectId: persistedUser?.projectId,
    createdAt: persistedUser?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
