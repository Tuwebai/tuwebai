import { useQuery } from '@tanstack/react-query';
import type { UserPreferences } from '@/services/firestore';

// Helper properties para cargar dinámicamente librerías pesadas
let firestorePromise: Promise<any> | null = null;
const getFirestoreService = () => {
  if (!firestorePromise) firestorePromise = import('@/services/firestore');
  return firestorePromise;
};

export const useUserPreferencesQuery = (uid: string | undefined) => {
  return useQuery<UserPreferences | null>({
    queryKey: ['userPreferences', uid],
    queryFn: async () => {
      if (!uid) return null;
      const { getUserPreferences } = await getFirestoreService();
      const prefs = await getUserPreferences(uid);
      return prefs || null;
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
