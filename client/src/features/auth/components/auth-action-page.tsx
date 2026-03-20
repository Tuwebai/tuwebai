import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useAuthActions } from '@/features/auth/context/AuthContext';
import { AuthActionStatus } from '@/features/auth/components/auth-action-status';
import { AuthResetPasswordForm } from '@/features/auth/components/auth-reset-password-form';
import {
  applyPreparedAuthAction,
  prepareAuthAction,
  resolveAuthAction,
} from '@/features/auth/services/auth-action.service';
import { verifyAuthToken } from '@/features/auth/services/auth.service';
import MetaTags from '@/shared/ui/meta-tags';
import { useToast } from '@/shared/ui/use-toast';
import type { PreparedAuthAction } from '@/features/auth/types/auth-action';

type PageState =
  | { kind: 'loading' }
  | { kind: 'ready'; action: PreparedAuthAction }
  | { kind: 'success'; title: string; description: string }
  | { kind: 'error'; title: string; description: string };

const successCopy: Record<Exclude<PreparedAuthAction['mode'], 'resetPassword'>, { title: string; getDescription: (email: string | null) => string }> = {
  verifyEmail: {
    title: 'Correo verificado',
    getDescription: (email) => (
      email
        ? `La dirección ${email} quedó verificada. Ya podés iniciar sesión en TuWeb.ai.`
        : 'Tu dirección de correo quedó verificada. Ya podés iniciar sesión en TuWeb.ai.'
    ),
  },
  recoverEmail: {
    title: 'Correo restaurado',
    getDescription: (email) => (
      email
        ? `Se revirtió el cambio de correo y ${email} volvió a quedar asociado a tu cuenta.`
        : 'Se revirtió el cambio de correo de tu cuenta correctamente.'
    ),
  },
};

export default function AuthActionPage() {
  const { token } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuthActions();

  const resolvedAction = useMemo(
    () => resolveAuthAction({ searchParams, token }),
    [searchParams, token],
  );

  const [pageState, setPageState] = useState<PageState>({ kind: 'loading' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      if (resolvedAction.kind === 'invalid') {
        setPageState({
          kind: 'error',
          title: 'Enlace inválido',
          description: resolvedAction.reason,
        });
        return;
      }

      try {
        if (resolvedAction.kind === 'legacy-verify') {
          const result = await verifyAuthToken(resolvedAction.token);

          if (isCancelled) return;

          setPageState({
            kind: result.success ? 'success' : 'error',
            title: result.success ? 'Cuenta verificada' : 'No se pudo verificar la cuenta',
            description: result.message,
          });
          return;
        }

        const prepared = await prepareAuthAction(resolvedAction);

        if (isCancelled) return;

        if (prepared.mode === 'resetPassword') {
          setPageState({ kind: 'ready', action: prepared });
          return;
        }

        await applyPreparedAuthAction(resolvedAction);

        if (isCancelled) return;

        const copy = successCopy[prepared.mode];
        setPageState({
          kind: 'success',
          title: copy.title,
          description: copy.getDescription(prepared.email),
        });
      } catch (error) {
        if (isCancelled) return;

        const message = error instanceof Error
          ? error.message
          : 'No se pudo procesar el enlace. Solicitá uno nuevo e intentá otra vez.';

        setPageState({
          kind: 'error',
          title: 'No se pudo procesar la solicitud',
          description: message,
        });
      }
    };

    void run();

    return () => {
      isCancelled = true;
    };
  }, [resolvedAction]);

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pageState.kind !== 'ready' || pageState.action.mode !== 'resetPassword' || resolvedAction.kind !== 'firebase') {
      return;
    }

    if (newPassword.trim().length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    try {
      await resetPassword(resolvedAction.code, newPassword);

      toast({
        title: 'Contraseña actualizada',
        description: 'Ya podés iniciar sesión con tu nueva contraseña.',
      });

      setPageState({
        kind: 'success',
        title: 'Contraseña actualizada',
        description: 'Tu contraseña se actualizó correctamente. Ya podés volver a iniciar sesión.',
      });
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudo actualizar la contraseña. Solicitá un nuevo enlace e intentá otra vez.';

      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <MetaTags
        title="Acciones de cuenta | TuWeb.ai"
        description="Gestioná la verificación de correo y el restablecimiento de contraseña de tu cuenta TuWeb.ai."
      />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.55)] backdrop-blur xl:p-8">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Seguridad de cuenta
            </span>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Acción segura de TuWeb.ai
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Este enlace procesa acciones sensibles de autenticación desde una página propia de TuWeb.ai. No
              dependemos de la interfaz genérica de Firebase para la experiencia final del usuario.
            </p>

            <div className="mt-8">
              {pageState.kind === 'loading' && (
                <AuthActionStatus
                  title="Procesando enlace"
                  description="Estamos validando la solicitud y preparando el flujo correcto para tu cuenta."
                  tone="info"
                />
              )}

              {pageState.kind === 'error' && (
                <AuthActionStatus
                  title={pageState.title}
                  description={pageState.description}
                  tone="error"
                  ctaLabel="Volver al inicio"
                  onCtaClick={() => navigate('/')}
                />
              )}

              {pageState.kind === 'success' && (
                <AuthActionStatus
                  title={pageState.title}
                  description={pageState.description}
                  tone="success"
                  ctaLabel="Ir al inicio"
                  onCtaClick={() => navigate('/')}
                />
              )}

              {pageState.kind === 'ready' && pageState.action.mode === 'resetPassword' && (
                <AuthResetPasswordForm
                  email={pageState.action.email}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  error={formError}
                  isSubmitting={isSubmitting}
                  onNewPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onSubmit={handleResetPassword}
                />
              )}
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.45)] backdrop-blur xl:p-8">
            <h2 className="text-lg font-semibold text-white">Qué queda listo con este flujo</h2>

            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Los correos de Firebase pueden apuntar a <span className="font-medium text-white">tu dominio</span> y a
                una página controlada por TuWeb.ai.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                El restablecimiento de contraseña se procesa con el <span className="font-medium text-white">oobCode</span>{' '}
                real de Firebase, pero dentro de tu UI.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                La verificación de correo y la recuperación de email dejan de depender de la pantalla genérica de
                <span className="font-medium text-white"> firebaseapp.com</span>.
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-4 text-sm text-violet-100">
              URL final para Firebase:
              <div className="mt-2 break-all font-mono text-xs text-white sm:text-sm">
                https://tuweb-ai.com/auth/action
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
