import { getFirestore as getAdminFirestore } from '../../infrastructure/firebase/firestore';
import { appLogger } from '../../utils/app-logger';
import { storeSubmission } from '../../utils/submission-store';

export interface NewsletterSubscriptionContext {
  email: string;
  source: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface NewsletterSubscriberRecord {
  email: string;
  emailNormalized: string;
  status: 'pending_confirmation' | 'subscribed' | 'unsubscribed';
  createdAt: string;
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
}

const NEWSLETTER_COLLECTION = 'newsletter_subscribers';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const getSubscriberDocumentId = (emailNormalized: string): string =>
  Buffer.from(emailNormalized, 'utf8').toString('base64url');

const uniqueSources = (sources: string[]): string[] => Array.from(new Set(sources.filter(Boolean)));

const buildSubscriberRecord = (
  existing: Partial<NewsletterSubscriberRecord> | undefined,
  context: NewsletterSubscriptionContext,
  nowIso: string,
): NewsletterSubscriberRecord => {
  const emailNormalized = normalizeEmail(context.email);
  const existingSources = Array.isArray(existing?.sources) ? existing.sources : [];

  return {
    email: existing?.email || context.email.trim(),
    emailNormalized,
    status: existing?.status || 'pending_confirmation',
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
};

const persistNewsletterFallback = (
  subscriber: NewsletterSubscriberRecord,
): NewsletterSubscriptionResult => {
  storeSubmission('newsletter', subscriber);

  return {
    isExistingSubscriber: false,
    persistedIn: 'fallback',
    subscriber,
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
  };
};
