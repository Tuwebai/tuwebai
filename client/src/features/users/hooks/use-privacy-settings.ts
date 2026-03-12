import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserPrivacy, updateUserPrivacy } from '../services/privacy.service';
import type { UpdateUserPrivacyPayload, UserPrivacySettings } from '../types/privacy';

const getPrivacyQueryKey = (uid: string) => ['userPrivacy', uid] as const;

export const useUserPrivacyQuery = (uid: string | null | undefined) =>
  useQuery({
    queryKey: uid ? getPrivacyQueryKey(uid) : ['userPrivacy', 'anonymous'],
    queryFn: () => getUserPrivacy(uid ?? ''),
    enabled: Boolean(uid),
  });

export const useUpdateUserPrivacyMutation = (uid: string | null | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserPrivacyPayload) => {
      if (!uid) {
        throw new Error('uid requerido para actualizar privacidad');
      }

      return updateUserPrivacy(uid, payload);
    },
    onSuccess: (data: UserPrivacySettings) => {
      if (!uid) {
        return;
      }

      queryClient.setQueryData(getPrivacyQueryKey(uid), data);
    },
  });
};
