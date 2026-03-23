import { useQuery } from '@tanstack/react-query';
import { getPulsePreview } from '@/features/users/services/pulse.service';
import type { PulsePreviewData } from '@/features/users/types/pulse';

export function usePulsePreview(email?: string | null) {
  return useQuery<PulsePreviewData>({
    queryKey: ['pulse-preview', email],
    queryFn: () => getPulsePreview(email || ''),
    enabled: Boolean(email),
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
}
