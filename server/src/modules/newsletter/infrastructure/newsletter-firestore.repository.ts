import { getFirestore as getAdminFirestore } from '../../../infrastructure/firebase/firestore';
import type { NewsletterRepository, NewsletterSubscriberRecord } from '../domain/newsletter.repository';

const NEWSLETTER_COLLECTION = 'newsletter_subscribers';

const getNewsletterSubscriberById = async (
  subscriberId: string,
): Promise<NewsletterSubscriberRecord | null> => {
  const db = getAdminFirestore();
  if (!db) return null;

  const snapshot = await db.collection(NEWSLETTER_COLLECTION).doc(subscriberId).get();
  return snapshot.exists ? (snapshot.data() as NewsletterSubscriberRecord) : null;
};

const upsertNewsletterSubscriberById = async (
  subscriberId: string,
  subscriber: NewsletterSubscriberRecord,
): Promise<void> => {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('newsletter_repository_unavailable');
  }

  await db.collection(NEWSLETTER_COLLECTION).doc(subscriberId).set(subscriber, { merge: true });
};

const updateNewsletterBrevoSyncById = async (
  subscriberId: string,
  brevoSync: NonNullable<NewsletterSubscriberRecord['brevoSync']>,
): Promise<void> => {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('newsletter_repository_unavailable');
  }

  await db.collection(NEWSLETTER_COLLECTION).doc(subscriberId).set({ brevoSync }, { merge: true });
};

const listNewsletterSubscribersForReconcile = async (
  limit: number,
): Promise<NewsletterSubscriberRecord[]> => {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('newsletter_repository_unavailable');
  }

  const snapshot = await db
    .collection(NEWSLETTER_COLLECTION)
    .where('status', 'in', ['subscribed', 'unsubscribed'])
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as NewsletterSubscriberRecord);
};

export const createNewsletterFirestoreRepository = (): NewsletterRepository => ({
  findById: getNewsletterSubscriberById,
  isAvailable: () => !!getAdminFirestore(),
  listForReconcile: listNewsletterSubscribersForReconcile,
  updateBrevoSyncById: updateNewsletterBrevoSyncById,
  upsertById: upsertNewsletterSubscriberById,
});
