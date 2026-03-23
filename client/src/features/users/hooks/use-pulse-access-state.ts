import { useEffect, useState } from 'react';

import { getPulseStatus } from '@/features/users/services/pulse.service';
import type { PulseStatusData } from '@/features/users/types/pulse';

interface UsePulseAccessStateResult {
  data?: PulseStatusData;
  isLoading: boolean;
  isError: boolean;
}

export function usePulseAccessState(email?: string): UsePulseAccessStateResult {
  const [data, setData] = useState<PulseStatusData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const isEnabled = Boolean(email?.trim());

  useEffect(() => {
    let active = true;

    if (!isEnabled) {
      setData(undefined);
      setIsLoading(false);
      setIsError(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    setIsError(false);

    void getPulseStatus(email)
      .then((nextData) => {
        if (!active) {
          return;
        }

        setData(nextData);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setData(undefined);
        setIsError(true);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [email, isEnabled]);

  return {
    data,
    isLoading,
    isError,
  };
}
