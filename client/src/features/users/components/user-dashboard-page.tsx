import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useToast } from '@/shared/ui/use-toast';
import MetaTags from '@/shared/ui/meta-tags';
import WhatsAppButton from '@/shared/ui/whatsapp-button';
import { getErrorMessage } from '@/shared/utils/error-message';
import { useUpdateUserPrivacyMutation, useUserPrivacyQuery } from '@/features/users/hooks/use-privacy-settings';
import type { UpdateUserPrivacyPayload } from '@/features/users/types/privacy';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '@/features/users/types/privacy';
import { PrivacyTab } from '@/features/users/components/privacy-tab';
import { UserDashboardHeader } from '@/features/users/components/user-dashboard-header';
import { UserProfileTab } from '@/features/users/components/user-profile-tab';
import { UserDashboardTabsNav, type UserDashboardTab } from '@/features/users/components/user-dashboard-tabs-nav';
import { 
  Save, 
  X, 
  Globe,
  Lock, 
  Shield, 
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function PanelUsuario() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    updateUserProfile, 
    logout,
    passwordInfo,
    changePassword,
    uploadProfileImage
  } = useAuth();
  const { toast } = useToast();
  const {
    data: privacySettings = DEFAULT_USER_PRIVACY_SETTINGS,
    isLoading: isLoadingPrivacy,
  } = useUserPrivacyQuery(user?.uid);
  const updatePrivacyMutation = useUpdateUserPrivacyMutation(user?.uid);
  
  const [activeTab, setActiveTab] = useState<UserDashboardTab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redireccionar si no está autenticado y ha terminado de cargar
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Actualizar el formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: '',
        address: '',
      });
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!profileForm.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!profileForm.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (profileForm.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
      newErrors.phone = 'Número de teléfono no válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'La contraseña debe contener mayúsculas, minúsculas y números';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsSavingProfile(true);
    
    try {
      await updateUserProfile({
        name: profileForm.name,
        username: profileForm.username,
        email: profileForm.email,
      });
      
      setIsEditing(false);
      
      toast({
        title: "✅ Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente.",
      });
    } catch (error: unknown) {
      console.error('Error al actualizar perfil:', error);
      toast({
        title: "❌ Error",
        description: getErrorMessage(error, "Ha ocurrido un error al actualizar tu perfil."),
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSavingPassword(true);
    
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "✅ Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
    } catch (error: unknown) {
      console.error('Error al cambiar contraseña:', error);
      toast({
        title: "❌ Error",
        description: getErrorMessage(error, "Ha ocurrido un error al cambiar tu contraseña."),
        variant: "destructive",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "❌ Tipo de archivo no válido",
        description: "Solo se permiten imágenes JPG, PNG y WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Archivo demasiado grande",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      await uploadProfileImage(file);
      toast({
        title: "✅ Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente.",
      });
    } catch (error: unknown) {
      console.error('Error al subir imagen:', error);
      toast({
        title: "❌ Error",
        description: getErrorMessage(error, "Ha ocurrido un error al subir la imagen."),
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "👋 Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: unknown) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "❌ Error",
        description: getErrorMessage(error, "Ha ocurrido un error al cerrar sesión."),
        variant: "destructive",
      });
    }
  };

  const handleSavePrivacy = async (payload: UpdateUserPrivacyPayload) => {
    try {
      await updatePrivacyMutation.mutateAsync(payload);
      toast({
        title: 'Privacidad actualizada',
        description: 'Tus cambios de visibilidad y consentimiento ya quedaron registrados en la cuenta.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'No se pudo actualizar la configuracion de privacidad.'),
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">Cargando tu panel...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <MetaTags title="Panel de Usuario | TuWeb.ai" description="Gestiona tu cuenta, preferencias y seguridad en TuWeb.ai." />
      
      <div className="container mx-auto px-4 pb-8 pt-28 sm:pb-10 sm:pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <UserDashboardHeader
            user={user}
            privacySettings={privacySettings}
            isUploadingImage={isUploadingImage}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onTriggerImageUpload={triggerImageUpload}
            onLogout={handleLogout}
          />

          <UserDashboardTabsNav activeTab={activeTab} onTabChange={setActiveTab} />
          {/* Contenido de los Tabs */}
          <AnimatePresence mode="wait">
          <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              {activeTab === 'profile' && (
                <UserProfileTab
                  profileForm={profileForm}
                  errors={errors}
                  isEditing={isEditing}
                  isSavingProfile={isSavingProfile}
                  onEdit={() => setIsEditing(true)}
                  onCancel={() => {
                    setIsEditing(false);
                    setProfileForm({
                      name: user?.name || '',
                      username: user?.username || '',
                      email: user?.email || '',
                      phone: '',
                      address: '',
                    });
                  }}
                  onSubmit={handleSaveProfile}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5" />
                    Seguridad de la Cuenta
                  </h2>

                  {/* Información de la cuenta */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">Estado de la cuenta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Estado</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user?.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {user?.isActive ? 'Activa' : 'En revisión'}
                              </span>
                            </div>
                      {passwordInfo.changedAt && (
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Último cambio de contraseña</span>
                          <span className="text-white">
                            {new Date(passwordInfo.changedAt).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                          </div>
                      )}
                      {passwordInfo.daysSinceChange !== null && (
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Días desde el último cambio</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            passwordInfo.daysSinceChange > 90 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : passwordInfo.daysSinceChange > 60 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {passwordInfo.daysSinceChange} días
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cambio de contraseña */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Cambiar contraseña</h3>
                      {!isChangingPassword && (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                        >
                          <Lock className="w-4 h-4" />
                          Cambiar contraseña
                        </button>
                      )}
                    </div>

                    {isChangingPassword && (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña actual</label>
                          <div className="relative">
                        <input
                              type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.currentPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.currentPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.currentPassword}
                          </span>}
                      </div>
                      
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Nueva contraseña</label>
                          <div className="relative">
                        <input
                              type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.newPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.newPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.newPassword}
                          </span>}
                      </div>
                      
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Confirmar nueva contraseña</label>
                          <div className="relative">
                        <input
                              type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                        />
                        <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                          {errors.confirmPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.confirmPassword}
                          </span>}
                      </div>
                      
                        <div className="flex gap-3 pt-4">
                        <button
                            type="submit" 
                            disabled={isSavingPassword} 
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-60"
                          >
                            {isSavingPassword ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Actualizando...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Actualizar contraseña
                              </>
                            )}
                        </button>
                        <button
                            type="button" 
                            onClick={() => { 
                              setIsChangingPassword(false); 
                              setPasswordForm({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              }); 
                            }} 
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                          >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                      </div>
                      </form>
                  )}
                  </div>
                </div>
              )}
              
              {/* Tab: Privacidad */}
              {activeTab === 'privacy' && (
                <PrivacyTab
                  settings={privacySettings}
                  isLoading={isLoadingPrivacy}
                  isSaving={updatePrivacyMutation.isPending}
                  onSave={handleSavePrivacy}
                />
              )}

              {/* Tab: Integraciones */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5" />
                    Integraciones y Conexiones
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Servicios conectados */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4">Servicios conectados</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">G</span>
                    </div>
                            <div>
                              <p className="text-white font-medium">Google</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                  </div>
                </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
            </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">F</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Facebook</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">G</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">GitHub</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* API Keys */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4">API Keys</h3>
                      <div className="space-y-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-300 text-sm mb-2">API Key de desarrollo</p>
                          <div className="flex items-center gap-2">
                            <input 
                              type="password" 
                              value="••••••••••••••••••••••••••••••••" 
                              className="flex-1 px-3 py-2 bg-white/5 text-white border border-white/20 rounded-lg text-sm"
                              readOnly
                            />
                            <button className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">
                              Copiar
                            </button>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all">
                          Generar nueva API Key
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Información de integraciones */}
                  <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-lg font-medium text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Próximamente
                    </h3>
                    <p className="text-yellow-300 text-sm">
                      Las integraciones con servicios externos estarán disponibles próximamente. 
                      Esto te permitirá conectar tu cuenta con otras plataformas y servicios.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </motion.div>
        </div>
      
      <WhatsAppButton />
    </div>
  );
}



