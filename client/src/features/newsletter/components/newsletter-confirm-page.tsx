import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  confirmNewsletterSubscription,
  getNewsletterErrorMessage,
} from '@/features/newsletter/services/newsletter.service';
import MetaTags from '@/shared/ui/meta-tags';

type ConfirmationState = 'loading' | 'success' | 'error';

export default function NewsletterConfirmPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<ConfirmationState>('loading');
  const [message, setMessage] = useState('Estamos validando tu enlace de newsletter.');
  const [unsubscribeToken, setUnsubscribeToken] = useState<string | null>(null);

  useEffect(() => {
    const runConfirmation = async () => {
      if (!token) {
        setState('error');
        setMessage('El enlace de confirmación no es válido.');
        return;
      }

      try {
        const response = await confirmNewsletterSubscription(token);
        setState(response.success ? 'success' : 'error');
        setMessage(response.message);
        setUnsubscribeToken(response.unsubscribeToken || null);
      } catch (error: unknown) {
        setState('error');
        setMessage(
          getNewsletterErrorMessage(
            error,
            'No pudimos confirmar tu suscripción en este momento. Intenta nuevamente desde el enlace del correo.',
          ),
        );
      }
    };

    void runConfirmation();
  }, [token]);

  const panelClassName =
    state === 'success'
      ? 'border-[var(--signal-border)] bg-[var(--bg-overlay)]'
      : state === 'error'
        ? 'border-red-500/35 bg-[var(--bg-overlay)]'
        : 'border-[var(--border-default)] bg-[var(--bg-overlay)]';

  return (
    <main className="page-shell-surface min-h-screen px-6 py-16 text-white">
      <MetaTags
        title="Confirmación de newsletter"
        description="Confirmá tu suscripción al newsletter de TuWeb.ai."
        robots="noindex,follow"
      />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl items-center justify-center">
        <section
          className={`w-full rounded-[32px] border p-8 shadow-[var(--shadow-modal)] md:p-12 ${panelClassName}`}
        >
          <div className="mb-6 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--signal)]">
            Newsletter TuWeb.ai
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            {state === 'success' ? 'Suscripción confirmada' : state === 'error' ? 'No pudimos confirmar el email' : 'Confirmando suscripción'}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-primary)] md:text-lg">
            {message}
          </p>

          {state === 'loading' ? (
            <div className="mt-10 flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="h-3 w-3 animate-pulse rounded-full bg-[var(--signal)]" />
              Validando enlace y actualizando tu estado de suscripción.
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Volver al inicio
              </Link>
              <Link
                to="/blog/"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-default)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--signal-border)] hover:text-white"
              >
                Ver contenido del blog
              </Link>
              {state === 'success' && unsubscribeToken ? (
                <Link
                  to={`/newsletter/unsubscribe/${encodeURIComponent(unsubscribeToken)}`}
                  className="inline-flex items-center justify-center rounded-full border border-red-500/30 px-6 py-3 text-sm font-semibold text-[#FFCDD5] transition-colors duration-200 hover:border-red-400/50 hover:text-white"
                >
                  Darme de baja
                </Link>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
