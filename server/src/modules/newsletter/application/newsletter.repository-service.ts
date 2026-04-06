import type {
  NewsletterRepository,
  NewsletterSubscriberRecord,
} from '../domain/newsletter.repository';
import { createNewsletterFirestoreRepository } from '../infrastructure/newsletter-firestore.repository';

export interface NewsletterRepositoryService {
  getSubscriberById(subscriberId: string): Promise<NewsletterSubscriberRecord | null>;
  isAvailable(): boolean;
  listSubscribersForReconcile(limit: number): Promise<NewsletterSubscriberRecord[]>;
  upsertSubscriberById(subscriberId: string, subscriber: NewsletterSubscriberRecord): Promise<void>;
}

const buildNewsletterRepositoryService = (
  repository: NewsletterRepository,
): NewsletterRepositoryService => ({
  getSubscriberById: (subscriberId) => repository.findById(subscriberId),
  isAvailable: () => repository.isAvailable(),
  listSubscribersForReconcile: (limit) => repository.listForReconcile(limit),
  upsertSubscriberById: (subscriberId, subscriber) => repository.upsertById(subscriberId, subscriber),
});

let newsletterRepositoryServiceInstance: NewsletterRepositoryService | null = null;

export const getNewsletterRepositoryService = (): NewsletterRepositoryService => {
  if (!newsletterRepositoryServiceInstance) {
    newsletterRepositoryServiceInstance = buildNewsletterRepositoryService(createNewsletterFirestoreRepository());
  }

  return newsletterRepositoryServiceInstance;
};
