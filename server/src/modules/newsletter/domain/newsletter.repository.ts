export interface NewsletterSubscriptionContext {
  email: string;
  source: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface NewsletterSubscriberRecord {
  email: string;
  emailNormalized: string;
  status: 'pending_confirmation' | 'subscribed' | 'unsubscribed' | 'bounced' | 'complained';
  createdAt: string;
  confirmedAt?: string;
  unsubscribedAt?: string;
  bouncedAt?: string;
  complainedAt?: string;
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
  brevoSync?: {
    status: 'pending' | 'synced' | 'failed';
    lastOperation: 'subscribe' | 'unsubscribe';
    lastAttemptAt: string;
    lastSyncedAt?: string;
    lastError?: string;
    retryCount: number;
  };
}

export interface NewsletterRepository {
  findById(subscriberId: string): Promise<NewsletterSubscriberRecord | null>;
  isAvailable(): boolean;
  listForReconcile(limit: number): Promise<NewsletterSubscriberRecord[]>;
  updateBrevoSyncById(
    subscriberId: string,
    brevoSync: NonNullable<NewsletterSubscriberRecord['brevoSync']>,
  ): Promise<void>;
  upsertById(subscriberId: string, subscriber: NewsletterSubscriberRecord): Promise<void>;
}
