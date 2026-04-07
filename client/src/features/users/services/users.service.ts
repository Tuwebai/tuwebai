import { backendApi } from '@/lib/backend-api';
import { invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { User } from '../types';

export async function getUser(uid: string): Promise<User | null> {
  try {
    const res = await invokeSupabaseEdge<{ data?: User | null }>('user-profile');
    return res?.data || null;
  } catch {
    try {
      const res = await backendApi.getUser(uid);
      return res?.data || null;
    } catch {
      return null;
    }
  }
}

export async function setUser(user: User): Promise<void> {
  try {
    await invokeSupabaseEdge<{ success?: boolean }>('user-profile', {
      body: {
        ...user,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    await backendApi.upsertUser(user.uid, {
      ...user,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function updateUser(uid: string, data: Partial<User>): Promise<void> {
  try {
    await invokeSupabaseEdge<{ success?: boolean }>('user-profile', {
      body: {
        ...data,
        uid,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    await backendApi.upsertUser(uid, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }
}
