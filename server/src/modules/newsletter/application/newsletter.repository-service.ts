import type {
  NewsletterRepository,
  NewsletterSubscriberRecord,
} from '../domain/newsletter.repository';
import { createNewsletterFirestoreRepository } from '../infrastructure/newsletter-firestore.repository';
import { createNewsletterSupabaseRepository } from '../infrastructure/newsletter-supabase.repository';
import { appLogger } from '../../../utils/app-logger';

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

const resolveNewsletterRepositories = (): {
  fallback: NewsletterRepository | null;
  primary: NewsletterRepository;
} => {
  const supabaseRepository = createNewsletterSupabaseRepository();
  if (supabaseRepository.isAvailable()) {
    return {
      fallback: createNewsletterFirestoreRepository(),
      primary: supabaseRepository,
    };
  }

  return {
    fallback: null,
    primary: createNewsletterFirestoreRepository(),
  };
};

const withFallback = async <T>(
  operation: string,
  primaryRun: () => Promise<T>,
  fallbackRun: (() => Promise<T>) | null,
): Promise<T> => {
  try {
    return await primaryRun();
  } catch (error) {
    if (!fallbackRun) {
      throw error;
    }

    appLogger.warn(`newsletter.repository.${operation}.fallback`, {
      error: error instanceof Error ? error.message : 'unknown_repository_error',
    });

    return fallbackRun();
  }
};

const buildNewsletterRepositoryService = (): NewsletterRepositoryService => {
  const { primary, fallback } = resolveNewsletterRepositories();

  return {
    getSubscriberById: (subscriberId) =>
      withFallback(
        'find_by_id',
        () => primary.findById(subscriberId),
        fallback?.isAvailable() ? () => fallback.findById(subscriberId) : null,
      ),
    isAvailable: () => primary.isAvailable() || !!fallback?.isAvailable(),
    listSubscribersForReconcile: (limit) =>
      withFallback(
        'list_for_reconcile',
        () => primary.listForReconcile(limit),
        fallback?.isAvailable() ? () => fallback.listForReconcile(limit) : null,
      ),
    updateBrevoSyncById: (subscriberId, brevoSync) =>
      withFallback(
        'update_brevo_sync',
        () => primary.updateBrevoSyncById(subscriberId, brevoSync),
        fallback?.isAvailable() ? () => fallback.updateBrevoSyncById(subscriberId, brevoSync) : null,
      ),
    upsertSubscriberById: (subscriberId, subscriber) =>
      withFallback(
        'upsert_by_id',
        () => primary.upsertById(subscriberId, subscriber),
        fallback?.isAvailable() ? () => fallback.upsertById(subscriberId, subscriber) : null,
      ),
  };
};

let newsletterRepositoryServiceInstance: NewsletterRepositoryService | null = null;

export const getNewsletterRepositoryService = (): NewsletterRepositoryService => {
  if (!newsletterRepositoryServiceInstance) {
    newsletterRepositoryServiceInstance = buildNewsletterRepositoryService();
  }

  return newsletterRepositoryServiceInstance;
};
