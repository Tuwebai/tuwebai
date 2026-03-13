import type { User } from '@/features/users/types';

export type UserProfileFormState = {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
};

export type UserPasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

export function createInitialPasswordForm(): UserPasswordFormState {
  return {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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
    errors.email = 'Email no valido';
  }

  if (profileForm.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
    errors.phone = 'Numero de telefono no valido';
  }

  return errors;
}

export function validateUserPasswordForm(passwordForm: UserPasswordFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!passwordForm.currentPassword) {
    errors.currentPassword = 'La contrasena actual es requerida';
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = 'La nueva contrasena es requerida';
  } else if (passwordForm.newPassword.length < 8) {
    errors.newPassword = 'La contrasena debe tener al menos 8 caracteres';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
    errors.newPassword = 'La contrasena debe contener mayusculas, minusculas y numeros';
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'Las contrasenas no coinciden';
  }

  return errors;
}
