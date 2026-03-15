import type React from 'react';
import { AlertCircle, Camera, Check } from 'lucide-react';
import { UserAvatar } from '@/shared/ui/user-avatar';
import type { User } from '@/features/users/types';
import type { UserPrivacySettings } from '@/features/users/types/privacy';

interface UserDashboardHeaderProps {
  user: User | null;
  privacySettings: UserPrivacySettings;
  isUploadingImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onTriggerImageUpload: () => void;
  onLogout: () => Promise<void>;
}

const getMemberSinceLabel = (createdAt?: string) => {
  if (createdAt) {
    const date = new Date(createdAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }

  return '12 de julio de 2025';
};

export function UserDashboardHeader({
  user,
  privacySettings,
  isUploadingImage,
  fileInputRef,
  onImageUpload,
  onTriggerImageUpload,
  onLogout,
}: UserDashboardHeaderProps) {
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5 lg:backdrop-blur-lg sm:mb-8 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
          <div className="group relative">
            <UserAvatar
              image={user?.image}
              name={user?.name}
              username={user?.username}
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-2xl font-bold text-white"
              textClassName="text-white"
            />

            <div
              onClick={onTriggerImageUpload}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera className="h-6 w-6 text-white" />
            </div>

            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-white" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>

          <div className="w-full min-w-0">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-2xl font-bold text-white">{user?.name || user?.username}</h1>
              {privacySettings.profileStatusVisible &&
                (user?.isActive ? (
                  <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    <Check className="h-3 w-3" />
                    Verificada
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-1 text-xs text-yellow-400">
                    <AlertCircle className="h-3 w-3" />
                    Pendiente
                  </span>
                ))}
            </div>
            {privacySettings.profileEmailVisible ? (
              <p className="break-all text-gray-400 sm:break-normal">{user?.email}</p>
            ) : (
              <p className="text-sm text-slate-500">Email oculto en el resumen de tu panel</p>
            )}
            <p className="text-sm text-gray-500">Miembro desde {getMemberSinceLabel(user?.createdAt)}</p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-3 lg:w-auto lg:justify-end">
          <button
            type="button"
            onClick={() => {
              void onLogout();
            }}
            className="w-full rounded-lg border border-white/10 px-4 py-2 text-gray-300 transition-colors hover:border-white/20 hover:text-white sm:w-auto"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
}
