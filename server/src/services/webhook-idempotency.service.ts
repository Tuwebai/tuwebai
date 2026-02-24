import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAdminFirestore } from '../config/firebase-admin';
import { appLogger } from '../utils/app-logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const processedDir = path.join(__dirname, '../../../logs/mercadopago/processed');

const ensureProcessedDir = async () => {
  await fs.mkdir(processedDir, { recursive: true });
};

const normalizePaymentId = (paymentId: string | number): string =>
  String(paymentId).replace(/[^a-zA-Z0-9_-]/g, '_');

const registerProcessedPaymentFirestore = async (
  paymentId: string | number,
  metadata?: Record<string, unknown>
): Promise<boolean | null> => {
  const db = getAdminFirestore();
  if (!db) return null;

  const safeId = normalizePaymentId(paymentId);
  const ref = db.collection('webhook_idempotency').doc(`payment_${safeId}`);

  try {
    await ref.create({
      paymentId: String(paymentId),
      processedAt: new Date().toISOString(),
      source: 'mercadopago-webhook',
      ...metadata,
    });
    return true;
  } catch (error: any) {
    if (error?.code === 6 || error?.code === 'already-exists') {
      return false;
    }
    appLogger.warn('idempotency.firestore_create_failed', {
      paymentId: String(paymentId),
      error: error?.message,
    });
    return null;
  }
};

/**
 * Persistent idempotency lock based on atomic file creation.
 * Returns false when the payment was already seen before.
 */
export const registerProcessedPayment = async (
  paymentId: string | number,
  metadata?: Record<string, unknown>
): Promise<boolean> => {
  const firestoreResult = await registerProcessedPaymentFirestore(paymentId, metadata);
  if (typeof firestoreResult === 'boolean') {
    return firestoreResult;
  }

  appLogger.warn('idempotency.using_local_fallback', {
    paymentId: String(paymentId),
    reason: 'Firestore no disponible',
  });

  await ensureProcessedDir();

  const safeId = normalizePaymentId(paymentId);
  const filePath = path.join(processedDir, `${safeId}.json`);

  try {
    const handle = await fs.open(filePath, 'wx');
    await handle.writeFile(
      JSON.stringify(
        {
          paymentId: String(paymentId),
          processedAt: new Date().toISOString(),
          ...metadata,
        },
        null,
        2
      ),
      'utf8'
    );
    await handle.close();
    return true;
  } catch (error: any) {
    if (error?.code === 'EEXIST') {
      return false;
    }
    throw error;
  }
};
