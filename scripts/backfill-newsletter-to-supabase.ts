import { createHash } from 'node:crypto';

import { getFirestore } from '../server/src/infrastructure/firebase/firestore.ts';
import { supabaseAdminRestRequest } from '../server/src/infrastructure/database/supabase/supabase-admin-rest.ts';

type NewsletterStatus = 'pending_confirmation' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
type BrevoStatus = 'pending' | 'synced' | 'failed';
type BrevoOperation = 'subscribe' | 'unsubscribe';

type FirestoreNewsletterSubscriber = {
  bouncedAt?: string;
  brevoSync?: {
    lastAttemptAt?: string;
    lastError?: string;
    lastOperation?: BrevoOperation;
    lastSyncedAt?: string;
    retryCount?: number;
    status?: BrevoStatus;
  };
  complainedAt?: string;
  confirmedAt?: string;
  consent?: {
    ipAddress?: string | null;
    submittedAt?: string;
    userAgent?: string | null;
  };
  createdAt?: string;
  email?: string;
  emailNormalized?: string;
  firstSource?: string;
  lastSource?: string;
  lastSubmittedAt?: string;
  sources?: string[];
  status?: NewsletterStatus;
  submissionCount?: number;
  unsubscribedAt?: string;
  updatedAt?: string;
};

const createDeterministicUuid = (input: string): string => {
  const hash = createHash('sha256').update(input).digest('hex');
  const hex = hash.slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ['8', '9', 'a', 'b'][parseInt(hex[16], 16) % 4];
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20, 32).join('')}`;
};

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const normalizeDate = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : fallback;

const normalizeStatus = (value: unknown): NewsletterStatus =>
  value === 'subscribed' ||
  value === 'unsubscribed' ||
  value === 'bounced' ||
  value === 'complained'
    ? value
    : 'pending_confirmation';

const normalizeBrevoStatus = (value: unknown): BrevoStatus | null =>
  value === 'pending' || value === 'synced' || value === 'failed' ? value : null;

const normalizeBrevoOperation = (value: unknown): BrevoOperation | null =>
  value === 'subscribe' || value === 'unsubscribe' ? value : null;

const upsertRows = async (path: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) {
    return;
  }

  await supabaseAdminRestRequest(path, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
};

const db = getFirestore();
if (!db) {
  console.error('FIRESTORE_UNAVAILABLE');
  process.exit(1);
}

const snapshot = await db.collection('newsletter_subscribers').get();
const nowIso = new Date().toISOString();
const subscriberRows: Record<string, unknown>[] = [];
const statusCounts: Record<string, number> = {};
const syncCounts: Record<string, number> = {};
const skipped: string[] = [];

for (const doc of snapshot.docs) {
  const subscriber = doc.data() as FirestoreNewsletterSubscriber;
  const emailNormalized =
    normalizeString(subscriber.emailNormalized) ?? normalizeString(subscriber.email)?.toLowerCase() ?? null;
  const email = normalizeString(subscriber.email);

  if (!emailNormalized || !email) {
    skipped.push(doc.id);
    continue;
  }

  const status = normalizeStatus(subscriber.status);
  const createdAt = normalizeDate(subscriber.createdAt, nowIso);
  const updatedAt = normalizeDate(subscriber.updatedAt, createdAt);
  const consentSubmittedAt = normalizeDate(subscriber.consent?.submittedAt, updatedAt);
  const brevoStatus = normalizeBrevoStatus(subscriber.brevoSync?.status);
  const brevoLastOperation = normalizeBrevoOperation(subscriber.brevoSync?.lastOperation);

  subscriberRows.push({
    id: createDeterministicUuid(`newsletter:${emailNormalized}`),
    email,
    email_normalized: emailNormalized,
    legacy_firestore_id: doc.id,
    status,
    created_at: createdAt,
    confirmed_at: normalizeString(subscriber.confirmedAt),
    unsubscribed_at: normalizeString(subscriber.unsubscribedAt),
    bounced_at: normalizeString(subscriber.bouncedAt),
    complained_at: normalizeString(subscriber.complainedAt),
    updated_at: updatedAt,
    last_submitted_at: normalizeDate(subscriber.lastSubmittedAt, updatedAt),
    first_source: normalizeString(subscriber.firstSource) ?? 'website',
    last_source: normalizeString(subscriber.lastSource) ?? normalizeString(subscriber.firstSource) ?? 'website',
    sources: Array.isArray(subscriber.sources) && subscriber.sources.length > 0 ? subscriber.sources : ['website'],
    submission_count: typeof subscriber.submissionCount === 'number' ? subscriber.submissionCount : 1,
    consent_ip_address: normalizeString(subscriber.consent?.ipAddress),
    consent_user_agent: normalizeString(subscriber.consent?.userAgent),
    consent_submitted_at: consentSubmittedAt,
    brevo_sync_status: brevoStatus,
    brevo_last_operation: brevoLastOperation,
    brevo_last_attempt_at: normalizeString(subscriber.brevoSync?.lastAttemptAt),
    brevo_last_synced_at: normalizeString(subscriber.brevoSync?.lastSyncedAt),
    brevo_last_error: normalizeString(subscriber.brevoSync?.lastError),
    brevo_retry_count: typeof subscriber.brevoSync?.retryCount === 'number' ? subscriber.brevoSync.retryCount : 0,
  });

  statusCounts[status] = (statusCounts[status] ?? 0) + 1;
  if (brevoStatus) {
    syncCounts[brevoStatus] = (syncCounts[brevoStatus] ?? 0) + 1;
  }
}

await upsertRows('/newsletter_subscribers?on_conflict=email_normalized', subscriberRows);

console.log(
  JSON.stringify({
    firestoreSubscribers: snapshot.size,
    migratedSubscribers: subscriberRows.length,
    skipped,
    statusCounts,
    syncCounts,
  }),
);
