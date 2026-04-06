import type { PaymentPlan } from '../../../constants/payment-plans';
import { createPaymentPreference } from '../../../services/payment.service';

export const createPaymentPreferenceForPlan = async (plan: PaymentPlan) =>
  createPaymentPreference(plan);
