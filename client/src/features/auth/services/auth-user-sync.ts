import {
  getCurrentAuthUser,
  reloadAuthUser,
  type AuthSessionUser,
} from '@/core/auth/auth-client';
import type { User } from '@/features/auth/types';

import { isGoogleAuthUser, mergeFirebaseUserData } from './auth-avatar';

type UsersServiceModule = typeof import('@/features/users/services/users.service');

interface SyncAuthUserOptions {
  reloadBeforeSync?: boolean;
  timeoutMs?: number;
}

let usersServicePromise: Promise<UsersServiceModule> | null = null;

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => (
  new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(fallback);
    }, timeoutMs);

    promise
      .then((value) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timer);
        resolve(fallback);
      });
  })
);

export const getAuthUsersService = () => {
  if (!usersServicePromise) {
    usersServicePromise = import('@/features/users/services/users.service');
  }

  return usersServicePromise;
};

const shouldPersistMergedUser = (authUser: AuthSessionUser, nextUser: User, persistedUser: Partial<User> | null) => {
  if (!persistedUser) {
    return true;
  }

  if (nextUser.authProvider !== persistedUser.authProvider || nextUser.passwordChangedAt !== persistedUser.passwordChangedAt) {
    return true;
  }

  return isGoogleAuthUser(authUser) && (
    nextUser.uid !== persistedUser.uid ||
    nextUser.email !== persistedUser.email ||
    nextUser.name !== persistedUser.name ||
    nextUser.username !== persistedUser.username ||
    nextUser.image !== persistedUser.image
  );
};

export const syncAuthSessionUser = async (
  authUser: AuthSessionUser | null,
  options: SyncAuthUserOptions = {},
): Promise<User | null> => {
  if (!authUser) {
    return null;
  }

  const { getUser, setUser } = await getAuthUsersService();
  const { reloadBeforeSync = false, timeoutMs } = options;

  if (reloadBeforeSync && timeoutMs) {
    await withTimeout(reloadAuthUser(authUser), timeoutMs, undefined);
  } else if (reloadBeforeSync) {
    await reloadAuthUser(authUser);
  }

  const currentAuthUser = getCurrentAuthUser() ?? authUser;
  const persistedUser = timeoutMs
    ? await withTimeout(getUser(currentAuthUser.uid), timeoutMs, null)
    : await getUser(currentAuthUser.uid);
  const nextUser = mergeFirebaseUserData(currentAuthUser, persistedUser);

  if (shouldPersistMergedUser(currentAuthUser, nextUser, persistedUser)) {
    await setUser(nextUser);
  }

  return nextUser;
};
