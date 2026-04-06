import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getPulseStatus } from '@/features/users/services/pulse.service';
import { subscribeToPulseAccessStatus } from '@/features/users/services/pulse-realtime.service';
import type { PulseStatusData } from '@/features/users/types/pulse';

export function usePulseAccessStatus(email?: string, userUid?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['pulse-access-status', email ?? null, userUid ?? null] as const;

  const query = useQuery<PulseStatusData>({
    queryKey,
    queryFn: () => getPulseStatus(email),
    enabled: Boolean(email),
    staleTime: 1000 * 10,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending_activation' ? 10000 : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  useEffect(() => {
    if (!userUid?.trim()) {
      return undefined;
    }

    return subscribeToPulseAccessStatus({
      userUid,
      onStatusChange: ({ status }) => {
        queryClient.setQueryData<PulseStatusData>(queryKey, { status });
      },
    });
  }, [queryClient, queryKey, userUid]);

  return query;
}
