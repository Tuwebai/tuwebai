import { getFirestore as getAdminFirestore } from '../../../infrastructure/firebase/firestore';
import type {
  PaymentDocument,
  UserDocument,
  UsersRepository,
} from '../domain/users.repository';

const USERS_COLLECTION = 'users';
const PAYMENTS_COLLECTION = 'payments';

const findUserByEmail = async (
  email: string,
): Promise<{ id: string; data: UserDocument } | null> => {
  const db = getAdminFirestore();
  if (!db) return null;

  const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    data: (snapshot.docs[0].data() as UserDocument | undefined) ?? {},
  };
};

const getUserByUid = async (uid: string): Promise<UserDocument | null> => {
  const db = getAdminFirestore();
  if (!db) return null;

  const snapshot = await db.collection(USERS_COLLECTION).doc(uid).get();
  return snapshot.exists ? ((snapshot.data() as UserDocument | undefined) ?? null) : null;
};

const upsertUserByUid = async (uid: string, payload: Partial<UserDocument>): Promise<void> => {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('users_repository_unavailable');
  }

  const nowIso = new Date().toISOString();
  await db.collection(USERS_COLLECTION).doc(uid).set(
    {
      ...payload,
      uid,
      updatedAt: nowIso,
      createdAt: payload.createdAt || nowIso,
    },
    { merge: true }
  );
};

const getUserPaymentsByUid = async (uid: string): Promise<PaymentDocument[]> => {
  const db = getAdminFirestore();
  if (!db) {
    throw new Error('users_repository_unavailable');
  }

  const snapshot = await db.collection(PAYMENTS_COLLECTION).where('userId', '==', uid).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, unknown>),
  }));
};

export const createUsersFirestoreRepository = (): UsersRepository => ({
  findByEmail: findUserByEmail,
  findByUid: getUserByUid,
  getPaymentsByUid: getUserPaymentsByUid,
  isAvailable: () => !!getAdminFirestore(),
  upsertByUid: upsertUserByUid,
});
