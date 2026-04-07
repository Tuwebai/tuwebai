import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { usePaymentStatus } from '@/features/payments/hooks/use-payment-status';
import { getPaymentStatusSummary } from '@/features/payments/services/payment-status-presenter.service';
import MetaTags from '@/shared/ui/meta-tags';

type Variant = 'success' | 'failure' | 'pending';

interface PaymentReturnViewProps {
  variant: Variant;
  title: string;
  description: string;
  ctaLabel: string;
}

const variantStyles: Record<
  Variant,
  { button: string; icon: string; panel: string; title: string }
> = {
  success: {
    button: 'bg-[image:var(--gradient-brand)] shadow-[var(--glow-signal)]',
    icon: 'text-[var(--success)]',
    panel: 'border-[var(--border-default)] bg-[var(--bg-overlay)]',
    title: 'text-[var(--success)]',
  },
  failure: {
    button: 'bg-[var(--danger)]',
    icon: 'text-[var(--danger)]',
    panel: 'border-red-500/30 bg-[var(--bg-overlay)]',
    title: 'text-[var(--danger)]',
  },
  pending: {
    button: 'bg-[var(--warning)] text-slate-950',
    icon: 'text-[var(--warning)]',
    panel: 'border-[var(--warning-dim)] bg-[var(--bg-overlay)]',
    title: 'text-[var(--warning)]',
  },
};

const iconByVariant: Record<Variant, JSX.Element> = {
  success: (
    <svg className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4m5 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0z" />
    </svg>
  ),
  failure: (
    <svg className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.85l.007-.15V6c0-1.054-.816-1.918-1.85-1.995L19.856 4H4.144C3.09 4 2.226 4.816 2.149 5.85L2.142 6v12c0 1.054.816 1.918 1.85 1.995l.15.005z"
      />
    </svg>
  ),
  pending: (
    <svg className="h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 1a9 9 0 1 1-18 0a9 9 0 0 1 18 0z" />
    </svg>
  ),
};

export default function PaymentReturnView({
  variant,
  title,
  description,
  ctaLabel,
}: PaymentReturnViewProps) {
  const styles = variantStyles[variant];
  const [searchParams] = useSearchParams();
  const metaTitleByVariant: Record<Variant, string> = {
    success: 'Pago realizado con éxito',
    failure: 'Pago fallido',
    pending: 'Pago pendiente',
  };
  const metaDescriptionByVariant: Record<Variant, string> = {
    success: 'Tu pago fue procesado correctamente. Esta pantalla es informativa y no se indexa.',
    failure: 'No pudimos procesar tu pago. Esta pantalla es informativa y no se indexa.',
    pending: 'Tu pago está en proceso de acreditación. Esta pantalla es informativa y no se indexa.',
  };

  const paymentId = useMemo(
    () =>
      searchParams.get('payment_id') ||
      searchParams.get('collection_id') ||
      searchParams.get('paymentId'),
    [searchParams],
  );
  const { isRefreshingStatus, status, statusError } = usePaymentStatus(paymentId);
  const paymentStatusSummary = getPaymentStatusSummary(status);

  return (
    <>
      <MetaTags
        title={metaTitleByVariant[variant]}
        description={metaDescriptionByVariant[variant]}
        robots="noindex,follow"
      />
      <div className="page-shell-surface flex min-h-screen flex-col items-center justify-center p-4">
        <div
          className={`${styles.panel} flex w-full max-w-md flex-col items-center rounded-xl border p-8 shadow-[var(--shadow-modal)]`}
        >
          <div className={`mb-4 ${styles.icon}`}>{iconByVariant[variant]}</div>
          <h1 className={`mb-2 text-center text-2xl font-bold ${styles.title}`}>{title}</h1>
          <p className="mb-4 text-center text-[var(--text-primary)]">{description}</p>

          {paymentId ? (
            <div className="mb-5 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 text-sm text-[var(--text-primary)]">
              <p className="mb-1 font-semibold">Referencia de pago</p>
              <p className="break-all">{paymentId}</p>
              {paymentStatusSummary.statusLabel ? (
                <p className="mt-2">
                  Estado confirmado: <strong>{paymentStatusSummary.statusLabel}</strong>
                </p>
              ) : null}
              {paymentStatusSummary.amountLabel ? (
                <p className="mt-1">
                  Monto: <strong>{paymentStatusSummary.amountLabel}</strong>
                </p>
              ) : null}
              {isRefreshingStatus && !status && !statusError ? (
                <p className="mt-2 text-[var(--text-secondary)]">
                  Actualizando estado en segundo plano...
                </p>
              ) : null}
              {statusError ? <p className="mt-2 text-red-400">{statusError}</p> : null}
            </div>
          ) : null}

          <Link to="/" className={`${styles.button} rounded px-6 py-2 font-semibold text-white transition-colors`}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
