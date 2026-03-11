import { useQuery } from '@tanstack/react-query';
import type { UserPreferences } from '../types';

let usersServicePromise: Promise<any> | null = null;

const getUsersService = () => {
  if (!usersServicePromise) usersServicePromise = import('@/features/users/services/users.service');
  return usersServicePromise;
};

export const useUserPreferencesQuery = (uid: string | undefined) => {
  return useQuery<UserPreferences | null>({
    queryKey: ['userPreferences', uid],
    queryFn: async () => {
      if (!uid) return null;
      const { getUserPreferences } = await getUsersService();
      const prefs = await getUserPreferences(uid);
      return prefs || null;
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 5,
  });
};
