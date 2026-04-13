import type React from 'react';
import { AlertCircle, Edit3, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';
import type { UserProfileFormState } from '@/features/users/utils/user-dashboard-forms';

type UserProfileTabProps = {
  profileForm: UserProfileFormState;
  errors: Record<string, string>;
  isEditing: boolean;
  isSavingProfile: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onProfileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function UserProfileTab({
  profileForm,
  errors,
  isEditing,
  isSavingProfile,
  onEdit,
  onCancel,
  onSubmit,
  onProfileChange,
}: UserProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
          <User className="h-5 w-5" />
          Información personal
        </h2>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-4 py-2 font-medium text-white shadow-[var(--glow-signal)] transition-all hover:scale-[1.02]"
            type="button"
          >
            <Edit3 className="h-4 w-4" />
            Editar perfil
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <User className="h-4 w-4" />
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={onProfileChange}
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                errors.name ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isEditing}
            />
            {errors.name && (
              <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <User className="h-4 w-4" />
              Nombre de usuario
            </label>
            <input
              type="text"
              name="username"
              value={profileForm.username}
              onChange={onProfileChange}
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                errors.username ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isEditing}
            />
            {errors.username && (
              <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={onProfileChange}
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                errors.email ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isEditing}
            />
            {errors.email && (
              <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <Phone className="h-4 w-4" />
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              name="phone"
              value={profileForm.phone}
              onChange={onProfileChange}
              placeholder="+54 357 141 7960"
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                errors.phone ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isEditing}
            />
            {errors.phone && (
              <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-300">
              <MapPin className="h-4 w-4" />
              Dirección (opcional)
            </label>
            <input
              type="text"
              name="address"
              value={profileForm.address}
              onChange={onProfileChange}
              placeholder="Calle, Ciudad, País"
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                errors.address ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              } ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isEditing}
            />
            {errors.address && (
              <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                <AlertCircle className="h-3 w-3" />
                {errors.address}
              </span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 rounded-lg bg-[image:var(--gradient-brand)] px-6 py-3 font-medium text-white shadow-[var(--glow-signal)] transition-all disabled:opacity-60 hover:scale-[1.02]"
            >
              {isSavingProfile ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="editorial-secondary-button flex items-center gap-2 rounded-lg px-6 py-3 font-medium"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
