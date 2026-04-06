import {
  isSupabaseAdminRestReady,
  supabaseAdminRestRequest,
} from '../infrastructure/database/supabase/supabase-admin-rest';
import { createUsersSupabaseRepository } from '../modules/users/infrastructure/users-supabase.repository';

type JsonRecord = Record<string, unknown>;
type UnknownObject = object;

interface PaymentWebhookReceiptInput {
  eventType: 'payment';
  paymentId: string | number;
  paymentStatus?: string | null;
  paymentStatusDetail?: string | null;
  payload: JsonRecord;
  requestId?: string | null;
}

const PROVIDER = 'mercadopago';
const PAYMENT_PLAN_PATTERN = /^tuwebai-([a-z]+)-\d+$/i;
const usersRepository = createUsersSupabaseRepository();

const readValue = (source: UnknownObject, key: string): unknown => Reflect.get(source, key);

const readString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const readNumber = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const readObject = (value: unknown): JsonRecord | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;

const resolvePlanCode = (externalReference: string | null): string | null => {
  if (!externalReference) {
    return null;
  }

  const match = PAYMENT_PLAN_PATTERN.exec(externalReference);
  return match?.[1]?.toLowerCase() ?? null;
};

const resolveUserId = async (metadata: JsonRecord | null): Promise<string | null> => {
  if (!metadata) {
    return null;
  }

  const legacyUid = readString(metadata.user_uid) ?? readString(metadata.uid);
  const rawUserId = readString(metadata.user_id) ?? legacyUid;

  if (!rawUserId) {
    return null;
  }

  const normalizedUserId = rawUserId.toLowerCase();
  const userByUid = await usersRepository.findByUid(normalizedUserId);
  if (userByUid?.appUserId) {
    return userByUid.appUserId;
  }

  return normalizedUserId;
};

const buildReceiptKey = ({
  paymentId,
  paymentStatus,
  paymentStatusDetail,
  requestId,
}: Omit<PaymentWebhookReceiptInput, 'eventType' | 'payload'>): string =>
  readString(requestId)
    ? `request:${readString(requestId)}`
    : `payment:${String(paymentId)}:status:${paymentStatus ?? 'unknown'}:${paymentStatusDetail ?? 'unknown'}`;

const isDuplicateReceiptError = (error: unknown): boolean =>
  error instanceof Error &&
  error.message.includes('duplicate key value') &&
  error.message.includes('payment_webhook_receipts');

export const isPaymentWebhookStoreAvailable = (): boolean => isSupabaseAdminRestReady();

export const registerPaymentWebhookReceipt = async (
  input: PaymentWebhookReceiptInput,
): Promise<boolean> => {
  if (!isPaymentWebhookStoreAvailable()) {
    throw new Error('payment_webhook_store_unavailable');
  }

  const receiptRow = {
    provider: PROVIDER,
    receipt_key: buildReceiptKey(input),
    provider_payment_id: String(input.paymentId),
    provider_request_id: readString(input.requestId),
    event_type: input.eventType,
    payment_status: readString(input.paymentStatus),
    payment_status_detail: readString(input.paymentStatusDetail),
    payload: input.payload,
  };

  try {
    await supabaseAdminRestRequest('/payment_webhook_receipts', {
      method: 'POST',
      body: JSON.stringify([receiptRow]),
    });
    return true;
  } catch (error) {
    if (isDuplicateReceiptError(error)) {
      return false;
    }

    throw error;
  }
};

export const syncMercadoPagoPaymentToSupabase = async (
  paymentDetails: UnknownObject,
): Promise<void> => {
  if (!isPaymentWebhookStoreAvailable()) {
    throw new Error('payment_webhook_store_unavailable');
  }

  const externalReference = readString(readValue(paymentDetails, 'external_reference'));
  const metadata = readObject(readValue(paymentDetails, 'metadata'));
  const payer = readObject(readValue(paymentDetails, 'payer'));

  const paymentRow = {
    provider: PROVIDER,
    external_payment_id: String(readValue(paymentDetails, 'id')),
    user_id: await resolveUserId(metadata),
    external_reference: externalReference,
    plan_code: resolvePlanCode(externalReference),
    status: readString(readValue(paymentDetails, 'status')) ?? 'unknown',
    status_detail: readString(readValue(paymentDetails, 'status_detail')),
    amount: readNumber(readValue(paymentDetails, 'transaction_amount')),
    currency: readString(readValue(paymentDetails, 'currency_id')),
    payer_email: readString(payer?.email),
    payment_method_id: readString(readValue(paymentDetails, 'payment_method_id')),
    date:
      readString(readValue(paymentDetails, 'date_created')) ??
      readString(readValue(paymentDetails, 'date_last_updated')) ??
      new Date().toISOString(),
    approved_at: readString(readValue(paymentDetails, 'date_approved')),
    raw_data: paymentDetails,
  };

  await supabaseAdminRestRequest('/payments?on_conflict=external_payment_id', {
    method: 'POST',
    body: JSON.stringify([paymentRow]),
  });
};
