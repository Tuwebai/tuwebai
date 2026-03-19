import crypto from 'crypto';

import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import {
  queueBrevoNewsletterSubscribeSync,
  queueBrevoNewsletterUnsubscribeSync,
} from '../../infrastructure/mail/brevo-newsletter.service';
import { env } from '../../config/env.config';
import { appLogger } from '../../utils/app-logger';
import { storeSubmission } from '../../utils/submission-store';

export interface NewsletterSubscriptionContext {
  email: string;
  source: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface NewsletterSubscriberRecord {
  email: string;
  emailNormalized: string;
  status: 'pending_confirmation' | 'subscribed' | 'unsubscribed';
  createdAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  updatedAt: string;
  lastSubmittedAt: string;
  firstSource: string;
  lastSource: string;
  sources: string[];
  submissionCount: number;
  consent: {
    ipAddress: string | null;
    userAgent: string | null;
    submittedAt: string;
  };
}

export interface NewsletterSubscriptionResult {
  isExistingSubscriber: boolean;
  persistedIn: 'firestore' | 'fallback';
  subscriber: NewsletterSubscriberRecord;
  confirmationToken: string | null;
}

interface NewsletterActionResult {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriberRecord;
  unsubscribeToken?: string | null;
}

const NEWSLETTER_COLLECTION = 'newsletter_subscribers';
const NEWSLETTER_CONFIRM_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 2;

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

const persistNewsletterFallback = (
  subscriber: NewsletterSubscriberRecord,
): NewsletterSubscriptionResult => {
  storeSubmission('newsletter', subscriber);

  return {
    isExistingSubscriber: false,
    persistedIn: 'fallback',
    subscriber,
    confirmationToken: null,
  };
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
  const db = getAdminFirestore();

  if (!db) {
    appLogger.warn('newsletter.firestore_unavailable_using_fallback', {
      emailNormalized: normalizeEmail(context.email),
    });

    const subscriber = buildSubscriberRecord(undefined, normalizedContext, nowIso);
    return persistNewsletterFallback(subscriber);
  }

  const emailNormalized = normalizeEmail(context.email);
  const subscriberId = getSubscriberDocumentId(emailNormalized);
  const subscriberRef = db.collection(NEWSLETTER_COLLECTION).doc(subscriberId);
  const snapshot = await subscriberRef.get();
  const existing = snapshot.exists ? (snapshot.data() as Partial<NewsletterSubscriberRecord>) : undefined;
  const subscriber = buildSubscriberRecord(existing, normalizedContext, nowIso);

  await subscriberRef.set(subscriber, { merge: true });

  return {
    isExistingSubscriber: snapshot.exists,
    persistedIn: 'firestore',
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

  const db = getAdminFirestore();
  if (!db) {
    return {
      success: false,
      message: 'No se pudo confirmar la suscripcion en este momento.',
    };
  }

  const subscriberRef = db.collection(NEWSLETTER_COLLECTION).doc(getSubscriberDocumentId(decoded.emailNormalized));
  const snapshot = await subscriberRef.get();

  if (!snapshot.exists) {
    return {
      success: false,
      message: 'No encontramos una suscripcion pendiente para este enlace.',
    };
  }

  const existing = snapshot.data() as NewsletterSubscriberRecord;
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

  await subscriberRef.set(nextSubscriber, { merge: true });
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

  const db = getAdminFirestore();
  if (!db) {
    return {
      success: false,
      message: 'No se pudo procesar la baja en este momento.',
    };
  }

  const subscriberRef = db.collection(NEWSLETTER_COLLECTION).doc(getSubscriberDocumentId(decoded.emailNormalized));
  const snapshot = await subscriberRef.get();

  if (!snapshot.exists) {
    return {
      success: false,
      message: 'No encontramos una suscripcion activa para este enlace.',
    };
  }

  const existing = snapshot.data() as NewsletterSubscriberRecord;
  const nowIso = new Date().toISOString();
  const nextSubscriber: NewsletterSubscriberRecord = {
    ...existing,
    status: 'unsubscribed',
    unsubscribedAt: existing.unsubscribedAt || nowIso,
    updatedAt: nowIso,
  };

  await subscriberRef.set(nextSubscriber, { merge: true });
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
