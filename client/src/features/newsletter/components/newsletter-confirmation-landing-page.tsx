import { Link } from 'react-router-dom';

import MetaTags from '@/shared/ui/meta-tags';

export default function NewsletterConfirmationLandingPage() {
  return (
    <main className="min-h-screen bg-[#060913] px-6 py-16 text-white">
      <MetaTags
        title="Suscripción confirmada"
        description="Gracias por confirmar tu suscripción al newsletter de TuWeb.ai."
        robots="noindex,follow"
      />

      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-[#00CCFF]/35 bg-[#0C1425]/92 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-12">
          <div className="mb-6 inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8BE8FF]">
            Newsletter TuWeb.ai
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Ya estás suscripto
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#C9D7F2] md:text-lg">
            Gracias por confirmar tu suscripción al newsletter de TuWeb.ai. Próximamente vas a recibir contenido sobre
            desarrollo web, conversión y marketing digital.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Volver al inicio
            </Link>
            <Link
              to="/blog/"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
            >
              Ver el blog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
