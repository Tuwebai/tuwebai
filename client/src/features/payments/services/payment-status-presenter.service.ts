import type { PaymentStatusPayload } from '../types';

interface PaymentStatusSummary {
  amountLabel: string | null;
  statusLabel: string | null;
}

export const getPaymentStatusSummary = (
  status: PaymentStatusPayload | null,
): PaymentStatusSummary => {
  if (!status) {
    return {
      amountLabel: null,
      statusLabel: null,
    };
  }

  const amountLabel =
    typeof status.transaction_amount === 'number'
      ? `${status.transaction_amount} ${status.currency_id || ''}`.trim()
      : null;

  return {
    amountLabel,
    statusLabel: status.status ?? null,
  };
};
