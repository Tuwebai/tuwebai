import React, { createContext, useState, useContext, useEffect } from 'react';
import type {
  User as FirebaseUser,
} from 'firebase/auth';
import type {
  User as FirestoreUser,
  UserPreferences
} from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

// Helper properties para cargar dinámicamente librerías pesadas (Firebase) solo cuando se necesiten, no en boot
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

interface AuthContextType {
  user: User | null;
  userPreferences: UserPreferences;
  passwordInfo: PasswordInfo;
  isLoading: boolean;
  isLoadingPreferences: boolean;
  isLoadingPasswordInfo: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: () => void;
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
  error: string | null;
  clearError: () => void;
  setUserImage: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userPreferences: {
    emailNotifications: false,
    newsletter: false,
    darkMode: false,
    language: 'es'
  },
  passwordInfo: {
    changedAt: null,
    daysSinceChange: null
  },
  isLoading: true,
  isLoadingPreferences: false,
  isLoadingPasswordInfo: false,
  isAuthenticated: false,
  login: async () => {},
  loginWithGoogle: () => {},
  logout: async () => {},
  register: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  updateUserPreferences: async () => {},
  changePassword: async () => {},
  fetchUserPreferences: async () => {},
  fetchPasswordInfo: async () => {},
  uploadProfileImage: async () => {},
  error: null,
  clearError: () => {},
  setUserImage: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [userPreferences, setUserPreferencesState] = useState<UserPreferences>({
    emailNotifications: false,
    newsletter: false,
    darkMode: false,
    language: 'es'
  });
  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    changedAt: null,
    daysSinceChange: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false);
  const [isLoadingPasswordInfo, setIsLoadingPasswordInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Escuchar cambios de autenticación
  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { auth } = await getFirebase();
        const { onAuthStateChanged } = await getFirebaseAuth();
        const { getUser } = await getFirestoreService();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (!isMounted) return; // Prevent state updates if component unmounted
          setIsLoading(true);
          if (firebaseUser) {
            // Obtener datos del usuario desde Firestore
            let dbUser = await getUser(firebaseUser.uid);
            if (!dbUser) {
              const { setUser } = await getFirestoreService();
              dbUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                username: firebaseUser.displayName || '',
                name: firebaseUser.displayName || '',
                image: firebaseUser.photoURL || '',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(), // Added missing updatedAt
              };
              await setUser(dbUser);
            }
            if (isMounted) {
              setUserState(dbUser);
              fetchUserPreferences(); // Call fetchUserPreferences without uid, it will use the user state
            }
          } else {
            if (isMounted) {
              setUserState(null);
              setUserPreferencesState({
                emailNotifications: false,
                newsletter: false,
                darkMode: false,
                language: 'es'
              });
            }
          }
          if (isMounted) setIsLoading(false);
        });
        
        if (isMounted) unsubscribeFn = unsubscribe;
        else unsubscribe(); // If component unmounted before unsubscribeFn is set, unsubscribe immediately
      } catch (error) {
        console.error("Error inicializando Auth:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  // Login con email y contraseña
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { auth } = await getFirebase();
      const { signInWithEmailAndPassword } = await getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // El listener de onAuthStateChanged se encarga del resto
      toast({ title: 'Sesión iniciada', description: 'Has iniciado sesión correctamente.' });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      toast({ title: 'Error', description: err.message || 'Error al iniciar sesión', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
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
      setUserState(dbUser);
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido${result.user.displayName ? `, ${result.user.displayName}` : ''}!`,
      });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      toast({ title: 'Error', description: err.message || 'Error al iniciar sesión con Google', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { auth } = await getFirebase();
      const { signOut } = await getFirebaseAuth();
      await signOut(auth);
      setUserState(null);
      setUserPreferencesState({
        emailNotifications: false,
        newsletter: false,
        darkMode: false,
        language: 'es'
      });
      toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
      toast({ title: 'Error', description: err.message || 'Error al cerrar sesión', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Registro
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { auth } = await getFirebase();
      const { createUserWithEmailAndPassword, updateProfile } = await getFirebaseAuth();
      const { setUser } = await getFirestoreService();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update Auth Profile
      await updateProfile(userCredential.user, {
        displayName: userData.name || userData.username,
      });

      // Save user to Firestore directly
      const newUser: User = {
        uid: userCredential.user.uid,
        email: userData.email,
        username: userData.username,
        name: userData.name || userData.username,
        image: userCredential.user.photoURL || '', // Use photoURL from firebaseUser if available
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await setUser(newUser);
      setUserState(newUser); // Set the user state after successful registration and Firestore save
      
      toast({ title: 'Registro exitoso', description: 'Por favor, verifica tu email para activar tu cuenta.' });
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      toast({ title: 'Error', description: err.message || 'Error al registrar usuario', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Solicitar restablecimiento de contraseña
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { auth } = await getFirebase();
      const { sendPasswordResetEmail } = await getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Correo enviado", description: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
    } catch (err: any) {
      setError(err.message || 'Error al solicitar restablecimiento de contraseña');
      toast({ title: 'Error', description: err.message || 'Error al solicitar restablecimiento', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Restablecer contraseña (no se usa token en frontend con Firebase)
  const resetPassword = async (_token: string, _newPassword: string) => {
    // Firebase maneja esto por email, no por token manual
    toast({ title: 'Función no soportada', description: 'Usa el enlace enviado por email para restablecer tu contraseña.' });
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { updateUser } = await getFirestoreService();
      await updateUser(user.uid, data);
      // Update local state directly for immediate feedback
      setUserState(prevUser => prevUser ? { ...prevUser, ...data } : null);
      toast({ title: 'Perfil actualizado', description: 'Tu información de perfil ha sido actualizada.' });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
      toast({ title: 'Error', description: err.message || 'Error al actualizar perfil', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener preferencias del usuario
  const fetchUserPreferences = async () => {
    if (!user) return;
    setIsLoadingPreferences(true);
    setError(null);
    try {
      const { getUserPreferences } = await getFirestoreService();
      const prefs = await getUserPreferences(user.uid);
      if (prefs) setUserPreferencesState(prefs);
    } catch (err: any) {
      setError(err.message || 'Error al obtener preferencias');
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  // Actualizar preferencias del usuario
  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    setIsLoadingPreferences(true);
    setError(null);
    try {
      const { setUserPreferences } = await getFirestoreService();
      await setUserPreferences(user.uid, preferences);
      setUserPreferencesState(prev => ({ ...prev, ...preferences }));
      toast({ title: 'Preferencias actualizadas', description: 'Tus preferencias han sido actualizadas.' });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar preferencias');
      toast({ title: 'Error', description: err.message || 'Error al actualizar preferencias', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  // Obtener información de la contraseña (no disponible en Firebase, se simula)
  const fetchPasswordInfo = async () => {
    setIsLoadingPasswordInfo(true);
    setPasswordInfo({ changedAt: null, daysSinceChange: null });
    setIsLoadingPasswordInfo(false);
  };

  // Cambiar contraseña
  const changePassword = async (_currentPassword: string, newPassword: string) => {
    if (!user) return; // Ensure user is logged in
    setIsLoading(true);
    setError(null);
    try {
      const { auth } = await getFirebase();
      const { updatePassword } = await getFirebaseAuth();
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast({
          title: "Contraseña actualizada", description: 'Tu contraseña ha sido actualizada.' });
      } else {
        throw new Error("No hay usuario autenticado para cambiar la contraseña.");
      }
    } catch (err: any) {
      setError(err.message || 'Error al cambiar contraseña');
      toast({ title: 'Error', description: err.message || 'Error al cambiar contraseña', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Subir imagen de perfil (solo se guarda la URL, para Storage implementar aparte)
  const uploadProfileImage = async (imageFile: File) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      // Convertir imagen a base64 (solo para demo, en producción usar Firebase Storage)
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      const { updateUser, getUser } = await getFirestoreService();
      await updateUser(user.uid, { image: imageData });
      const updated = await getUser(user.uid);
      setUserState(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userImage', imageData);
      }
      toast({ title: 'Imagen actualizada', description: 'Tu foto de perfil ha sido actualizada.' });
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      toast({ title: 'Error', description: err.message || 'Error al subir imagen', variant: 'destructive' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar la imagen del usuario en el estado
  const setUserImage = (imageUrl: string) => {
    if (user) {
      setUserState(prevUser => prevUser ? { ...prevUser, image: imageUrl } : null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userImage', imageUrl);
      }
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    userPreferences,
    passwordInfo,
    isLoading,
    isLoadingPreferences,
    isLoadingPasswordInfo,
    isAuthenticated: !!user,
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
    error,
    clearError,
    setUserImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};