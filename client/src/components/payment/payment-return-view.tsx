import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { backendApi } from '@/lib/backend-api';
import { getUiErrorMessage } from '@/lib/http-client';

type Variant = 'success' | 'failure' | 'pending';

interface PaymentReturnViewProps {
  variant: Variant;
  title: string;
  description: string;
  ctaLabel: string;
}

interface PaymentStatusPayload {
  status?: string;
  status_detail?: string;
  transaction_amount?: number;
  currency_id?: string;
}

const variantStyles: Record<Variant, { bg: string; card: string; icon: string; button: string; title: string }> = {
  success: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    card: 'bg-white',
    icon: 'text-green-500',
    button: 'bg-green-600 hover:bg-green-700',
    title: 'text-green-700',
  },
  failure: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    card: 'bg-white',
    icon: 'text-red-500',
    button: 'bg-red-600 hover:bg-red-700',
    title: 'text-red-700',
  },
  pending: {
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    card: 'bg-white',
    icon: 'text-yellow-500',
    button: 'bg-yellow-500 hover:bg-yellow-600',
    title: 'text-yellow-700',
  },
};

const iconByVariant: Record<Variant, JSX.Element> = {
  success: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0z" />
    </svg>
  ),
  failure: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.995L19.856 4H4.144C3.09 4 2.226 4.816 2.149 5.85L2.142 6v12c0 1.054.816 1.918 1.85 1.995l.15.005z"
      />
    </svg>
  ),
  pending: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 1 1-18 0a9 9 0 0 1 18 0z" />
    </svg>
  ),
};

export default function PaymentReturnView({ variant, title, description, ctaLabel }: PaymentReturnViewProps) {
  const styles = variantStyles[variant];
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatusPayload | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const paymentId = useMemo(
    () => searchParams.get('payment_id') || searchParams.get('collection_id') || searchParams.get('paymentId'),
    [searchParams]
  );

  useEffect(() => {
    if (!paymentId) return;

    let cancelled = false;
    const loadStatus = async () => {
      setLoading(true);
      setStatusError(null);
      try {
        const data = await backendApi.getPaymentStatus(paymentId);
        if (!data?.success) {
          throw new Error('No se pudo validar el estado del pago');
        }
        if (!cancelled) {
          setStatus(data.data ?? null);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setStatusError(getUiErrorMessage(error, 'No se pudo validar el estado del pago'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${styles.bg}`}>
      <div className={`${styles.card} rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center`}>
        <div className={`mb-4 ${styles.icon}`}>{iconByVariant[variant]}</div>
        <h1 className={`text-2xl font-bold mb-2 text-center ${styles.title}`}>{title}</h1>
        <p className="text-gray-700 mb-4 text-center">{description}</p>

        {paymentId && (
          <div className="w-full mb-5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            <p className="font-semibold mb-1">Referencia de pago</p>
            <p className="break-all">{paymentId}</p>
            {loading && <p className="mt-2 text-gray-500">Validando estado del pago...</p>}
            {!loading && status?.status && <p className="mt-2">Estado confirmado: <strong>{status.status}</strong></p>}
            {!loading && status?.transaction_amount && (
              <p className="mt-1">
                Monto: <strong>{status.transaction_amount} {status.currency_id || ''}</strong>
              </p>
            )}
            {!loading && statusError && <p className="mt-2 text-red-600">{statusError}</p>}
          </div>
        )}

        <Link to="/" className={`${styles.button} text-white font-semibold py-2 px-6 rounded transition-colors`}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
