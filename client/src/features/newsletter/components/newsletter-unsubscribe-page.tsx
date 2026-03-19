import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  getNewsletterErrorMessage,
  unsubscribeNewsletterSubscription,
} from '@/features/newsletter/services/newsletter.service';
import MetaTags from '@/shared/ui/meta-tags';

type UnsubscribeState = 'loading' | 'success' | 'error';

export default function NewsletterUnsubscribePage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<UnsubscribeState>('loading');
  const [message, setMessage] = useState('Estamos procesando tu solicitud de baja.');

  useEffect(() => {
    const runUnsubscribe = async () => {
      if (!token) {
        setState('error');
        setMessage('El enlace de baja no es valido.');
        return;
      }

      try {
        const response = await unsubscribeNewsletterSubscription(token);
        setState(response.success ? 'success' : 'error');
        setMessage(response.message);
      } catch (error: unknown) {
        setState('error');
        setMessage(
          getNewsletterErrorMessage(
            error,
            'No pudimos procesar la baja en este momento. Intenta nuevamente desde el enlace del correo.',
          ),
        );
      }
    };

    void runUnsubscribe();
  }, [token]);

  const panelClassName =
    state === 'success'
      ? 'border-red-500/30 bg-[#170C16]/92'
      : state === 'error'
        ? 'border-white/12 bg-[#151827]/92'
        : 'border-white/10 bg-[#0D1220]/92';

  return (
    <main className="min-h-screen bg-[#060913] px-6 py-16 text-white">
      <MetaTags
        title="Baja de newsletter | TuWeb.ai"
        description="Gestiona la baja del newsletter de TuWeb.ai."
        robots="noindex,follow"
      />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl items-center justify-center">
        <section
          className={`w-full rounded-[32px] border p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-12 ${panelClassName}`}
        >
          <div className="mb-6 inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB7C2]">
            Preferencias newsletter
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            {state === 'success' ? 'Suscripcion dada de baja' : state === 'error' ? 'No pudimos procesar la baja' : 'Procesando baja'}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#C9D7F2] md:text-lg">
            {message}
          </p>

          {state === 'loading' ? (
            <div className="mt-10 flex items-center gap-4 text-sm text-[#8EA8D6]">
              <span className="h-3 w-3 animate-pulse rounded-full bg-red-400" />
              Validando enlace y actualizando tus preferencias.
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Volver al inicio
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
              >
                Seguir leyendo el blog
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
