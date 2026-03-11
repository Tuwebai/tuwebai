import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/shared/ui/use-toast';
import {
  useChangePasswordMutation,
  useGoogleLoginMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useUpdatePreferencesMutation,
  useUpdateProfileMutation,
} from '../hooks/use-auth-mutations';
import { useUserPreferencesQuery } from '../hooks/use-auth-queries';
import type { PasswordInfo, RegisterData, User, UserPreferences } from '../types';

let firebasePromise: Promise<any> | null = null;
let fireauthPromise: Promise<any> | null = null;
let usersServicePromise: Promise<any> | null = null;

const getFirebase = () => {
  if (!firebasePromise) firebasePromise = import('@/lib/firebase');
  return firebasePromise;
};

const getFirebaseAuth = () => {
  if (!fireauthPromise) fireauthPromise = import('firebase/auth');
  return fireauthPromise;
};

const getUsersService = () => {
  if (!usersServicePromise) usersServicePromise = import('@/features/users/services/users.service');
  return usersServicePromise;
};

interface AuthState {
  user: User | null;
  userPreferences: UserPreferences;
  passwordInfo: PasswordInfo;
  isLoading: boolean;
  isMutatingAuth: boolean;
  isLoadingPreferences: boolean;
  isLoadingPasswordInfo: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  fetchUserPreferences: () => Promise<void>;
  fetchPasswordInfo: () => Promise<void>;
  uploadProfileImage: (imageFile: File) => Promise<void>;
  clearError: () => void;
  setUserImage: (imageUrl: string) => void;
}

const DEFAULT_PREFS: UserPreferences = {
  emailNotifications: false,
  newsletter: false,
  darkMode: false,
  language: 'es',
};

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};

export const useAuth = () => {
  const state = useAuthState();
  const actions = useAuthActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    changedAt: null,
    daysSinceChange: null,
  });
  const [isLoadingPasswordInfo, setIsLoadingPasswordInfo] = useState(false);

  const { data: userPreferencesData, isLoading: isLoadingPreferencesQuery, refetch: refetchPrefs } = useUserPreferencesQuery(user?.uid);

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const updatePreferencesMutation = useUpdatePreferencesMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const isAnyMutationPending =
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    logoutMutation.isPending ||
    registerMutation.isPending ||
    updateProfileMutation.isPending ||
    changePasswordMutation.isPending ||
    resetPasswordMutation.isPending;

  const isLoading = isLoadingAuth;
  const isMutatingAuth = isAnyMutationPending;

  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { auth } = await getFirebase();
        const { onAuthStateChanged } = await getFirebaseAuth();
        const { getUser, setUser } = await getUsersService();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (!isMounted) return;
          setIsLoadingAuth(true);

          if (firebaseUser) {
            let dbUser = await getUser(firebaseUser.uid);
            if (!dbUser) {
              dbUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                username: firebaseUser.displayName || '',
                name: firebaseUser.displayName || '',
                image: firebaseUser.photoURL || '',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              await setUser(dbUser);
            }
            if (isMounted) setUserState(dbUser);
          } else if (isMounted) {
            setUserState(null);
          }

          if (isMounted) setIsLoadingAuth(false);
        });

        if (isMounted) unsubscribeFn = unsubscribe;
        else unsubscribe();
      } catch (err) {
        console.error('Error inicializando Auth:', err);
        if (isMounted) setIsLoadingAuth(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    }
  }, [loginMutation]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { dbUser } = await googleLoginMutation.mutateAsync();
      setUserState(dbUser);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      throw err;
    }
  }, [googleLoginMutation]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
      setUserState(null);
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    }
  }, [logoutMutation]);

  const register = useCallback(async (userData: RegisterData) => {
    setError(null);
    try {
      const newUser = await registerMutation.mutateAsync(userData);
      setUserState(newUser);
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    }
  }, [registerMutation]);

  const requestPasswordReset = useCallback(async (email: string) => {
    setError(null);
    try {
      await resetPasswordMutation.mutateAsync(email);
    } catch (err: any) {
      setError(err.message || 'Error al solicitar restablecimiento de contraseña');
      throw err;
    }
  }, [resetPasswordMutation]);

  const resetPassword = useCallback(async (_token: string, _newPassword: string) => {
    toast({ title: 'Función no soportada', description: 'Usa el enlace enviado por email para restablecer tu contraseña.' });
  }, [toast]);

  const updateUserProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    setError(null);
    try {
      await updateProfileMutation.mutateAsync({ uid: user.uid, data });
      setUserState((prevUser) => (prevUser ? { ...prevUser, ...data } : null));
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      throw err;
    }
  }, [user, updateProfileMutation]);

  const fetchUserPreferences = useCallback(async () => {
    if (!user) return;
    await refetchPrefs();
  }, [user, refetchPrefs]);

  const updateUserPreferences = useCallback(async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    setError(null);
    try {
      await updatePreferencesMutation.mutateAsync({ uid: user.uid, preferences });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar preferencias');
      throw err;
    }
  }, [user, updatePreferencesMutation]);

  const fetchPasswordInfo = useCallback(async () => {
    setIsLoadingPasswordInfo(true);
    setPasswordInfo({ changedAt: null, daysSinceChange: null });
    setIsLoadingPasswordInfo(false);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    setError(null);
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      throw err;
    }
  }, [user, changePasswordMutation]);

  const uploadProfileImage = useCallback(async (imageFile: File) => {
    if (!user) return;
    setError(null);
    try {
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      await updateProfileMutation.mutateAsync({ uid: user.uid, data: { image: imageData } });
      setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageData } : null));
      if (typeof window !== 'undefined') {
        localStorage.setItem('userImage', imageData);
      }
      toast({ title: 'Imagen actualizada', description: 'Tu foto de perfil ha sido actualizada.' });
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      toast({ title: 'Error', description: err.message || 'Error al subir imagen', variant: 'destructive' });
      throw err;
    }
  }, [user, updateProfileMutation, toast]);

  const setUserImage = useCallback((imageUrl: string) => {
    if (user) {
      setUserState((prevUser) => (prevUser ? { ...prevUser, image: imageUrl } : null));
      if (typeof window !== 'undefined') {
        localStorage.setItem('userImage', imageUrl);
      }
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  const stateValue = useMemo<AuthState>(() => ({
    user,
    userPreferences: userPreferencesData || DEFAULT_PREFS,
    passwordInfo,
    isLoading,
    isMutatingAuth,
    isLoadingPreferences: isLoadingPreferencesQuery || updatePreferencesMutation.isPending,
    isLoadingPasswordInfo,
    isAuthenticated: !!user,
    error,
  }), [
    user,
    userPreferencesData,
    passwordInfo,
    isLoading,
    isMutatingAuth,
    isLoadingPreferencesQuery,
    updatePreferencesMutation.isPending,
    isLoadingPasswordInfo,
    error,
  ]);

  const actionsValue = useMemo<AuthActions>(() => ({
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    updateUserProfile,
    updateUserPreferences,
    changePassword,
    fetchUserPreferences,
    fetchPasswordInfo,
    uploadProfileImage,
    clearError,
    setUserImage,
  }), [
    login,
    loginWithGoogle,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    updateUserProfile,
    updateUserPreferences,
    changePassword,
    fetchUserPreferences,
    fetchPasswordInfo,
    uploadProfileImage,
    clearError,
    setUserImage,
  ]);

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};
