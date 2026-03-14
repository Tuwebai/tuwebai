export const PAYMENT_PLAN_VALUES = ['esencial', 'avanzado', 'premium'] as const;

export type PaymentPlan = (typeof PAYMENT_PLAN_VALUES)[number];

export const PAYMENT_PLAN_CONFIG: Record<
  PaymentPlan,
  { title: string; unitPrice: number }
> = {
  esencial: { title: 'Presencia Profesional', unitPrice: 420000 },
  avanzado: { title: 'Web Comercial', unitPrice: 780000 },
  premium: { title: 'Sistema a Medida', unitPrice: 1400000 },
};
