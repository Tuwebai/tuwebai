import { Link } from 'react-router-dom';

import MetaTags from '@/shared/ui/meta-tags';

export default function NewsletterConfirmationLandingPage() {
  return (
    <main className="page-shell-surface min-h-screen px-6 py-16 text-white">
      <MetaTags
        title="Suscripción confirmada"
        description="Gracias por confirmar tu suscripción al newsletter de TuWeb.ai."
        robots="noindex,follow"
      />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-[var(--signal-border)] bg-[var(--bg-overlay)] p-8 shadow-[var(--shadow-modal)] md:p-12">
          <div className="mb-6 inline-flex rounded-full border border-[var(--signal-border)] bg-[var(--signal-glow)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--signal)]">
            Newsletter TuWeb.ai
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Ya estás suscripto
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-primary)] md:text-lg">
            Gracias por confirmar tu suscripción al newsletter de TuWeb.ai. Próximamente vas a recibir contenido sobre
            desarrollo web, conversión y marketing digital.
          </p>

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
              Ver el blog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
