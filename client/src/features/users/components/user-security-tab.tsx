import type React from 'react';
import { AlertCircle, Eye, EyeOff, Lock, Save, Shield, X } from 'lucide-react';

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PasswordInfo = {
  changedAt: string | null;
  daysSinceChange: number | null;
};

type UserSecurityTabProps = {
  isActive?: boolean;
  passwordInfo: PasswordInfo;
  isChangingPassword: boolean;
  isSavingPassword: boolean;
  showPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  passwordForm: PasswordFormState;
  errors: Record<string, string>;
  onStartChangePassword: () => void;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onTogglePasswordVisibility: () => void;
  onToggleNewPasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
};

export function UserSecurityTab({
  isActive,
  passwordInfo,
  isChangingPassword,
  isSavingPassword,
  showPassword,
  showNewPassword,
  showConfirmPassword,
  passwordForm,
  errors,
  onStartChangePassword,
  onPasswordChange,
  onSubmit,
  onCancel,
  onTogglePasswordVisibility,
  onToggleNewPasswordVisibility,
  onToggleConfirmPasswordVisibility,
}: UserSecurityTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
        <Shield className="h-5 w-5" />
        Seguridad de la cuenta
      </h2>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 text-lg font-medium text-white">Estado de la cuenta</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
            <span className="text-gray-300">Estado</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                isActive
                  ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                  : 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {isActive ? 'Activa' : 'En revision'}
            </span>
          </div>

          {passwordInfo.changedAt && (
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <span className="text-gray-300">Ultimo cambio de contrasena</span>
              <span className="text-white">
                {new Date(passwordInfo.changedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {passwordInfo.daysSinceChange !== null && (
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <span className="text-gray-300">Dias desde el ultimo cambio</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  passwordInfo.daysSinceChange > 90
                    ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                    : passwordInfo.daysSinceChange > 60
                      ? 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
                      : 'border border-green-500/30 bg-green-500/20 text-green-400'
                }`}
              >
                {passwordInfo.daysSinceChange} dias
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Cambiar contrasena</h3>
          {!isChangingPassword && (
            <button
              onClick={onStartChangePassword}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600"
              type="button"
            >
              <Lock className="h-4 w-4" />
              Cambiar contrasena
            </button>
          )}
        </div>

        {isChangingPassword && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Contrasena actual</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={onPasswordChange}
                  className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                    errors.currentPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={onTogglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.currentPassword}
                </span>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Nueva contrasena</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={onPasswordChange}
                  className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                    errors.newPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={onToggleNewPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.newPassword}
                </span>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Confirmar nueva contrasena</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={onPasswordChange}
                  className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="mt-1 flex items-center gap-1 text-sm text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-all disabled:opacity-60 hover:bg-blue-600"
              >
                {isSavingPassword ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Actualizar contrasena
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-all hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
