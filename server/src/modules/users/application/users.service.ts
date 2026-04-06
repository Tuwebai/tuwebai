import type {
  PaymentDocument,
  UserDocument,
  UserPreferencesDocument,
  UserPrivacyDocument,
  UsersRepository,
} from '../domain/users.repository';
import { createUsersSupabaseRepository } from '../infrastructure/users-supabase.repository';

const DEFAULT_USER_PRIVACY_SETTINGS: Required<
  Pick<UserPrivacyDocument, 'marketingConsent' | 'analyticsConsent' | 'profileEmailVisible' | 'profileStatusVisible'>
> = {
  marketingConsent: false,
  analyticsConsent: false,
  profileEmailVisible: true,
  profileStatusVisible: true,
};

const PRIVACY_FIELDS: Array<keyof typeof DEFAULT_USER_PRIVACY_SETTINGS> = [
  'marketingConsent',
  'analyticsConsent',
  'profileEmailVisible',
  'profileStatusVisible',
];

export interface UsersService {
  getUserByAuthUserId(authUserId: string): Promise<UserDocument | null>;
  resolveOwnerIds(uid: string): Promise<string[]>;
  resolveCanonicalAppUserId(uid: string): Promise<string>;
  findUserByEmail(email: string): Promise<{ id: string; data: UserDocument } | null>;
  getPaymentsByUid(uid: string): Promise<PaymentDocument[]>;
  getPrivacyByUid(uid: string): Promise<UserPrivacyDocument>;
  getPreferencesByUid(uid: string): Promise<UserPreferencesDocument | null>;
  getUserByUid(uid: string): Promise<UserDocument | null>;
  isAvailable(): boolean;
  savePasswordResetMetadata(email: string, passwordChangedAt: string): Promise<{ found: boolean; uid?: string }>;
  setPrivacyByUid(uid: string, incoming: Partial<UserPrivacyDocument>): Promise<UserPrivacyDocument>;
  setPreferencesByUid(uid: string, incoming: Partial<UserPreferencesDocument>): Promise<void>;
  upsertUserByUid(uid: string, payload: Partial<UserDocument>): Promise<void>;
}

const buildUsersService = (repository: UsersRepository): UsersService => ({
  getUserByAuthUserId: (authUserId) => repository.findByAuthUserId(authUserId),
  async resolveOwnerIds(uid) {
    const user = await repository.findByUid(uid);
    return Array.from(new Set([user?.appUserId, uid].filter((value): value is string => typeof value === 'string' && value.length > 0)));
  },
  async resolveCanonicalAppUserId(uid) {
    const user = await repository.findByUid(uid);
    return user?.appUserId ?? uid;
  },
  findUserByEmail: (email) => repository.findByEmail(email),
  getPaymentsByUid: (uid) => repository.getPaymentsByUid(uid),
  async getPrivacyByUid(uid) {
    const data = await repository.findByUid(uid);
    return {
      ...DEFAULT_USER_PRIVACY_SETTINGS,
      ...(data?.privacy ?? {}),
    };
  },
  async getPreferencesByUid(uid) {
    const data = await repository.findByUid(uid);
    return data?.preferences || null;
  },
  getUserByUid: (uid) => repository.findByUid(uid),
  isAvailable: () => repository.isAvailable(),
  async savePasswordResetMetadata(email, passwordChangedAt) {
    const userEntry = await repository.findByEmail(email);
    if (!userEntry) {
      return { found: false };
    }

    await repository.upsertByUid(userEntry.id, {
      ...userEntry.data,
      authProvider: 'password',
      passwordChangedAt,
    });

    return { found: true, uid: userEntry.id };
  },
  async setPrivacyByUid(uid, incoming) {
    const currentData = await repository.findByUid(uid);
    const currentPrivacy = currentData?.privacy ?? {};
    const nextPrivacy: UserPrivacyDocument = {
      ...DEFAULT_USER_PRIVACY_SETTINGS,
      ...currentPrivacy,
      ...incoming,
      updatedAt: new Date().toISOString(),
      updatedBy: 'self',
    };

    await repository.upsertByUid(uid, {
      ...currentData,
      privacy: nextPrivacy,
    });

    return nextPrivacy;
  },
  async setPreferencesByUid(uid, incoming) {
    const currentData = await repository.findByUid(uid);
    const currentPrefs = currentData?.preferences ?? {};

    await repository.upsertByUid(uid, {
      ...currentData,
      preferences: {
        ...currentPrefs,
        ...incoming,
        updatedAt: new Date().toISOString(),
      },
    });
  },
  upsertUserByUid: (uid, payload) => repository.upsertByUid(uid, payload),
});

let usersServiceInstance: UsersService | null = null;

export const getUsersService = (): UsersService => {
  if (!usersServiceInstance) {
    usersServiceInstance = buildUsersService(createUsersSupabaseRepository());
  }

  return usersServiceInstance;
};

export const getChangedPrivacyFields = (
  currentPrivacy: Partial<UserPrivacyDocument>,
  incoming: Partial<UserPrivacyDocument>,
) => PRIVACY_FIELDS.filter((field) => incoming[field] !== undefined && incoming[field] !== currentPrivacy[field]);
