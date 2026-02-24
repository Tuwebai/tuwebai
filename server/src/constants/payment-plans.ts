export const PAYMENT_PLAN_VALUES = ['esencial', 'avanzado', 'premium'] as const;

export type PaymentPlan = (typeof PAYMENT_PLAN_VALUES)[number];

export const PAYMENT_PLAN_CONFIG: Record<
  PaymentPlan,
  { title: string; unitPrice: number }
> = {
  esencial: { title: 'Plan Basico', unitPrice: 299000 },
  avanzado: { title: 'Plan Profesional', unitPrice: 499000 },
  premium: { title: 'Plan Enterprise', unitPrice: 999000 },
};
