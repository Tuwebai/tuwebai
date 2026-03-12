import { backendApi } from '@/lib/backend-api';
import type { User } from '../types';

export async function getUser(uid: string): Promise<User | null> {
  try {
    const res = await backendApi.getUser(uid);
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function setUser(user: User): Promise<void> {
  await backendApi.upsertUser(user.uid, {
    ...user,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  await backendApi.upsertUser(uid, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}
