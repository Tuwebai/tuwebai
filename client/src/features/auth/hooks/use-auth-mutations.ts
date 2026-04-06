import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/ui/use-toast';
import {
  confirmAuthPasswordReset,
  registerAuthUser,
  sendAuthPasswordResetEmail,
  sendAuthVerificationEmail,
  signInWithEmailPassword,
  signInWithGooglePopup,
  signOutAuthSession,
  updateAuthUserProfile,
} from '@/core/auth/auth-client';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import type { User, RegisterData } from '../types';
import { getAuthErrorMessage } from '../services/auth-error';
import { getAuthUsersService, syncAuthSessionUser } from '../services/auth-user-sync';

const getAuthActionBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return TUWEBAI_SITE_FULL_URL;
};

export const useLoginMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await signInWithEmailPassword(email, password);
    },
    onSuccess: () => {
      toast({ title: 'Sesión iniciada', description: 'Has iniciado sesión correctamente.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al iniciar sesión'), variant: 'destructive' });
    },
  });
};

export const useGoogleLoginMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const result = await signInWithGooglePopup();
      const dbUser = await syncAuthSessionUser(result.user, { reloadBeforeSync: true });
      if (!dbUser) {
        throw new Error('No pudimos sincronizar la sesion de Google.');
      }

      const firebaseUser = result.user;
      return { firebaseUser, dbUser };
    },
    onSuccess: (data) => {
      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido${data.firebaseUser.displayName ? `, ${data.firebaseUser.displayName}` : ''}!`,
      });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al iniciar sesión con Google'), variant: 'destructive' });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await signOutAuthSession();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al cerrar sesión'), variant: 'destructive' });
    },
  });
};

export const useRegisterMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { setUser } = await getAuthUsersService();

      const userCredential = await registerAuthUser(userData.email, userData.password);

      await updateAuthUserProfile(userCredential.user, {
        displayName: userData.name || userData.username,
      });

      const newUser: User = {
        uid: userCredential.user.uid,
        email: userData.email,
        username: userData.username,
        name: userData.name || userData.username,
        image: userCredential.user.photoURL || '',
        authProvider: 'password',
        passwordChangedAt: new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setUser(newUser);
      await sendAuthVerificationEmail(userCredential.user, {
        url: `${getAuthActionBaseUrl()}/auth/action`,
        handleCodeInApp: false,
      });
      return newUser;
    },
    onSuccess: () => {
      toast({ title: 'Registro exitoso', description: 'Por favor, verifica tu email para activar tu cuenta.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al registrar usuario'), variant: 'destructive' });
    },
  });
};

export const useUpdateProfileMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: Partial<User> }) => {
      const { updateUser } = await getAuthUsersService();
      await updateUser(uid, data);
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Perfil actualizado', description: 'Tu información de perfil ha sido actualizada.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al actualizar perfil'), variant: 'destructive' });
    },
  });
};

export const useResetPasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      await sendAuthPasswordResetEmail(email, {
        url: `${getAuthActionBaseUrl()}/auth/action`,
        handleCodeInApp: false,
      });
    },
    onSuccess: () => {
      toast({ title: 'Correo enviado', description: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al solicitar restablecimiento'), variant: 'destructive' });
    },
  });
};

export const useConfirmPasswordResetMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ code, newPassword }: { code: string; newPassword: string }) => {
      await confirmAuthPasswordReset(code, newPassword);
    },
    onSuccess: () => {
      // Evitamos un doble toast si el componente que llama ya lanza uno, pero dejamos este por consistencia
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al restablecer contraseña'), variant: 'destructive' });
    },
  });
};
