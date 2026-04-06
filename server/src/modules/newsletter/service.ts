import crypto from 'crypto';

import {
  queueBrevoNewsletterSubscribeSync,
  queueBrevoNewsletterUnsubscribeSync,
} from '../../infrastructure/mail/brevo-newsletter.service';
import { getNewsletterRepositoryService } from './application/newsletter.repository-service';
import { env } from '../../config/env.config';
import { appLogger } from '../../utils/app-logger';
import type {
  NewsletterSubscriberRecord,
  NewsletterSubscriptionContext,
} from './domain/newsletter.repository';

export interface NewsletterSubscriptionResult {
  isExistingSubscriber: boolean;
  persistedIn: 'supabase';
  subscriber: NewsletterSubscriberRecord;
  confirmationToken: string | null;
}

interface NewsletterWebhookResult {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriberRecord;
}

interface NewsletterReconcileResult {
  success: boolean;
  message: string;
  scanned: number;
  scheduled: number;
  items: Array<{
    emailNormalized: string;
    operation: 'subscribe' | 'unsubscribe';
    status: NewsletterSubscriberRecord['status'];
  }>;
}

interface NewsletterActionResult {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriberRecord;
  unsubscribeToken?: string | null;
  justConfirmed?: boolean;
}

const NEWSLETTER_CONFIRM_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 2;
const newsletterRepository = getNewsletterRepositoryService();

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const getSubscriberDocumentId = (emailNormalized: string): string =>
  Buffer.from(emailNormalized, 'utf8').toString('base64url');

const uniqueSources = (sources: string[]): string[] => Array.from(new Set(sources.filter(Boolean)));

const omitUndefinedFields = <T extends Record<string, unknown>>(record: T): T =>
  Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as T;

const resolveSubscriptionStatus = (
  existingStatus: NewsletterSubscriberRecord['status'] | undefined,
): NewsletterSubscriberRecord['status'] => (existingStatus === 'subscribed' ? 'subscribed' : 'pending_confirmation');

const createNewsletterSignature = (payload: string): string =>
  crypto.createHmac('sha256', env.SESSION_SECRET).update(payload).digest('base64url');

const encodeNewsletterToken = (
  emailNormalized: string,
  purpose: 'newsletter-confirmation' | 'newsletter-unsubscribe',
): string => {
  const payload = JSON.stringify({
    emailNormalized,
    exp: Date.now() + NEWSLETTER_CONFIRM_TOKEN_TTL_MS,
    purpose,
  });
  const payloadBase64 = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = createNewsletterSignature(payloadBase64);
  return `${payloadBase64}.${signature}`;
};

const decodeNewsletterToken = (
  token: string,
  expectedPurpose: 'newsletter-confirmation' | 'newsletter-unsubscribe',
): { emailNormalized: string; exp: number; purpose: string } | null => {
  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = createNewsletterSignature(payloadBase64);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as {
      emailNormalized?: string;
      exp?: number;
      purpose?: string;
    };

    if (
      !payload.emailNormalized ||
      typeof payload.exp !== 'number' ||
      payload.purpose !== expectedPurpose ||
      payload.exp < Date.now()
    ) {
      return null;
    }

    return {
      emailNormalized: payload.emailNormalized,
      exp: payload.exp,
      purpose: payload.purpose,
    };
  } catch {
    return null;
  }
};

const buildSubscriberRecord = (
  existing: Partial<NewsletterSubscriberRecord> | undefined,
  context: NewsletterSubscriptionContext,
  nowIso: string,
): NewsletterSubscriberRecord => {
  const emailNormalized = normalizeEmail(context.email);
  const existingSources = Array.isArray(existing?.sources) ? existing.sources : [];

  const nextSubscriber = {
    email: existing?.email || context.email.trim(),
    emailNormalized,
    status: resolveSubscriptionStatus(existing?.status),
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
    lastSubmittedAt: nowIso,
    firstSource: existing?.firstSource || context.source,
    lastSource: context.source,
    sources: uniqueSources([...existingSources, context.source]),
    submissionCount: typeof existing?.submissionCount === 'number' ? existing.submissionCount + 1 : 1,
    consent: {
      ipAddress: context.ipAddress ?? null,
      userAgent: context.userAgent ?? null,
      submittedAt: nowIso,
    },
  };

  return omitUndefinedFields({
    ...nextSubscriber,
    confirmedAt: existing?.status === 'subscribed' ? existing?.confirmedAt || nowIso : undefined,
  }) as NewsletterSubscriberRecord;
};

export const registerNewsletterSubscription = async (
  context: NewsletterSubscriptionContext,
): Promise<NewsletterSubscriptionResult> => {
  const nowIso = new Date().toISOString();
  const source = context.source.trim() || 'website';
  const normalizedContext: NewsletterSubscriptionContext = {
    ...context,
    source,
  };
  if (!newsletterRepository.isAvailable()) {
    appLogger.error('newsletter.supabase_repository_unavailable', {
      emailNormalized: normalizeEmail(context.email),
    });
    throw new Error('newsletter_repository_unavailable');
  }

  const emailNormalized = normalizeEmail(context.email);
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  const subscriber = buildSubscriberRecord(existing ?? undefined, normalizedContext, nowIso);

  await newsletterRepository.upsertSubscriberById(subscriberId, subscriber);

  return {
    isExistingSubscriber: !!existing,
    persistedIn: 'supabase',
    subscriber,
    confirmationToken: encodeNewsletterToken(emailNormalized, 'newsletter-confirmation'),
  };
};

export const confirmNewsletterSubscription = async (
  token: string,
): Promise<NewsletterActionResult> => {
  const decoded = decodeNewsletterToken(token, 'newsletter-confirmation');
  if (!decoded) {
    return {
      success: false,
      message: 'El enlace de confirmacion no es valido o ya vencio.',
    };
  }

  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo confirmar la suscripcion en este momento.',
    };
  }

  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos una suscripcion pendiente para este enlace.',
    };
  }
  const nowIso = new Date().toISOString();
  const nextSubscriber = omitUndefinedFields({
    ...existing,
    status: 'subscribed',
    confirmedAt: existing.confirmedAt || nowIso,
    unsubscribedAt: undefined,
    updatedAt: nowIso,
    consent: {
      ...existing.consent,
      submittedAt: existing.consent?.submittedAt || nowIso,
    },
  }) as NewsletterSubscriberRecord;

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);
  queueBrevoNewsletterSubscribeSync(nextSubscriber, {
    event: 'newsletter.brevo_subscribe',
    meta: { source: nextSubscriber.lastSource },
  });

  return {
    success: true,
    message:
      existing.status === 'subscribed'
        ? 'Tu suscripcion ya estaba confirmada.'
        : 'Tu email fue confirmado correctamente. Ya quedaste suscripto.',
    subscriber: nextSubscriber,
    unsubscribeToken: encodeNewsletterToken(decoded.emailNormalized, 'newsletter-unsubscribe'),
    justConfirmed: existing.status !== 'subscribed',
  };
};

export const unsubscribeNewsletterSubscription = async (
  token: string,
): Promise<NewsletterActionResult> => {
  const decoded = decodeNewsletterToken(token, 'newsletter-unsubscribe');
  if (!decoded) {
    return {
      success: false,
      message: 'El enlace de baja no es valido o ya vencio.',
    };
  }

  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo procesar la baja en este momento.',
    };
  }

  const subscriberId = getSubscriberDocumentId(decoded.emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos una suscripcion activa para este enlace.',
    };
  }
  const nowIso = new Date().toISOString();
  const nextSubscriber: NewsletterSubscriberRecord = {
    ...existing,
    status: 'unsubscribed',
    unsubscribedAt: existing.unsubscribedAt || nowIso,
    updatedAt: nowIso,
  };

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);
  queueBrevoNewsletterUnsubscribeSync(nextSubscriber, {
    event: 'newsletter.brevo_unsubscribe',
    meta: { source: nextSubscriber.lastSource },
  });

  return {
    success: true,
    message:
      existing.status === 'unsubscribed'
        ? 'Tu suscripcion ya estaba dada de baja.'
        : 'Tu email fue dado de baja correctamente.',
    subscriber: nextSubscriber,
  };
};

export const applyNewsletterProviderEvent = async (
  email: string,
  providerEvent: 'hard_bounce' | 'soft_bounce' | 'complaint' | 'unsubscribe',
): Promise<NewsletterWebhookResult> => {
  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo procesar el webhook en este momento.',
    };
  }

  const emailNormalized = normalizeEmail(email);
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const existing = await newsletterRepository.getSubscriberById(subscriberId);
  if (!existing) {
    return {
      success: false,
      message: 'No encontramos un suscriptor para este evento.',
    };
  }
  const nowIso = new Date().toISOString();

  const nextSubscriber = omitUndefinedFields({
    ...existing,
    status:
      providerEvent === 'complaint'
        ? 'complained'
        : providerEvent === 'unsubscribe'
          ? 'unsubscribed'
          : 'bounced',
    unsubscribedAt: providerEvent === 'unsubscribe' ? existing.unsubscribedAt || nowIso : existing.unsubscribedAt,
    bouncedAt:
      providerEvent === 'hard_bounce' || providerEvent === 'soft_bounce' ? existing.bouncedAt || nowIso : existing.bouncedAt,
    complainedAt: providerEvent === 'complaint' ? existing.complainedAt || nowIso : existing.complainedAt,
    updatedAt: nowIso,
  }) as NewsletterSubscriberRecord;

  await newsletterRepository.upsertSubscriberById(subscriberId, nextSubscriber);

  return {
    success: true,
    message: 'Evento de proveedor aplicado correctamente.',
    subscriber: nextSubscriber,
  };
};

export const reconcileNewsletterBrevoSync = async (limit = 50): Promise<NewsletterReconcileResult> => {
  if (!newsletterRepository.isAvailable()) {
    return {
      success: false,
      message: 'No se pudo reconciliar newsletter en este momento.',
      scanned: 0,
      scheduled: 0,
      items: [],
    };
  }

  const safeLimit = Math.max(1, Math.min(limit, 100));
  const subscribers = await newsletterRepository.listSubscribersForReconcile(safeLimit * 3);

  const items: NewsletterReconcileResult['items'] = [];

  for (const subscriber of subscribers) {
    const syncStatus = subscriber.brevoSync?.status;
    if (syncStatus === 'synced') continue;

    const operation = subscriber.status === 'subscribed' ? 'subscribe' : 'unsubscribe';
    items.push({
      emailNormalized: subscriber.emailNormalized,
      operation,
      status: subscriber.status,
    });

    if (operation === 'subscribe') {
      queueBrevoNewsletterSubscribeSync(subscriber, {
        event: 'newsletter.brevo_reconcile_subscribe',
        meta: { source: 'manual_reconcile' },
      });
    } else {
      queueBrevoNewsletterUnsubscribeSync(subscriber, {
        event: 'newsletter.brevo_reconcile_unsubscribe',
        meta: { source: 'manual_reconcile' },
      });
    }

    if (items.length >= safeLimit) break;
  }

  return {
    success: true,
    message:
      items.length > 0
        ? 'Reconciliacion de Brevo programada correctamente.'
        : 'No encontramos suscriptores pendientes de reconciliacion con Brevo.',
    scanned: subscribers.length,
    scheduled: items.length,
    items,
  };
};
