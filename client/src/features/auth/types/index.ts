import type { User as FirestoreUser, UserPreferences } from '@/services/firestore';

export interface User extends FirestoreUser {}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface PasswordInfo {
  changedAt: string | null;
  daysSinceChange: number | null;
}

export type { UserPreferences };
