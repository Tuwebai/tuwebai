import type { User as AppUser } from '@/features/users/types';

export interface User extends AppUser {}

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
