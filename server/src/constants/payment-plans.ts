export const PAYMENT_PLAN_VALUES = ['esencial', 'avanzado', 'premium'] as const;

export type PaymentPlan = (typeof PAYMENT_PLAN_VALUES)[number];

export const PAYMENT_PLAN_CONFIG: Record<
  PaymentPlan,
  { title: string; unitPrice: number }
> = {
  esencial: { title: 'Base web', unitPrice: 199000 },
  avanzado: { title: 'Proyecto comercial', unitPrice: 349000 },
  premium: { title: 'Solucion a medida', unitPrice: 649000 },
};
