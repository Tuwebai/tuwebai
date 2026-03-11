import { useEffect, useState } from 'react';
import { getPaymentStatus, getPaymentsErrorMessage } from '../services/payments.service';
import type { PaymentStatusPayload } from '../types';

export const usePaymentStatus = (paymentId: string | null) => {
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [status, setStatus] = useState<PaymentStatusPayload | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentId) return;

    let cancelled = false;
    const loadStatus = async () => {
      setIsRefreshingStatus(true);
      setStatusError(null);
      try {
        const data = await getPaymentStatus(paymentId);
        if (!cancelled) {
          setStatus(data);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setStatusError(getPaymentsErrorMessage(error, 'No se pudo validar el estado del pago'));
        }
      } finally {
        if (!cancelled) {
          setIsRefreshingStatus(false);
        }
      }
    };

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  return {
    isRefreshingStatus,
    status,
    statusError,
  };
};
