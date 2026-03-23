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
    let intervalId: number | null = null;

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

    const runPulseStatusCheck = () =>
      getPulseStatus(email)
      .then((nextData) => {
        if (!active) {
          return;
        }

        setData(nextData);
        setIsError(false);
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

    void runPulseStatusCheck();

    intervalId = window.setInterval(() => {
      void runPulseStatusCheck();
    }, 10000);

    return () => {
      active = false;
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [email, isEnabled]);

  return {
    data,
    isLoading,
    isError,
  };
}
