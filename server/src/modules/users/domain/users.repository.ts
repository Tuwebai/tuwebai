export interface UserPreferencesDocument {
  emailNotifications?: boolean;
  newsletter?: boolean;
  darkMode?: boolean;
  language?: string;
  updatedAt?: string;
}

export interface UserPrivacyDocument {
  marketingConsent?: boolean;
  analyticsConsent?: boolean;
  profileEmailVisible?: boolean;
  profileStatusVisible?: boolean;
  updatedAt?: string;
  updatedBy?: 'self' | 'admin' | 'system';
}

export interface UserDocument {
  appUserId?: string;
  uid?: string;
  authUserId?: string;
  email?: string;
  username?: string;
  name?: string;
  image?: string;
  authProvider?: 'password' | 'google';
  passwordChangedAt?: string | null;
  role?: string;
  isActive?: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
  preferences?: UserPreferencesDocument;
  privacy?: UserPrivacyDocument;
}

export type PaymentDocument = {
  id: string;
  date?: string;
} & Record<string, unknown>;

export interface UsersRepository {
  findByAuthUserId(authUserId: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<{ id: string; data: UserDocument } | null>;
  findByUid(uid: string): Promise<UserDocument | null>;
  getPaymentsByUid(uid: string): Promise<PaymentDocument[]>;
  isAvailable(): boolean;
  upsertByUid(uid: string, payload: Partial<UserDocument>): Promise<void>;
}
