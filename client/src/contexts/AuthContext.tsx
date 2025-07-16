import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/api';

// Definición de tipos para usuarios y datos de autenticación
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
  image?: string; // Nuevo campo para la imagen del perfil
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  newsletter: boolean;
  darkMode: boolean;
  language: string;
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
  setUserImage: (imageUrl: string) => void; // Nuevo campo para actualizar la imagen del usuario
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// Creación del contexto con valores por defecto
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
  setUserImage: () => {}, // Valor por defecto para setUserImage
});

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
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
  
  // Verificar si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            // Si venimos del callback de Google, mostrar mensaje de éxito
            if (window.location.search.includes('google=1')) {
              // Limpiar la URL
              window.history.replaceState({}, document.title, window.location.pathname);
              // Mostrar toast de éxito
              toast({
                title: '¡Sesión iniciada con Google!',
                description: 'Has iniciado sesión correctamente.',
              });
            }
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error al verificar estado de autenticación:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();

    // Mostrar toast de error si hay error de Google OAuth
    if (window.location.search.includes('error=google_auth_failed')) {
      window.history.replaceState({}, document.title, window.location.pathname);
      toast({
        title: 'Error al iniciar sesión con Google',
        description: 'No se pudo completar el inicio de sesión con Google. Intenta de nuevo o usa otro método.',
        variant: 'destructive',
      });
    }
    // Mostrar toast de error si hay error de conexión a la base de datos
    if (window.location.search.includes('error=db_connection_error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
      toast({
        title: 'Error de conexión a la base de datos',
        description: 'No se pudo conectar a la base de datos. Intenta más tarde o contacta soporte.',
        variant: 'destructive',
      });
    }
  }, [toast]);
  
  // Iniciar sesión
  const login = async (email: string, password: string, remember: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, remember }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      if (data.success && data.user) {
        setUser(data.user);
        
        // Guardar email para autocompletar en próximos inicios de sesión
        if (remember && email) {
          localStorage.setItem('userEmail', email);
        }
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      setError(err.message || 'Ha ocurrido un error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Iniciar sesión con Google
  const loginWithGoogle = () => {
    try {
      window.location.href = `${API_URL}/api/auth/google`;
    } catch (error) {
      console.error('Error al iniciar login con Google:', error);
      setError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.');
    }
  };
  
  // Cerrar sesión
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cerrar sesión');
      }
      
      setUser(null);
    } catch (err: any) {
      console.error('Error en logout:', err);
      setError(err.message || 'Ha ocurrido un error al cerrar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Registrar nuevo usuario
  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      // No establecemos el usuario porque generalmente se requiere verificación por email
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err.message || 'Ha ocurrido un error al registrar el usuario');
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
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar restablecimiento de contraseña');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error al solicitar restablecimiento de contraseña');
      }
    } catch (err: any) {
      console.error('Error en solicitud de restablecimiento:', err);
      setError(err.message || 'Ha ocurrido un error en la solicitud');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Restablecer contraseña
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer contraseña');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error al restablecer contraseña');
      }
    } catch (err: any) {
      console.error('Error en restablecimiento de contraseña:', err);
      setError(err.message || 'Ha ocurrido un error al restablecer la contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar perfil de usuario
  const updateUserProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error al actualizar perfil');
      }
      
      if (responseData.success && responseData.user) {
        setUser(responseData.user);
      } else {
        throw new Error(responseData.message || 'Error al actualizar perfil');
      }
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Ha ocurrido un error al actualizar el perfil');
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
      const response = await fetch(`${API_URL}/api/profile/preferences`, { credentials: 'include' });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener preferencias');
      }
      
      const data = await response.json();
      
      if (data.success && data.preferences) {
        setUserPreferences(data.preferences);
      }
    } catch (err: any) {
      console.error('Error al obtener preferencias:', err);
      setError(err.message || 'Ha ocurrido un error al obtener las preferencias');
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
      const response = await fetch(`${API_URL}/api/profile/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar preferencias');
      }
      
      const data = await response.json();
      
      if (data.success && data.preferences) {
        setUserPreferences(data.preferences);
      } else {
        throw new Error('Error al actualizar preferencias');
      }
    } catch (err: any) {
      console.error('Error al actualizar preferencias:', err);
      setError(err.message || 'Ha ocurrido un error al actualizar las preferencias');
      throw err;
    } finally {
      setIsLoadingPreferences(false);
    }
  };
  
  // Obtener información de la contraseña
  const fetchPasswordInfo = async () => {
    if (!user) return;
    
    setIsLoadingPasswordInfo(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/profile/password-info`, { credentials: 'include' });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener información de contraseña');
      }
      
      const data = await response.json();
      
      if (data.success && data.passwordInfo) {
        setPasswordInfo(data.passwordInfo);
      }
    } catch (err: any) {
      console.error('Error al obtener información de contraseña:', err);
      setError(err.message || 'Ha ocurrido un error al obtener la información de contraseña');
    } finally {
      setIsLoadingPasswordInfo(false);
    }
  };
  
  // Cambiar contraseña
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/profile/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar contraseña');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Error al cambiar contraseña');
      }
      
      // Actualizamos la información de la contraseña después de cambiarla
      await fetchPasswordInfo();
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err);
      setError(err.message || 'Ha ocurrido un error al cambiar la contraseña');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar preferencias y información de contraseña al autenticar usuario
  useEffect(() => {
    if (user) {
      fetchUserPreferences();
      fetchPasswordInfo();
    }
  }, [user]);
  
  // Limpiar mensaje de error
  const clearError = () => {
    setError(null);
  };

  // Función para subir imagen de perfil
  const uploadProfileImage = async (imageFile: File) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convertir imagen a base64
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      const response = await fetch(`${API_URL}/api/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al subir imagen');
      }
      
      if (data.success && data.imageUrl) {
        setUser(prevUser => prevUser ? { ...prevUser, image: data.imageUrl } : null);
        // Persistir en localStorage para desarrollo
        if (typeof window !== 'undefined') {
          localStorage.setItem('userImage', data.imageUrl);
        }
      } else {
        throw new Error('Error al subir imagen');
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err);
      setError(err.message || 'Ha ocurrido un error al subir la imagen');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar la imagen del usuario
  const setUserImage = (imageUrl: string) => {
    if (user) {
      setUser(prevUser => prevUser ? { ...prevUser, image: imageUrl } : null);
      // También persistir en localStorage para desarrollo
      if (typeof window !== 'undefined') {
        localStorage.setItem('userImage', imageUrl);
      }
    }
  };
  
  // Valor del contexto
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
    setUserImage, // Exponer la función para actualizar la imagen
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};