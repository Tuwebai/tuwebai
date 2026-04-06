import crypto from 'crypto';

import { env } from '../../../config/env.config';
import { getNewsletterRepositoryService } from './newsletter.repository-service';
import type {
  NewsletterSubscriberRecord,
  NewsletterSubscriptionContext,
} from '../domain/newsletter.repository';

export interface NewsletterSubscriptionResult {
  isExistingSubscriber: boolean;
  persistedIn: 'supabase';
  subscriber: NewsletterSubscriberRecord;
  confirmationToken: string | null;
}

export interface NewsletterWebhookResult {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriberRecord;
}

export interface NewsletterReconcileResult {
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

export interface NewsletterActionResult {
  success: boolean;
  message: string;
  subscriber?: NewsletterSubscriberRecord;
  unsubscribeToken?: string | null;
  justConfirmed?: boolean;
}

const NEWSLETTER_CONFIRM_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 2;

export const newsletterRepository = getNewsletterRepositoryService();

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const getSubscriberDocumentId = (emailNormalized: string): string =>
  Buffer.from(emailNormalized, 'utf8').toString('base64url');

export const uniqueSources = (sources: string[]): string[] => Array.from(new Set(sources.filter(Boolean)));

export const omitUndefinedFields = <T extends Record<string, unknown>>(record: T): T =>
  Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as T;

const resolveSubscriptionStatus = (
  existingStatus: NewsletterSubscriberRecord['status'] | undefined,
): NewsletterSubscriberRecord['status'] => (existingStatus === 'subscribed' ? 'subscribed' : 'pending_confirmation');

const createNewsletterSignature = (payload: string): string =>
  crypto.createHmac('sha256', env.SESSION_SECRET).update(payload).digest('base64url');

export const encodeNewsletterToken = (
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

export const decodeNewsletterToken = (
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

export const buildSubscriberRecord = (
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
