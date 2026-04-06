import { getPaymentDetails } from '../../../services/payment.service';

export const getPaymentStatusDetails = async (paymentId: string) =>
  getPaymentDetails(paymentId);
