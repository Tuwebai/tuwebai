import { KeyRound, Mail, Shield } from 'lucide-react';

type PasswordInfo = {
  changedAt: string | null;
  daysSinceChange: number | null;
};

type UserSecurityTabProps = {
  isActive?: boolean;
  email?: string;
  passwordInfo: PasswordInfo;
  isSendingPasswordReset: boolean;
  passwordResetSentTo: string | null;
  onRequestPasswordReset: () => Promise<void>;
};

export function UserSecurityTab({
  isActive,
  email,
  passwordInfo,
  isSendingPasswordReset,
  passwordResetSentTo,
  onRequestPasswordReset,
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
              {isActive ? 'Activa' : 'En revisión'}
            </span>
          </div>

          {passwordInfo.changedAt && (
            <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
              <span className="text-gray-300">Último cambio de contraseña</span>
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
              <span className="text-gray-300">Días desde el último cambio</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  passwordInfo.daysSinceChange > 90
                    ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                    : passwordInfo.daysSinceChange > 60
                      ? 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
                      : 'border border-green-500/30 bg-green-500/20 text-green-400'
                }`}
              >
                {passwordInfo.daysSinceChange} días
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-white">Restablecer contraseña</h3>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              Por seguridad, el cambio de contraseña se hace desde un enlace enviado a tu correo.
              El botón te manda a una página dedicada para completar el proceso.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void onRequestPasswordReset();
            }}
            disabled={isSendingPasswordReset || !email}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingPasswordReset ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
                Enviando...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Enviar enlace
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
            <div className="space-y-2">
              <p>
                Correo de destino:{' '}
                <span className="font-medium text-white">{email || 'No configurado'}</span>
              </p>
              <p>
                Cuando abras el email, vas a entrar a una página segura de TuWeb.ai para elegir la nueva contraseña.
              </p>
              {passwordResetSentTo ? (
                <p className="font-medium text-emerald-300">
                  Enlace enviado correctamente a {passwordResetSentTo}.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
