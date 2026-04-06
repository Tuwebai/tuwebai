import { createHash } from 'node:crypto';

import { getFirestore } from '../server/src/infrastructure/firebase/firestore.ts';
import { supabaseAdminRestRequest } from '../server/src/infrastructure/database/supabase/supabase-admin-rest.ts';

type FirestoreUser = Record<string, unknown> & {
  authProvider?: string;
  bio?: string;
  createdAt?: string;
  deleted?: boolean;
  email?: string;
  image?: string;
  isActive?: boolean;
  language?: string;
  name?: string;
  passwordChangedAt?: string | null;
  photoURL?: string;
  preferences?: Record<string, unknown>;
  privacy?: Record<string, unknown>;
  projectId?: string;
  role?: string;
  uid?: string;
  updatedAt?: string;
  username?: string;
};

const createDeterministicUuid = (input: string): string => {
  const hash = createHash('sha256').update(input).digest('hex');
  const hex = hash.slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ['8', '9', 'a', 'b'][parseInt(hex[16], 16) % 4];
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20, 32).join('')}`;
};

const toIsoOrNow = (value: unknown, nowIso: string): string =>
  typeof value === 'string' && value.trim().length > 0 ? value : nowIso;

const normalizeAuthProvider = (value: unknown): string => {
  if (value === 'password' || value === 'google' || value === 'magic_link') {
    return value;
  }

  return 'unknown';
};

const normalizeRole = (value: unknown): string =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : 'user';

const normalizeString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

const normalizeBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const buildProfileRow = (uid: string, user: FirestoreUser, nowIso: string) => ({
  id: createDeterministicUuid(`profile:${uid}`),
  avatar_url: normalizeString(user.image) ?? normalizeString(user.photoURL),
  bio: normalizeString(user.bio),
  created_at: toIsoOrNow(user.createdAt, nowIso),
  display_name: normalizeString(user.name) ?? normalizeString(user.username),
  updated_at: toIsoOrNow(user.updatedAt, nowIso),
});

const buildUserRow = (uid: string, user: FirestoreUser, nowIso: string) => ({
  id: createDeterministicUuid(`user:${uid}`),
  profile_id: createDeterministicUuid(`profile:${uid}`),
  supabase_auth_user_id: null,
  firebase_uid: uid,
  email: String(user.email).trim().toLowerCase(),
  username: normalizeString(user.username),
  full_name: normalizeString(user.name),
  image_url: normalizeString(user.image) ?? normalizeString(user.photoURL),
  auth_provider: normalizeAuthProvider(user.authProvider),
  role: normalizeRole(user.role),
  is_active: normalizeBoolean(user.isActive, true) && user.deleted !== true,
  legacy_project_id: normalizeString(user.projectId),
  password_changed_at:
    typeof user.passwordChangedAt === 'string' && user.passwordChangedAt.trim().length > 0
      ? user.passwordChangedAt
      : null,
  created_at: toIsoOrNow(user.createdAt, nowIso),
  updated_at: toIsoOrNow(user.updatedAt, nowIso),
});

const buildPreferencesRow = (uid: string, user: FirestoreUser, nowIso: string) => {
  const preferences = user.preferences ?? {};
  return {
    user_id: createDeterministicUuid(`user:${uid}`),
    email_notifications: normalizeBoolean(preferences.emailNotifications, true),
    newsletter: normalizeBoolean(preferences.newsletter, false),
    dark_mode: normalizeBoolean(preferences.darkMode, false),
    language:
      normalizeString(preferences.language) ??
      normalizeString(user.language),
    created_at: toIsoOrNow(user.createdAt, nowIso),
    updated_at: toIsoOrNow(preferences.updatedAt, toIsoOrNow(user.updatedAt, nowIso)),
  };
};

const buildPrivacyRow = (uid: string, user: FirestoreUser, nowIso: string) => {
  const privacy = user.privacy ?? {};
  const updatedBy = normalizeString(privacy.updatedBy);
  return {
    user_id: createDeterministicUuid(`user:${uid}`),
    marketing_consent: normalizeBoolean(privacy.marketingConsent, false),
    analytics_consent: normalizeBoolean(privacy.analyticsConsent, false),
    profile_email_visible: normalizeBoolean(privacy.profileEmailVisible, true),
    profile_status_visible: normalizeBoolean(privacy.profileStatusVisible, true),
    updated_by:
      updatedBy === 'self' || updatedBy === 'admin' || updatedBy === 'system'
        ? updatedBy
        : 'system',
    created_at: toIsoOrNow(user.createdAt, nowIso),
    updated_at: toIsoOrNow(privacy.updatedAt, toIsoOrNow(user.updatedAt, nowIso)),
  };
};

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

const snapshot = await db.collection('users').get();
const nowIso = new Date().toISOString();

const profiles: Record<string, unknown>[] = [];
const users: Record<string, unknown>[] = [];
const preferences: Record<string, unknown>[] = [];
const privacySettings: Record<string, unknown>[] = [];
const skipped: string[] = [];

for (const doc of snapshot.docs) {
  const raw = doc.data() as FirestoreUser;
  const uid = typeof raw.uid === 'string' && raw.uid.trim().length > 0 ? raw.uid.trim() : doc.id;
  const email = normalizeString(raw.email);

  if (!uid || !email) {
    skipped.push(doc.id);
    continue;
  }

  profiles.push(buildProfileRow(uid, raw, nowIso));
  users.push(buildUserRow(uid, raw, nowIso));
  preferences.push(buildPreferencesRow(uid, raw, nowIso));
  privacySettings.push(buildPrivacyRow(uid, raw, nowIso));
}

await upsertRows('/profiles?on_conflict=id', profiles);
await upsertRows('/users?on_conflict=firebase_uid', users);
await upsertRows('/user_preferences?on_conflict=user_id', preferences);
await upsertRows('/user_privacy_settings?on_conflict=user_id', privacySettings);

console.log(
  JSON.stringify({
    firestoreUsers: snapshot.size,
    migratedPreferences: preferences.length,
    migratedPrivacySettings: privacySettings.length,
    migratedProfiles: profiles.length,
    migratedUsers: users.length,
    skipped,
  }),
);
