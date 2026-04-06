import { useCallback, type Dispatch, type SetStateAction } from 'react';

import { useToast } from '@/shared/ui/use-toast';
import { backendApi } from '@/lib/backend-api';

import {
  useConfirmPasswordResetMutation,
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
} from './use-auth-mutations';
import { getAuthErrorMessage } from '../services/auth-error';
import type { RegisterData, User } from '../types';

interface UseAuthProviderActionsOptions {
  setError: Dispatch<SetStateAction<string | null>>;
  setUserState: Dispatch<SetStateAction<User | null>>;
  user: User | null;
}

const readFileAsDataUrl = (file: File): Promise<string> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
);

export const useAuthProviderActions = ({
  setError,
  setUserState,
  user,
}: UseAuthProviderActionsOptions) => {
  const { toast } = useToast();
  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const confirmPasswordResetMutation = useConfirmPasswordResetMutation();

  const isMutatingAuth =
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    logoutMutation.isPending ||
    registerMutation.isPending ||
    updateProfileMutation.isPending ||
    resetPasswordMutation.isPending ||
    confirmPasswordResetMutation.isPending;

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al iniciar sesión'));
      throw error;
    }
  }, [loginMutation, setError]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      await googleLoginMutation.mutateAsync();
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al iniciar sesión con Google'));
      throw error;
    }
  }, [googleLoginMutation, setError]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
      setUserState(null);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al cerrar sesión'));
      throw error;
    }
  }, [logoutMutation, setError, setUserState]);

  const register = useCallback(async (userData: RegisterData) => {
    setError(null);
    try {
      const newUser = await registerMutation.mutateAsync(userData);
      setUserState(newUser);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al registrar usuario'));
      throw error;
    }
  }, [registerMutation, setError, setUserState]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    try {
      await resetPasswordMutation.mutateAsync(email);
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al solicitar restablecimiento de contraseña'));
      throw error;
    }
  }, [resetPasswordMutation, setError]);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setError(null);
    try {
      await confirmPasswordResetMutation.mutateAsync({ code: token, newPassword });
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al restablecer contraseña'));
      throw error;
    }
  }, [confirmPasswordResetMutation, setError]);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user) {
      return;
    }

    setError(null);
    try {
      await updateProfileMutation.mutateAsync({ uid: user.uid, data });
      setUserState((prevUser) => (prevUser ? { ...prevUser, ...data } : null));
    } catch (error: unknown) {
      setError(getAuthErrorMessage(error, 'Error al actualizar perfil'));
      throw error;
    }
  }, [setError, setUserState, updateProfileMutation, user]);

  const uploadProfileImage = useCallback(async (imageFile: File) => {
    if (!user) {
      return;
    }

    setError(null);
    try {
      const imageData = await readFileAsDataUrl(imageFile);
      const response = await backendApi.uploadUserAvatar(user.uid, imageData);
      const imageUrl = response.data?.image ?? imageData;
      setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageUrl } : null));
      toast({ title: 'Imagen actualizada', description: 'Tu foto de perfil ha sido actualizada.' });
    } catch (error: unknown) {
      const message = getAuthErrorMessage(error, 'Error al subir imagen');
      setError(message);
      toast({ title: 'Error', description: message, variant: 'destructive' });
      throw error;
    }
  }, [setError, setUserState, toast, user]);

  const setUserImage = useCallback((imageUrl: string) => {
    if (!user) {
      return;
    }

    setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageUrl } : null));
  }, [setUserState, user]);

  const clearError = useCallback(() => setError(null), [setError]);

  return {
    clearError,
    isMutatingAuth,
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    setUserImage,
    updateUserProfile,
    uploadProfileImage,
  };
};
