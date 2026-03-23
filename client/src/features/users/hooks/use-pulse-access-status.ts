import { useQuery } from '@tanstack/react-query';
import { getPulseStatus } from '@/features/users/services/pulse.service';
import type { PulseStatusData } from '@/features/users/types/pulse';

export function usePulseAccessStatus(enabled: boolean) {
  return useQuery<PulseStatusData>({
    queryKey: ['pulse-access-status'],
    queryFn: () => getPulseStatus(),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
