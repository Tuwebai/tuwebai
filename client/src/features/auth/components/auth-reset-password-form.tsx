import type { FormEvent } from 'react';

interface AuthResetPasswordFormProps {
  email: string;
  newPassword: string;
  confirmPassword: string;
  error: string;
  isSubmitting: boolean;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AuthResetPasswordForm({
  email,
  newPassword,
  confirmPassword,
  error,
  isSubmitting,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: AuthResetPasswordFormProps) {
  const isPasswordShort = newPassword.length > 0 && newPassword.length < 8;
  const passwordsDoNotMatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
        Vas a actualizar la contraseña de <span className="font-medium text-white">{email}</span>.
      </div>

      <div className="space-y-2">
        <label htmlFor="new-password" className="block text-sm font-medium text-slate-200">
          Nueva contraseña
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) => onNewPasswordChange(event.target.value)}
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
          placeholder="Ingresá tu nueva contraseña"
        />
        {isPasswordShort && (
          <p className="text-xs text-rose-300">La contraseña debe tener al menos 8 caracteres.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-200">
          Confirmar contraseña
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none transition focus:border-cyan-400"
          placeholder="Repetí la nueva contraseña"
        />
        {passwordsDoNotMatch && (
          <p className="text-xs text-rose-300">Las contraseñas no coinciden.</p>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Actualizando contraseña...' : 'Guardar nueva contraseña'}
      </button>
    </form>
  );
}
