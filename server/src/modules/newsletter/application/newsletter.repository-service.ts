import type {
  NewsletterRepository,
  NewsletterSubscriberRecord,
} from '../domain/newsletter.repository';
import { createNewsletterSupabaseRepository } from '../infrastructure/newsletter-supabase.repository';

export interface NewsletterRepositoryService {
  getSubscriberById(subscriberId: string): Promise<NewsletterSubscriberRecord | null>;
  isAvailable(): boolean;
  listSubscribersForReconcile(limit: number): Promise<NewsletterSubscriberRecord[]>;
  updateBrevoSyncById(
    subscriberId: string,
    brevoSync: NonNullable<NewsletterSubscriberRecord['brevoSync']>,
  ): Promise<void>;
  upsertSubscriberById(subscriberId: string, subscriber: NewsletterSubscriberRecord): Promise<void>;
}

const buildNewsletterRepositoryService = (): NewsletterRepositoryService => {
  const repository: NewsletterRepository = createNewsletterSupabaseRepository();

  return {
    getSubscriberById: (subscriberId) => repository.findById(subscriberId),
    isAvailable: () => repository.isAvailable(),
    listSubscribersForReconcile: (limit) => repository.listForReconcile(limit),
    updateBrevoSyncById: (subscriberId, brevoSync) => repository.updateBrevoSyncById(subscriberId, brevoSync),
    upsertSubscriberById: (subscriberId, subscriber) => repository.upsertById(subscriberId, subscriber),
  };
};

let newsletterRepositoryServiceInstance: NewsletterRepositoryService | null = null;

export const getNewsletterRepositoryService = (): NewsletterRepositoryService => {
  if (!newsletterRepositoryServiceInstance) {
    newsletterRepositoryServiceInstance = buildNewsletterRepositoryService();
  }

  return newsletterRepositoryServiceInstance;
};
