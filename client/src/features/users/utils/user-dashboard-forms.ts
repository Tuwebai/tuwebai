import type { User } from '@/features/users/types';

export type UserProfileFormState = {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

export function createInitialProfileForm(user?: Pick<User, 'name' | 'username' | 'email'> | null): UserProfileFormState {
  return {
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
  };
}

export function validateUserProfileForm(profileForm: UserProfileFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!profileForm.name.trim()) {
    errors.name = 'El nombre es requerido';
  }

  if (!profileForm.username.trim()) {
    errors.username = 'El nombre de usuario es requerido';
  }

  if (!profileForm.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
    errors.email = 'Email no válido';
  }

  if (profileForm.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
    errors.phone = 'Número de teléfono no válido';
  }

  return errors;
}
