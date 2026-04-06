import crypto from 'node:crypto';

import { supabaseAdminClient } from '../server/src/infrastructure/database/supabase/supabase-admin-client.ts';
import { supabaseAdminRestRequest } from '../server/src/infrastructure/database/supabase/supabase-admin-rest.ts';

interface PublicUserRow {
  auth_provider: string;
  email: string;
  firebase_uid: string;
  role: string;
  supabase_auth_user_id: string | null;
}

interface AuthAdminUser {
  email?: string;
  id: string;
}

const PUBLIC_USER_SELECT = 'firebase_uid,email,auth_provider,role,supabase_auth_user_id';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const createTemporaryPassword = (): string => `Tmp!${crypto.randomBytes(12).toString('base64url')}`;

const listAllAuthUsers = async (): Promise<AuthAdminUser[]> => {
  const collected: AuthAdminUser[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabaseAdminClient.auth.admin.listUsers({
      page,
      perPage: 100,
    });

    if (error) {
      throw error;
    }

    collected.push(...data.users.map((user) => ({ id: user.id, email: user.email })));

    if (!data.nextPage) {
      return collected;
    }

    page = data.nextPage;
  }
};

const updatePublicUserLink = async (firebaseUid: string, supabaseAuthUserId: string): Promise<void> => {
  await supabaseAdminRestRequest<void>(
    `/users?firebase_uid=eq.${encodeURIComponent(firebaseUid)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        supabase_auth_user_id: supabaseAuthUserId,
      }),
    },
  );
};

const createPasswordAuthUser = async (user: PublicUserRow): Promise<AuthAdminUser> => {
  const { data, error } = await supabaseAdminClient.auth.admin.createUser({
    email: user.email,
    email_confirm: true,
    password: createTemporaryPassword(),
    user_metadata: {
      firebase_uid: user.firebase_uid,
      role: user.role,
    },
  });

  if (error || !data.user) {
    throw error ?? new Error('supabase_auth_user_create_failed');
  }

  return {
    email: data.user.email,
    id: data.user.id,
  };
};

const publicUsers = await supabaseAdminRestRequest<PublicUserRow[]>(
  `/users?select=${PUBLIC_USER_SELECT}&order=email.asc`,
);
const authUsers = await listAllAuthUsers();
const authUsersByEmail = new Map(
  authUsers
    .filter((user) => typeof user.email === 'string' && user.email.trim().length > 0)
    .map((user) => [normalizeEmail(user.email!), user]),
);

let createdPasswordUsers = 0;
let linkedUsers = 0;
let alreadyLinkedUsers = 0;
let skippedGoogleUsers = 0;
let skippedUnknownUsers = 0;

for (const user of publicUsers) {
  if (user.supabase_auth_user_id) {
    alreadyLinkedUsers += 1;
    continue;
  }

  const normalizedEmail = normalizeEmail(user.email);
  let authUser = authUsersByEmail.get(normalizedEmail) ?? null;

  if (!authUser && user.auth_provider === 'password') {
    authUser = await createPasswordAuthUser(user);
    authUsersByEmail.set(normalizedEmail, authUser);
    createdPasswordUsers += 1;
  }

  if (!authUser) {
    if (user.auth_provider === 'google') {
      skippedGoogleUsers += 1;
    } else {
      skippedUnknownUsers += 1;
    }
    continue;
  }

  await updatePublicUserLink(user.firebase_uid, authUser.id);
  linkedUsers += 1;
}

console.log(
  JSON.stringify({
    alreadyLinkedUsers,
    createdPasswordUsers,
    linkedUsers,
    publicUsers: publicUsers.length,
    skippedGoogleUsers,
    skippedUnknownUsers,
    totalAuthUsersAfterSync: authUsersByEmail.size,
  }),
);
