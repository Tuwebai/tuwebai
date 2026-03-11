import type { PaymentPlan } from '@/lib/backend-api';

export type { PaymentPlan };

export interface PaymentStatusPayload {
  status?: string;
  status_detail?: string;
  transaction_amount?: number;
  currency_id?: string;
}
