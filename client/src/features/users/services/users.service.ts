import { backendApi } from '@/lib/backend-api';
import { SupabaseEdgeInvokeError, invokeSupabaseEdge } from '@/lib/supabase-edge';
import type { User } from '../types';

const shouldSkipBackendFallback = (error: unknown): boolean =>
  error instanceof SupabaseEdgeInvokeError && (error.status === 401 || error.status === 403);

export async function getUser(uid: string): Promise<User | null> {
  try {
    const res = await invokeSupabaseEdge<{ data?: User | null }>('user-profile');
    return res?.data || null;
  } catch (error) {
    if (shouldSkipBackendFallback(error)) {
      return null;
    }

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
  } catch (error) {
    if (shouldSkipBackendFallback(error)) {
      return;
    }

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
  } catch (error) {
    if (shouldSkipBackendFallback(error)) {
      return;
    }

    await backendApi.upsertUser(uid, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }
}
