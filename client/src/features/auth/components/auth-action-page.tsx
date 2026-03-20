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
import type { PreparedAuthAction } from '@/features/auth/types/auth-action';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_EMAIL, TUWEBAI_WHATSAPP_DISPLAY, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import { useToast } from '@/shared/ui/use-toast';

type PageState =
  | { kind: 'loading' }
  | { kind: 'ready'; action: PreparedAuthAction }
  | { kind: 'success'; title: string; description: string }
  | { kind: 'error'; title: string; description: string };

const successCopy: Record<
  Exclude<PreparedAuthAction['mode'], 'resetPassword'>,
  { title: string; getDescription: (email: string | null) => string }
> = {
  verifyEmail: {
    title: 'Correo verificado',
    getDescription: (email) => (
      email
        ? `La dirección ${email} quedó verificada. Ya podés ingresar a TuWeb.ai con normalidad.`
        : 'Tu dirección de correo quedó verificada. Ya podés ingresar a TuWeb.ai con normalidad.'
    ),
  },
  recoverEmail: {
    title: 'Correo restaurado',
    getDescription: (email) => (
      email
        ? `Revertimos el cambio y ${email} volvió a quedar asociado a tu cuenta.`
        : 'Revertimos el cambio de correo de tu cuenta correctamente.'
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
        description: 'Ya podés ingresar con tu nueva contraseña.',
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
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.55)] backdrop-blur xl:p-8">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Cuenta TuWeb.ai
            </span>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Protegé el acceso a tu cuenta
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Estás en una página segura de TuWeb.ai para confirmar cambios importantes de tu cuenta. Seguí el paso
              indicado y después vas a poder continuar normalmente.
            </p>

            <div className="mt-8">
              {pageState.kind === 'loading' && (
                <AuthActionStatus
                  title="Procesando enlace"
                  description="Estamos validando tu solicitud para mostrarte el paso correcto."
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
            <h2 className="text-lg font-semibold text-white">Qué va a pasar ahora</h2>

            <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Vas a completar este cambio sin salir de TuWeb.ai.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Cuando termines, vas a poder volver a ingresar con normalidad.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Si el enlace venció o no funciona, podés pedir uno nuevo desde el panel o desde el login.
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-4">
              <h3 className="text-sm font-semibold text-white">Necesitás ayuda</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Si tenés problemas con el acceso, escribinos y lo resolvemos desde soporte.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <a
                  href={`mailto:${TUWEBAI_EMAIL}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {TUWEBAI_EMAIL}
                </a>
                <a
                  href={TUWEBAI_WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  WhatsApp {TUWEBAI_WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
