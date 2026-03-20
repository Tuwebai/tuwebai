import { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { UserIntegrationsTab } from '@/features/users/components/user-integrations-tab';
import { UserProfileTab } from '@/features/users/components/user-profile-tab';
import { UserSecurityTab } from '@/features/users/components/user-security-tab';
import type { UpdateUserPrivacyPayload, UserPrivacySettings } from '@/features/users/types/privacy';
import type { UserProfileFormState } from '@/features/users/utils/user-dashboard-forms';
import type { UserDashboardTab } from '@/features/users/utils/user-dashboard-tabs';

const PrivacyTab = lazy(() =>
  import('@/features/users/components/privacy-tab').then((module) => ({
    default: module.PrivacyTab,
  })),
);

type PasswordInfo = {
  changedAt: string | null;
  daysSinceChange: number | null;
};

type UserDashboardTabPanelProps = {
  activeTab: UserDashboardTab;
  profileForm: UserProfileFormState;
  errors: Record<string, string>;
  isEditing: boolean;
  isSavingProfile: boolean;
  isActive?: boolean;
  email?: string;
  authProvider?: 'password' | 'google';
  passwordInfo: PasswordInfo;
  isSendingPasswordReset: boolean;
  passwordResetSentTo: string | null;
  privacySettings: UserPrivacySettings;
  isLoadingPrivacy: boolean;
  isSavingPrivacy: boolean;
  onEditProfile: () => void;
  onCancelProfile: () => void;
  onSubmitProfile: (event: React.FormEvent<HTMLFormElement>) => void;
  onProfileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRequestPasswordReset: () => Promise<void>;
  onSavePrivacy: (payload: UpdateUserPrivacyPayload) => Promise<void>;
};

export function UserDashboardTabPanel({
  activeTab,
  profileForm,
  errors,
  isEditing,
  isSavingProfile,
  isActive,
  email,
  authProvider,
  passwordInfo,
  isSendingPasswordReset,
  passwordResetSentTo,
  privacySettings,
  isLoadingPrivacy,
  isSavingPrivacy,
  onEditProfile,
  onCancelProfile,
  onSubmitProfile,
  onProfileChange,
  onRequestPasswordReset,
  onSavePrivacy,
}: UserDashboardTabPanelProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 lg:p-8 lg:backdrop-blur-lg"
      >
        {activeTab === 'profile' ? (
          <UserProfileTab
            profileForm={profileForm}
            errors={errors}
            isEditing={isEditing}
            isSavingProfile={isSavingProfile}
            onEdit={onEditProfile}
            onCancel={onCancelProfile}
            onSubmit={onSubmitProfile}
            onProfileChange={onProfileChange}
          />
        ) : null}

        {activeTab === 'security' ? (
          <UserSecurityTab
            isActive={isActive}
            email={email}
            authProvider={authProvider}
            passwordInfo={passwordInfo}
            isSendingPasswordReset={isSendingPasswordReset}
            passwordResetSentTo={passwordResetSentTo}
            onRequestPasswordReset={onRequestPasswordReset}
          />
        ) : null}

        {activeTab === 'privacy' ? (
          <Suspense
            fallback={
              <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-300">
                Cargando configuración de privacidad...
              </div>
            }
          >
            <PrivacyTab
              settings={privacySettings}
              isLoading={isLoadingPrivacy}
              isSaving={isSavingPrivacy}
              onSave={onSavePrivacy}
            />
          </Suspense>
        ) : null}

        {activeTab === 'integrations' ? <UserIntegrationsTab /> : null}
      </motion.div>
    </AnimatePresence>
  );
}
