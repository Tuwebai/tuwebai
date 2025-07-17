import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  User as FirebaseUser,
  updatePassword
} from 'firebase/auth';
import {
  getUser,
  setUser,
  updateUser,
  getUserPreferences,
  setUserPreferences,
  User as FirestoreUser,
  UserPreferences
} from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Obtener datos del usuario desde Firestore
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
        fetchUserPreferences(dbUser.uid);
      } else {
        setUserState(null);
        setUserPreferencesState({
          emailNotifications: false,
          newsletter: false,
          darkMode: false,
          language: 'es'
        });
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login con email y contraseña
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
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
      toast({ title: '¡Sesión iniciada con Google!', description: 'Has iniciado sesión correctamente.' });
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
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      await updateProfile(cred.user, {
        displayName: userData.name || userData.username,
      });
      const dbUser: User = {
        uid: cred.user.uid,
        email: userData.email,
        username: userData.username,
        name: userData.name || userData.username,
        image: cred.user.photoURL || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setUser(dbUser);
      setUserState(dbUser);
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
      await sendPasswordResetEmail(auth, email);
      toast({ title: 'Solicitud enviada', description: 'Si el email existe, recibirás instrucciones para restablecer tu contraseña.' });
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
      await updateUser(user.uid, data);
      const updated = await getUser(user.uid);
      setUserState(updated);
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
  const fetchUserPreferences = async (uid?: string) => {
    if (!user && !uid) return;
    setIsLoadingPreferences(true);
    setError(null);
    try {
      const prefs = await getUserPreferences(uid || user!.uid);
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
      await setUserPreferences(user.uid, preferences);
      await fetchUserPreferences(user.uid);
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
    if (!auth.currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast({ title: 'Contraseña actualizada', description: 'Tu contraseña ha sido actualizada.' });
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