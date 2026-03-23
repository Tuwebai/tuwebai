import { useQuery } from '@tanstack/react-query';
import { getPulseStatus } from '@/features/users/services/pulse.service';
import type { PulseStatusData } from '@/features/users/types/pulse';

export function usePulseAccessStatus(email?: string) {
  return useQuery<PulseStatusData>({
    queryKey: ['pulse-access-status', email ?? null],
    queryFn: () => getPulseStatus(email),
    enabled: Boolean(email),
    staleTime: 1000 * 10,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending_activation' ? 10000 : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}
