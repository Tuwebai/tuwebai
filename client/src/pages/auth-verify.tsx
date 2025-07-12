import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MetaTags from '@/components/seo/meta-tags';

// Verificar si es entorno de desarrollo
const isDevelopment = process.env.NODE_ENV === 'development';

export default function AuthVerify() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'verify';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [devEmail, setDevEmail] = useState('');
  const [isDevVerifying, setIsDevVerifying] = useState(false);
  
  // Para formulario de reseteo de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        setMessage('Token no válido o expirado.');
        return;
      }
      
      if (action === 'reset') {
        // No verificar el token en caso de reseteo de contraseña
        // Se validará al enviar el formulario
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/auth/verify/${token}`);
        const data = await response.json();
        
        setIsSuccess(data.success);
        setMessage(data.message);
        
        if (data.success) {
          toast({
            title: "Verificación exitosa",
            description: "Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión."
          });
          
          // Redirigir al inicio después de 3 segundos
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        setIsSuccess(false);
        setMessage('Error al verificar la cuenta. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [token, action, navigate, toast]);
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar contraseñas
    if (!newPassword) {
      setError('La contraseña es requerida');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await resetPassword(token || '', newPassword);
      
      setIsSuccess(true);
      setMessage('Tu contraseña ha sido restablecida correctamente.');
      
      toast({
        title: "Contraseña restablecida",
        description: "Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
      });
      
      // Redirigir al inicio después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error: any) {
      setIsSuccess(false);
      setError(error.message || 'Error al restablecer la contraseña. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Función para verificación manual en desarrollo
  const handleDevVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!devEmail) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un email válido",
        variant: "destructive"
      });
      return;
    }
    
    setIsDevVerifying(true);
    
    try {
      const response = await fetch(`/api/auth/dev-verify/${devEmail}`);
      const data = await response.json();
      
      setIsSuccess(data.success);
      setMessage(data.message);
      
      if (data.success) {
        toast({
          title: "Verificación exitosa",
          description: "Cuenta verificada manualmente. Ya puedes iniciar sesión."
        });
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error al verificar la cuenta. Por favor, intenta de nuevo.');
    } finally {
      setIsDevVerifying(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-12">
      <MetaTags
        title={action === 'verify' ? "Verificación de cuenta" : "Restablecer contraseña"}
        description={action === 'verify' ? "Verifica tu cuenta para acceder a todas las funcionalidades" : "Restablece tu contraseña para acceder a tu cuenta"}
      />
      
      {/* Herramienta de verificación en desarrollo */}
      {isDevelopment && !token && (
        <motion.div
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="inline-block p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mt-2 text-gray-800 dark:text-gray-200">
                Herramienta de desarrollo
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Verificación manual de cuentas (solo en desarrollo)
              </p>
            </div>
            
            <form onSubmit={handleDevVerify} className="space-y-4">
              <div>
                <label htmlFor="devEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email de la cuenta
                </label>
                <input
                  type="email"
                  id="devEmail"
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="usuario@ejemplo.com"
                  disabled={isDevVerifying}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isDevVerifying}
              >
                {isDevVerifying ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </div>
                ) : 'Verificar cuenta manualmente'}
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Esta herramienta solo está disponible en el entorno de desarrollo.
              </p>
            </form>
          </div>
        </motion.div>
      )}
    
      <motion.div
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            {/* Logo */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              TuWeb<span className="text-blue-600">.ai</span>
            </h1>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {action === 'verify' ? "Verificación de cuenta" : "Restablecer contraseña"}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Procesando tu solicitud...</p>
            </div>
          ) : (
            <>
              {action === 'verify' ? (
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                    {isSuccess ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <h3 className={`text-lg font-medium mt-4 ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isSuccess ? 'Verificación exitosa' : 'Error de verificación'}
                  </h3>
                  
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {message}
                  </p>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Volver al inicio
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isSuccess ? (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      
                      <h3 className="text-lg font-medium mt-4 text-green-600 dark:text-green-400">
                        Contraseña restablecida
                      </h3>
                      
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {message}
                      </p>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => navigate('/')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Volver al inicio
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nueva contraseña
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="********"
                          disabled={isSubmitting}
                        />
                        {newPassword && newPassword.length < 8 && (
                          <p className="text-red-500 text-xs mt-1">La contraseña debe tener al menos 8 caracteres</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmar contraseña
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-all duration-200"
                          placeholder="********"
                          disabled={isSubmitting}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                        )}
                      </div>
                      
                      {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                          {error}
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
                        ) : 'Restablecer contraseña'}
                      </button>
                    </form>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}