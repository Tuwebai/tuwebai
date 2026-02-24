import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, RegisterData } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { UserPreferences } from '@/services/firestore';

// Helper properties para cargar dinámicamente librerías pesadas
let firebasePromise: Promise<any> | null = null;
let fireauthPromise: Promise<any> | null = null;
let firestorePromise: Promise<any> | null = null;

const getFirebase = () => {
  if (!firebasePromise) firebasePromise = import('@/lib/firebase');
  return firebasePromise;
};
const getFirebaseAuth = () => {
  if (!fireauthPromise) fireauthPromise = import('firebase/auth');
  return fireauthPromise;
};
const getFirestoreService = () => {
  if (!firestorePromise) firestorePromise = import('@/services/firestore');
  return firestorePromise;
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
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al iniciar sesión', variant: 'destructive' });
    }
  });
};

export const useGoogleLoginMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { auth, googleProvider } = await getFirebase();
      const { signInWithPopup } = await getFirebaseAuth();
      const { getUser, setUser } = await getFirestoreService();

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
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
      return { firebaseUser, dbUser };
    },
    onSuccess: (data) => {
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido${data.firebaseUser.displayName ? `, ${data.firebaseUser.displayName}` : ''}!`,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al iniciar sesión con Google', variant: 'destructive' });
    }
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
      queryClient.clear(); // Limpia la cache entera incluyendo preferencias e info de auth al salir
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al cerrar sesión', variant: 'destructive' });
    }
  });
};

export const useRegisterMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { auth } = await getFirebase();
      const { createUserWithEmailAndPassword, updateProfile } = await getFirebaseAuth();
      const { setUser } = await getFirestoreService();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

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
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al registrar usuario', variant: 'destructive' });
    }
  });
};

export const useUpdateProfileMutation = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: Partial<User> }) => {
      const { updateUser } = await getFirestoreService();
      await updateUser(uid, data);
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Perfil actualizado', description: 'Tu información de perfil ha sido actualizada.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al actualizar perfil', variant: 'destructive' });
    }
  });
};

export const useUpdatePreferencesMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uid, preferences }: { uid: string; preferences: Partial<UserPreferences> }) => {
      const { setUserPreferences } = await getFirestoreService();
      await setUserPreferences(uid, preferences);
      return preferences;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['userPreferences', variables.uid], (oldData: any) => {
        return oldData ? { ...oldData, ...data } : data;
      });
      toast({ title: 'Preferencias actualizadas', description: 'Tus preferencias han sido actualizadas.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al actualizar preferencias', variant: 'destructive' });
    }
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
        throw new Error("No hay usuario autenticado para cambiar la contraseña.");
      }
    },
    onSuccess: () => {
      toast({ title: "Contraseña actualizada", description: 'Tu contraseña ha sido actualizada.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al cambiar contraseña', variant: 'destructive' });
    }
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
      toast({ title: "Correo enviado", description: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Error al solicitar restablecimiento', variant: 'destructive' });
    }
  });
};
