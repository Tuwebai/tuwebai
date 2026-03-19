import { env } from '../../config/env.config';
import { getFirestore as getAdminFirestore } from '../firebase/firestore';
import { appLogger } from '../../utils/app-logger';

interface BrevoNewsletterSubscriber {
  email: string;
  emailNormalized: string;
  status: 'pending_confirmation' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
}

interface BackgroundSyncOptions {
  event: string;
  meta?: Record<string, unknown>;
}

type BrevoSyncOperation = 'subscribe' | 'unsubscribe';

const omitUndefinedFields = <T extends Record<string, unknown>>(record: T): T =>
  Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as T;

const BREVO_TIMEOUT_MS = 8000;
const NEWSLETTER_COLLECTION = 'newsletter_subscribers';

const getSubscriberDocumentId = (emailNormalized: string): string =>
  Buffer.from(emailNormalized, 'utf8').toString('base64url');

const isBrevoNewsletterSyncConfigured = (): boolean =>
  !!env.BREVO_API_KEY?.trim() && Number.isInteger(env.BREVO_NEWSLETTER_LIST_ID);

const getBrevoApiHeaders = (): Record<string, string> => ({
  accept: 'application/json',
  'api-key': env.BREVO_API_KEY!.trim(),
  'content-type': 'application/json',
});

const brevoRequest = async (path: string, init: RequestInit): Promise<void> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);

  try {
    const response = await fetch(`${env.BREVO_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...getBrevoApiHeaders(),
        ...(init.headers || {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Brevo API ${response.status}: ${body}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

const markBrevoSyncState = async (
  subscriber: BrevoNewsletterSubscriber,
  operation: BrevoSyncOperation,
  state: 'pending' | 'synced' | 'failed',
  errorMessage?: string,
): Promise<void> => {
  const db = getAdminFirestore();
  if (!db) return;

  const subscriberRef = db.collection(NEWSLETTER_COLLECTION).doc(getSubscriberDocumentId(subscriber.emailNormalized));
  const snapshot = await subscriberRef.get();
  if (!snapshot.exists) return;

  const existing = snapshot.data() as {
    brevoSync?: {
      retryCount?: number;
    };
  };

  const nowIso = new Date().toISOString();
  const nextRetryCount =
    state === 'pending'
      ? ((existing?.brevoSync?.retryCount ?? 0) + 1)
      : (existing?.brevoSync?.retryCount ?? 1);

  await subscriberRef.set(
    {
      brevoSync: omitUndefinedFields({
        status: state,
        lastOperation: operation,
        lastAttemptAt: nowIso,
        lastSyncedAt: state === 'synced' ? nowIso : undefined,
        lastError: state === 'failed' ? errorMessage || 'Unknown Brevo sync error' : undefined,
        retryCount: nextRetryCount,
      }),
    },
    { merge: true },
  );
};

const syncConfirmedSubscriber = async (subscriber: BrevoNewsletterSubscriber): Promise<void> => {
  await brevoRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email: subscriber.email,
      updateEnabled: true,
      listIds: [env.BREVO_NEWSLETTER_LIST_ID],
    }),
  });
};

const syncUnsubscribedSubscriber = async (subscriber: BrevoNewsletterSubscriber): Promise<void> => {
  await brevoRequest(`/contacts/lists/${env.BREVO_NEWSLETTER_LIST_ID}/contacts/remove`, {
    method: 'POST',
    body: JSON.stringify({
      emails: [subscriber.email],
    }),
  });
};

export const queueBrevoNewsletterSubscribeSync = (
  subscriber: BrevoNewsletterSubscriber,
  options: BackgroundSyncOptions,
): void => {
  if (!isBrevoNewsletterSyncConfigured()) {
    appLogger.info(`${options.event}.skipped_not_configured`, options.meta || {});
    return;
  }

  void markBrevoSyncState(subscriber, 'subscribe', 'pending')
    .catch(() => undefined)
    .then(() => syncConfirmedSubscriber(subscriber))
    .then(() => {
      void markBrevoSyncState(subscriber, 'subscribe', 'synced').catch(() => undefined);
      appLogger.info(`${options.event}.synced`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
      });
    })
    .catch((error: unknown) => {
      void markBrevoSyncState(
        subscriber,
        'subscribe',
        'failed',
        error instanceof Error ? error.message : 'Unknown Brevo sync error',
      ).catch(() => undefined);
      appLogger.warn(`${options.event}.failed`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
        error: error instanceof Error ? error.message : 'Unknown Brevo sync error',
      });
    });
};

export const queueBrevoNewsletterUnsubscribeSync = (
  subscriber: BrevoNewsletterSubscriber,
  options: BackgroundSyncOptions,
): void => {
  if (!isBrevoNewsletterSyncConfigured()) {
    appLogger.info(`${options.event}.skipped_not_configured`, options.meta || {});
    return;
  }

  void markBrevoSyncState(subscriber, 'unsubscribe', 'pending')
    .catch(() => undefined)
    .then(() => syncUnsubscribedSubscriber(subscriber))
    .then(() => {
      void markBrevoSyncState(subscriber, 'unsubscribe', 'synced').catch(() => undefined);
      appLogger.info(`${options.event}.synced`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
      });
    })
    .catch((error: unknown) => {
      void markBrevoSyncState(
        subscriber,
        'unsubscribe',
        'failed',
        error instanceof Error ? error.message : 'Unknown Brevo sync error',
      ).catch(() => undefined);
      appLogger.warn(`${options.event}.failed`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
        error: error instanceof Error ? error.message : 'Unknown Brevo sync error',
      });
    });
};
