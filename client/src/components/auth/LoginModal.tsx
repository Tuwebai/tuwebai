import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PasswordStrength from './PasswordStrength';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  redirectUrl?: string;
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  defaultMode = 'login',
  redirectUrl
}: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(defaultMode === 'register');
  const [rememberMe, setRememberMe] = useState(false);
  const [formState, setFormState] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { login, register, requestPasswordReset, error: authError, clearError, loginWithGoogle, user } = useAuth();
  const { toast } = useToast();

  // Reset form when modal is opened/closed or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setFormState({
        username: '',
        name: '',
        email: localStorage.getItem('userEmail') || '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      clearError();
    }
  }, [isOpen, isRegistering, clearError]);

  // Efecto para cerrar el modal si el usuario está autenticado:
  React.useEffect(() => {
    if (isOpen && user) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Common validations
    if (!formState.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (showForgotPassword) {
      // Only email validation for password reset
    } else if (isRegistering) {
      // Registration validations
      if (!formState.username.trim()) {
        newErrors.username = 'El nombre de usuario es requerido';
      }
      
      if (!formState.name.trim()) {
        newErrors.name = 'El nombre completo es requerido';
      }
      
      if (!formState.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formState.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      
      if (formState.password !== formState.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else {
      // Login validations
      if (!formState.password) {
        newErrors.password = 'La contraseña es requerida';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (showForgotPassword) {
        // Process password reset request
        await requestPasswordReset(formState.email);
        toast({
          title: "Solicitud enviada",
          description: "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña."
        });
        setShowForgotPassword(false);
      } else if (isRegistering) {
        // Process registration
        await register({
          username: formState.username,
          email: formState.email,
          password: formState.password,
          name: formState.name
        });
        toast({
          title: "Registro exitoso",
          description: "Por favor, verifica tu email para activar tu cuenta."
        });
        setIsRegistering(false);
      } else {
        // Process login
        await login(formState.email, formState.password, rememberMe);
        toast({
          title: "Sesión iniciada",
          description: "Has iniciado sesión correctamente"
        });
        // onClose(); // Eliminado para que el efecto lo maneje
        
        // Redirect if needed
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    } catch (err: any) {
      console.error('Error en autenticación:', err);
      toast({
        title: "Error",
        description: authError || (err.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Iniciar sesión con Google
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    try {
      loginWithGoogle();
    } catch (error) {
      setIsGoogleLoading(false);
      toast({
        title: "Error",
        description: "Error al iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {showForgotPassword 
                ? 'Recuperar contraseña' 
                : (isRegistering ? 'Crear una cuenta' : 'Iniciar Sesión')}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Cerrar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Google Sign-In */}
          {!showForgotPassword && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-2 px-4 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm font-medium text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Iniciar sesión con Google"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.73 5.4 2.69 13.32l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.99 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.13a14.5 14.5 0 0 1 0-8.26l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.53l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.18-5.59c-2.01 1.35-4.59 2.15-8.71 2.15-6.38 0-11.87-3.63-14.33-8.87l7.98 6.2C6.73 42.6 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                )}
                <span>{isGoogleLoading ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
              </button>
              
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">O continúa con</span>
                </div>
              </div>
            </>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registro: username, nombre completo, email, contraseña, confirmar contraseña */}
            {/* Login: email, contraseña */}
            {/* Forgot password: email */}
            
            {isRegistering && !showForgotPassword && (
              <>
                <div>
                  <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    Nombre de usuario
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    name="username"
                    value={formState.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200`}
                    placeholder="username"
                    disabled={isSubmitting}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    Nombre completo
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200`}
                    placeholder="Tu nombre completo"
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email-login" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                Email
              </label>
              <input 
                type="email" 
                id="email-login"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200`}
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            {!showForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Contraseña
                </label>
                <input 
                  type="password" 
                  id="password"
                  name="password"
                  value={formState.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  placeholder="********"
                  disabled={isSubmitting}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {isRegistering && formState.password && <PasswordStrength password={formState.password} />}
              </div>
            )}
            
            {isRegistering && !showForgotPassword && (
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Confirmar contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formState.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200`}
                  placeholder="********"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            )}
            
            {!isRegistering && !showForgotPassword && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    disabled={isSubmitting}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                showForgotPassword 
                  ? 'Enviar instrucciones' 
                  : (isRegistering ? 'Crear cuenta' : 'Iniciar sesión')
              )}
            </button>
            {authError && <p className="text-red-500 text-xs mt-2">{authError}</p>}
          </form>
          
          {!showForgotPassword && (
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 font-medium hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={isSubmitting}
                >
                  {isRegistering ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              </p>
            </div>
          )}
          
          {showForgotPassword && (
            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-600 font-medium hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={isSubmitting}
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};