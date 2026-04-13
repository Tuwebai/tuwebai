import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '@/features/auth/context/AuthContext';
import { UserDashboardHeader } from '@/features/users/components/user-dashboard-header';
import { PulseDashboardCard } from '@/features/users/components/pulse-dashboard-card';
import { UserDashboardTabPanel } from '@/features/users/components/user-dashboard-tab-panel';
import { UserDashboardTabsNav } from '@/features/users/components/user-dashboard-tabs-nav';
import { useUpdateUserPrivacyMutation, useUserPrivacyQuery } from '@/features/users/hooks/use-privacy-settings';
import type { UpdateUserPrivacyPayload } from '@/features/users/types/privacy';
import { DEFAULT_USER_PRIVACY_SETTINGS } from '@/features/users/types/privacy';
import {
  buildUserDashboardPath,
  resolveUserDashboardTab,
} from '@/features/users/utils/user-dashboard-tabs';
import {
  createInitialProfileForm,
  validateUserProfileForm,
} from '@/features/users/utils/user-dashboard-forms';
import MetaTags from '@/shared/ui/meta-tags';
import WhatsAppButton from '@/shared/ui/whatsapp-button';
import { useToast } from '@/shared/ui/use-toast';
import { getErrorMessage } from '@/shared/utils/error-message';

export default function UserDashboardPage() {
  const {
    user,
    isLoading,
    isAuthenticated,
    updateUserProfile,
    logout,
    passwordInfo,
    requestPasswordReset,
    uploadProfileImage,
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tab: tabSegment } = useParams<{ tab?: string }>();

  const activeTab = resolveUserDashboardTab(tabSegment);
  const {
    data: privacySettings = DEFAULT_USER_PRIVACY_SETTINGS,
    isLoading: isLoadingPrivacy,
  } = useUserPrivacyQuery(user?.uid);
  const updatePrivacyMutation = useUpdateUserPrivacyMutation(user?.uid);

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [profileForm, setProfileForm] = useState(() => createInitialProfileForm(user));
  const [passwordResetSentTo, setPasswordResetSentTo] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!tabSegment) {
      navigate(buildUserDashboardPath(activeTab), { replace: true });
      return;
    }

    const canonicalPath = buildUserDashboardPath(activeTab);
    if (canonicalPath !== `/panel/${tabSegment}`) {
      navigate(canonicalPath, { replace: true });
    }
  }, [activeTab, navigate, tabSegment]);

  useEffect(() => {
    if (user) {
      setProfileForm(createInitialProfileForm(user));
    }
  }, [user]);

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleTabChange = (tab: ReturnType<typeof resolveUserDashboardTab>) => {
    navigate(buildUserDashboardPath(tab));
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateUserProfileForm(profileForm);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSavingProfile(true);

    try {
      await updateUserProfile({
        name: profileForm.name,
        username: profileForm.username,
        email: profileForm.email,
      });

      setIsEditing(false);
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información de perfil fue actualizada correctamente.',
      });
    } catch (error: unknown) {
      console.error('Error al actualizar perfil:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'No se pudo actualizar tu perfil.'),
        variant: 'destructive',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRequestPasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No hay un correo configurado para enviar el enlace de restablecimiento.',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingPasswordReset(true);

    try {
      await requestPasswordReset(user.email);
      setPasswordResetSentTo(user.email);
    } catch (error: unknown) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      setPasswordResetSentTo(null);
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten imágenes JPG, PNG y WebP.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo demasiado grande',
        description: 'La imagen debe ser menor a 5 MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      await uploadProfileImage(file);
      toast({
        title: 'Imagen actualizada',
        description: 'Tu foto de perfil fue actualizada correctamente.',
      });
    } catch (error: unknown) {
      console.error('Error al subir imagen:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'No se pudo subir la imagen.'),
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Sesión cerrada',
        description: 'Cerraste sesión correctamente.',
      });
    } catch (error: unknown) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'No se pudo cerrar la sesión.'),
        variant: 'destructive',
      });
    }
  };

  const handleSavePrivacy = async (payload: UpdateUserPrivacyPayload) => {
    try {
      await updatePrivacyMutation.mutateAsync(payload);
      toast({
        title: 'Privacidad actualizada',
        description: 'Tus cambios de visibilidad y consentimiento quedaron registrados.',
      });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: getErrorMessage(error, 'No se pudo actualizar la configuración de privacidad.'),
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="page-shell-surface flex min-h-screen flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
        <p className="mt-4 text-gray-400">Cargando tu panel...</p>
      </div>
    );
  }

  return (
    <div className="page-shell-surface min-h-screen">
      <MetaTags
        title="Panel de usuario"
        description="Gestioná tu cuenta, privacidad y seguridad en TuWeb.ai."
        robots="noindex,follow"
      />

      <div className="container mx-auto px-3 pb-8 pt-24 sm:px-4 sm:pb-10 sm:pt-28 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl"
        >
          <UserDashboardHeader
            user={user}
            privacySettings={privacySettings}
            isUploadingImage={isUploadingImage}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onTriggerImageUpload={() => fileInputRef.current?.click()}
            onLogout={handleLogout}
          />

          <PulseDashboardCard email={user?.email} userUid={user?.uid} />

          <UserDashboardTabsNav activeTab={activeTab} onTabChange={handleTabChange} />

          <UserDashboardTabPanel
            activeTab={activeTab}
            profileForm={profileForm}
            errors={errors}
            isEditing={isEditing}
            isSavingProfile={isSavingProfile}
            isActive={user?.isActive}
            email={user?.email}
            authProvider={user?.authProvider}
            passwordInfo={passwordInfo}
            isSendingPasswordReset={isSendingPasswordReset}
            passwordResetSentTo={passwordResetSentTo}
            privacySettings={privacySettings}
            isLoadingPrivacy={isLoadingPrivacy}
            isSavingPrivacy={updatePrivacyMutation.isPending}
            onEditProfile={() => setIsEditing(true)}
            onCancelProfile={() => {
              setIsEditing(false);
              setProfileForm(createInitialProfileForm(user));
              setErrors({});
            }}
            onSubmitProfile={handleSaveProfile}
            onProfileChange={handleProfileChange}
            onRequestPasswordReset={handleRequestPasswordReset}
            onSavePrivacy={handleSavePrivacy}
          />
        </motion.div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
