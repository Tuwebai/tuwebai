import {
  isSupabaseAdminRestReady,
  supabaseAdminRestRequest,
} from '../../../infrastructure/database/supabase/supabase-admin-rest';
import type { NewsletterRepository, NewsletterSubscriberRecord } from '../domain/newsletter.repository';

interface NewsletterSubscriberRow {
  bounced_at: string | null;
  brevo_last_attempt_at: string | null;
  brevo_last_error: string | null;
  brevo_last_operation: 'subscribe' | 'unsubscribe' | null;
  brevo_last_synced_at: string | null;
  brevo_retry_count: number;
  brevo_sync_status: 'pending' | 'synced' | 'failed' | null;
  complained_at: string | null;
  confirmed_at: string | null;
  consent_ip_address: string | null;
  consent_submitted_at: string;
  consent_user_agent: string | null;
  created_at: string;
  email: string;
  email_normalized: string;
  first_source: string;
  last_source: string;
  last_submitted_at: string;
  legacy_subscriber_id: string | null;
  sources: string[] | null;
  status: NewsletterSubscriberRecord['status'];
  submission_count: number;
  unsubscribed_at: string | null;
  updated_at: string;
}

const NEWSLETTER_SELECT =
  'email,email_normalized,status,created_at,confirmed_at,unsubscribed_at,bounced_at,complained_at,updated_at,last_submitted_at,first_source,last_source,sources,submission_count,consent_ip_address,consent_user_agent,consent_submitted_at,brevo_sync_status,brevo_last_operation,brevo_last_attempt_at,brevo_last_synced_at,brevo_last_error,brevo_retry_count,legacy_firestore_id';

const mapRowToRecord = (row: NewsletterSubscriberRow): NewsletterSubscriberRecord => ({
  email: row.email,
  emailNormalized: row.email_normalized,
  status: row.status,
  createdAt: row.created_at,
  confirmedAt: row.confirmed_at ?? undefined,
  unsubscribedAt: row.unsubscribed_at ?? undefined,
  bouncedAt: row.bounced_at ?? undefined,
  complainedAt: row.complained_at ?? undefined,
  updatedAt: row.updated_at,
  lastSubmittedAt: row.last_submitted_at,
  firstSource: row.first_source,
  lastSource: row.last_source,
  sources: Array.isArray(row.sources) ? row.sources : [],
  submissionCount: row.submission_count,
  consent: {
    ipAddress: row.consent_ip_address,
    userAgent: row.consent_user_agent,
    submittedAt: row.consent_submitted_at,
  },
  brevoSync: row.brevo_sync_status
    ? {
        status: row.brevo_sync_status,
        lastOperation: row.brevo_last_operation!,
        lastAttemptAt: row.brevo_last_attempt_at!,
        lastSyncedAt: row.brevo_last_synced_at ?? undefined,
        lastError: row.brevo_last_error ?? undefined,
        retryCount: row.brevo_retry_count ?? 0,
      }
    : undefined,
});

const mapRecordToRow = (
  subscriberId: string,
  subscriber: NewsletterSubscriberRecord,
): Record<string, unknown> => ({
  email: subscriber.email,
  email_normalized: subscriber.emailNormalized,
  status: subscriber.status,
  created_at: subscriber.createdAt,
  confirmed_at: subscriber.confirmedAt ?? null,
  unsubscribed_at: subscriber.unsubscribedAt ?? null,
  bounced_at: subscriber.bouncedAt ?? null,
  complained_at: subscriber.complainedAt ?? null,
  updated_at: subscriber.updatedAt,
  last_submitted_at: subscriber.lastSubmittedAt,
  first_source: subscriber.firstSource,
  last_source: subscriber.lastSource,
  sources: subscriber.sources,
  submission_count: subscriber.submissionCount,
  consent_ip_address: subscriber.consent.ipAddress,
  consent_user_agent: subscriber.consent.userAgent,
  consent_submitted_at: subscriber.consent.submittedAt,
  brevo_sync_status: subscriber.brevoSync?.status ?? null,
  brevo_last_operation: subscriber.brevoSync?.lastOperation ?? null,
  brevo_last_attempt_at: subscriber.brevoSync?.lastAttemptAt ?? null,
  brevo_last_synced_at: subscriber.brevoSync?.lastSyncedAt ?? null,
  brevo_last_error: subscriber.brevoSync?.lastError ?? null,
  brevo_retry_count: subscriber.brevoSync?.retryCount ?? 0,
  legacy_firestore_id: subscriberId,
});

const findNewsletterSubscriberById = async (
  subscriberId: string,
): Promise<NewsletterSubscriberRecord | null> => {
  const rows = await supabaseAdminRestRequest<NewsletterSubscriberRow[]>(
    `/newsletter_subscribers?select=${NEWSLETTER_SELECT}&legacy_firestore_id=eq.${encodeURIComponent(subscriberId)}&limit=1`,
  );

  return rows[0] ? mapRowToRecord(rows[0]) : null;
};

const upsertNewsletterSubscriberById = async (
  subscriberId: string,
  subscriber: NewsletterSubscriberRecord,
): Promise<void> => {
  await supabaseAdminRestRequest<NewsletterSubscriberRow[]>(
    '/newsletter_subscribers?on_conflict=email_normalized',
    {
      method: 'POST',
      body: JSON.stringify([mapRecordToRow(subscriberId, subscriber)]),
    },
  );
};

const updateNewsletterBrevoSyncById = async (
  subscriberId: string,
  brevoSync: NonNullable<NewsletterSubscriberRecord['brevoSync']>,
): Promise<void> => {
  await supabaseAdminRestRequest<void>(
    `/newsletter_subscribers?legacy_firestore_id=eq.${encodeURIComponent(subscriberId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        brevo_sync_status: brevoSync.status,
        brevo_last_operation: brevoSync.lastOperation,
        brevo_last_attempt_at: brevoSync.lastAttemptAt,
        brevo_last_synced_at: brevoSync.lastSyncedAt ?? null,
        brevo_last_error: brevoSync.lastError ?? null,
        brevo_retry_count: brevoSync.retryCount,
      }),
    },
  );
};

const listNewsletterSubscribersForReconcile = async (
  limit: number,
): Promise<NewsletterSubscriberRecord[]> => {
  const rows = await supabaseAdminRestRequest<NewsletterSubscriberRow[]>(
    `/newsletter_subscribers?select=${NEWSLETTER_SELECT}&status=in.(subscribed,unsubscribed)&order=updated_at.desc&limit=${limit}`,
  );

  return rows.map(mapRowToRecord);
};

export const createNewsletterSupabaseRepository = (): NewsletterRepository => ({
  findById: findNewsletterSubscriberById,
  isAvailable: () => isSupabaseAdminRestReady(),
  listForReconcile: listNewsletterSubscribersForReconcile,
  updateBrevoSyncById: updateNewsletterBrevoSyncById,
  upsertById: upsertNewsletterSubscriberById,
});
