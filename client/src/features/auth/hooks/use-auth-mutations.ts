import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/shared/ui/use-toast';
import type { User, RegisterData } from '../types';
import { mergeFirebaseUserData } from '../services/auth-avatar';
import { getAuthErrorMessage } from '../services/auth-error';

type FirebaseModule = typeof import('@/lib/firebase');
type FirebaseAuthModule = typeof import('firebase/auth');
type UsersServiceModule = typeof import('@/features/users/services/users.service');

let firebasePromise: Promise<FirebaseModule> | null = null;
let fireauthPromise: Promise<FirebaseAuthModule> | null = null;
let usersServicePromise: Promise<UsersServiceModule> | null = null;

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

export const useLoginMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { auth } = await getFirebase();
      const { signInWithEmailAndPassword } = await getFirebaseAuth();
      return await signInWithEmailAndPassword(auth, email, password);
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
      const { auth, googleProvider } = await getFirebase();
      const { signInWithPopup, reload } = await getFirebaseAuth();
      const { getUser, setUser } = await getUsersService();

      const result = await signInWithPopup(auth, googleProvider);
      try {
        await reload(result.user);
      } catch {
        // Si Google no refresca metadata en este instante, usamos el snapshot disponible.
      }
      const firebaseUser = auth.currentUser ?? result.user;
      const persistedUser = await getUser(firebaseUser.uid);
      const dbUser = mergeFirebaseUserData(firebaseUser, persistedUser);

      if (!persistedUser) {
        await setUser(dbUser);
      } else if (
        dbUser.uid !== persistedUser.uid ||
        dbUser.email !== persistedUser.email ||
        dbUser.name !== persistedUser.name ||
        dbUser.username !== persistedUser.username ||
        dbUser.image !== persistedUser.image
      ) {
        await setUser(dbUser);
      }
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
      const { auth } = await getFirebase();
      const { signOut } = await getFirebaseAuth();
      await signOut(auth);
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
      const { auth } = await getFirebase();
      const { createUserWithEmailAndPassword, updateProfile } = await getFirebaseAuth();
      const { setUser } = await getUsersService();

      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

      await updateProfile(userCredential.user, {
        displayName: userData.name || userData.username,
      });

      const newUser: User = {
        uid: userCredential.user.uid,
        email: userData.email,
        username: userData.username,
        name: userData.name || userData.username,
        image: userCredential.user.photoURL || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setUser(newUser);
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
      const { updateUser } = await getUsersService();
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

export const useChangePasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ currentPassword: _currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const { auth } = await getFirebase();
      const { updatePassword } = await getFirebaseAuth();
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      } else {
        throw new Error('No hay usuario autenticado para cambiar la contraseña.');
      }
    },
    onSuccess: () => {
      toast({ title: 'Contraseña actualizada', description: 'Tu contraseña ha sido actualizada.' });
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al cambiar contraseña'), variant: 'destructive' });
    },
  });
};

export const useResetPasswordMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const { auth } = await getFirebase();
      const { sendPasswordResetEmail } = await getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
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
      const { auth } = await getFirebase();
      const { confirmPasswordReset } = await getFirebaseAuth();
      await confirmPasswordReset(auth, code, newPassword);
    },
    onSuccess: () => {
      // Evitamos un doble toast si el componente que llama ya lanza uno, pero dejamos este por consistencia
    },
    onError: (error: unknown) => {
      toast({ title: 'Error', description: getAuthErrorMessage(error, 'Error al restablecer contraseña'), variant: 'destructive' });
    },
  });
};
