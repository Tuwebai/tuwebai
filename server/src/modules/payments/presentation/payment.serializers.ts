export const serializePaymentPreferenceResult = (initPoint: string) => ({
  init_point: initPoint,
});

export const serializePaymentHealthResult = () => ({
  ok: true,
});

export const serializePaymentStatusResult = (paymentDetails: {
  currency_id?: string | null;
  date_approved?: string | null;
  id?: string | number;
  payment_method_id?: string | null;
  status?: string | null;
  status_detail?: string | null;
  transaction_amount?: number | null;
}) => ({
  currency_id: paymentDetails.currency_id ?? null,
  date_approved: paymentDetails.date_approved ?? null,
  id: paymentDetails.id ?? null,
  payment_method_id: paymentDetails.payment_method_id ?? null,
  status: paymentDetails.status ?? null,
  status_detail: paymentDetails.status_detail ?? null,
  transaction_amount: paymentDetails.transaction_amount ?? null,
});
