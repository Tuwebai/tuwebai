import { env } from '../../config/env.config';
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

const BREVO_TIMEOUT_MS = 8000;

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

  void syncConfirmedSubscriber(subscriber)
    .then(() => {
      appLogger.info(`${options.event}.synced`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
      });
    })
    .catch((error: unknown) => {
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

  void syncUnsubscribedSubscriber(subscriber)
    .then(() => {
      appLogger.info(`${options.event}.synced`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
      });
    })
    .catch((error: unknown) => {
      appLogger.warn(`${options.event}.failed`, {
        ...(options.meta || {}),
        emailNormalized: subscriber.emailNormalized,
        status: subscriber.status,
        error: error instanceof Error ? error.message : 'Unknown Brevo sync error',
      });
    });
};
