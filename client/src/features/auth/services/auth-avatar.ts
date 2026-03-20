import type { User as FirebaseUser, UserInfo } from 'firebase/auth';
import type { User } from '@/features/users/types';

const GOOGLE_PROVIDER_ID = 'google.com';
const PASSWORD_PROVIDER_ID = 'password';

const getProviderPhoto = (providerData: UserInfo[]) =>
  providerData.find((provider) => provider.providerId === GOOGLE_PROVIDER_ID && provider.photoURL)?.photoURL?.trim() ||
  providerData.find((provider) => provider.photoURL)?.photoURL?.trim() ||
  '';

export const isGoogleAuthUser = (firebaseUser: FirebaseUser | null) =>
  !!firebaseUser?.providerData.some((provider) => provider.providerId === GOOGLE_PROVIDER_ID);

const isPasswordAuthUser = (firebaseUser: FirebaseUser | null) =>
  !!firebaseUser?.providerData.some((provider) => provider.providerId === PASSWORD_PROVIDER_ID);

export const resolveAuthAvatar = (firebaseUser: FirebaseUser | null, persistedImage?: string) => {
  if (!firebaseUser) {
    return persistedImage?.trim() || '';
  }

  const providerPhoto = firebaseUser.photoURL?.trim() || getProviderPhoto(firebaseUser.providerData);
  const storedPhoto = persistedImage?.trim() || '';

  if (isGoogleAuthUser(firebaseUser)) {
    return providerPhoto || storedPhoto;
  }

  return storedPhoto || providerPhoto;
};

export const mergeFirebaseUserData = (firebaseUser: FirebaseUser, persistedUser?: Partial<User> | null): User => ({
  authProvider: isGoogleAuthUser(firebaseUser)
    ? 'google'
    : (persistedUser?.authProvider || (isPasswordAuthUser(firebaseUser) ? 'password' : 'password')),
  uid: firebaseUser.uid,
  email: firebaseUser.email || persistedUser?.email || '',
  username: persistedUser?.username || firebaseUser.displayName || '',
  name: persistedUser?.name || firebaseUser.displayName || '',
  image: resolveAuthAvatar(firebaseUser, persistedUser?.image),
  passwordChangedAt: isGoogleAuthUser(firebaseUser)
    ? null
    : (persistedUser?.passwordChangedAt || persistedUser?.createdAt || firebaseUser.metadata.creationTime || new Date().toISOString()),
  role: persistedUser?.role,
  isActive: persistedUser?.isActive ?? true,
  projectId: persistedUser?.projectId,
  createdAt: persistedUser?.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
