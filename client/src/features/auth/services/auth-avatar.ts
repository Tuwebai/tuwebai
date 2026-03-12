import type { User as FirebaseUser, UserInfo } from 'firebase/auth';

const GOOGLE_PROVIDER_ID = 'google.com';

const getProviderPhoto = (providerData: UserInfo[]) =>
  providerData.find((provider) => provider.providerId === GOOGLE_PROVIDER_ID && provider.photoURL)?.photoURL?.trim() ||
  providerData.find((provider) => provider.photoURL)?.photoURL?.trim() ||
  '';

export const isGoogleAuthUser = (firebaseUser: FirebaseUser | null) =>
  !!firebaseUser?.providerData.some((provider) => provider.providerId === GOOGLE_PROVIDER_ID);

export const resolveAuthAvatar = (firebaseUser: FirebaseUser | null, persistedImage?: string) => {
  if (!firebaseUser) {
    return persistedImage?.trim() || '';
  }

  const providerPhoto = firebaseUser.photoURL?.trim() || getProviderPhoto(firebaseUser.providerData);
  const storedPhoto = persistedImage?.trim() || '';

  if (isGoogleAuthUser(firebaseUser)) {
    return providerPhoto;
  }

  return storedPhoto || providerPhoto;
};
