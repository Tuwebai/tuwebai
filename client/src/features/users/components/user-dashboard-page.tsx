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
import { UserIntegrationsTab } from '@/features/users/components/user-integrations-tab';
import { UserProfileTab } from '@/features/users/components/user-profile-tab';
import { UserSecurityTab } from '@/features/users/components/user-security-tab';
import { UserDashboardTabsNav, type UserDashboardTab } from '@/features/users/components/user-dashboard-tabs-nav';
import {
  createInitialPasswordForm,
  createInitialProfileForm,
  validateUserPasswordForm,
  validateUserProfileForm,
} from '@/features/users/utils/user-dashboard-forms';

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
  const [profileForm, setProfileForm] = useState(() => createInitialProfileForm(user));
  
  const [passwordForm, setPasswordForm] = useState(createInitialPasswordForm);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redireccionar si no está autenticado y ha terminado de cargar
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Actualizar el formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setProfileForm(createInitialProfileForm(user));
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
    const newErrors = validateUserProfileForm(profileForm);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = validateUserPasswordForm(passwordForm);
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
      setPasswordForm(createInitialPasswordForm());
      
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
                    setProfileForm(createInitialProfileForm(user));
                  }}
                  onSubmit={handleSaveProfile}
                  onProfileChange={handleProfileChange}
                />
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'security' && (
                <UserSecurityTab
                  isActive={user?.isActive}
                  passwordInfo={passwordInfo}
                  isChangingPassword={isChangingPassword}
                  isSavingPassword={isSavingPassword}
                  showPassword={showPassword}
                  showNewPassword={showNewPassword}
                  showConfirmPassword={showConfirmPassword}
                  passwordForm={passwordForm}
                  errors={errors}
                  onStartChangePassword={() => setIsChangingPassword(true)}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={handleChangePassword}
                  onCancel={() => {
                    setIsChangingPassword(false);
                    setPasswordForm(createInitialPasswordForm());
                  }}
                  onTogglePasswordVisibility={() => setShowPassword((current) => !current)}
                  onToggleNewPasswordVisibility={() => setShowNewPassword((current) => !current)}
                  onToggleConfirmPasswordVisibility={() => setShowConfirmPassword((current) => !current)}
                />
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
              {activeTab === 'integrations' && <UserIntegrationsTab />}
            </motion.div>
          </AnimatePresence>
          </motion.div>
        </div>
      
      <WhatsAppButton />
    </div>
  );
}



