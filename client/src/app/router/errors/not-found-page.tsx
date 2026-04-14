import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Compass, FileCheck2, Home, MessageCircle } from 'lucide-react';

import MetaTags from '@/shared/ui/meta-tags';

const SUGGESTED_LINKS = [
  {
    title: 'Volver al inicio',
    description: 'Retomá desde la home y entrá al recorrido principal del sitio.',
    href: '/',
    icon: Home,
  },
  {
    title: 'Diagnóstico gratuito',
    description: 'Si venías buscando ayuda concreta, esta es la entrada correcta.',
    href: '/diagnostico-gratuito',
    icon: MessageCircle,
  },
  {
    title: 'Checklist web gratuito',
    description: 'Usá el recurso de 35 puntos para auditar tu sitio por tu cuenta.',
    href: '/checklist-web-gratis',
    icon: FileCheck2,
  },
  {
    title: 'Blog',
    description: 'Entrá a los contenidos y recursos reales para negocios argentinos.',
    href: '/blog',
    icon: Compass,
  },
] as const;

export default function NotFoundPage() {
  return (
    <>
      <MetaTags
        title="Página no encontrada"
        description="La página que buscás no está disponible. Volvé al inicio o seguí por una de las rutas principales de TuWebAI."
        robots="noindex,follow"
      />

      <main className="min-h-screen bg-[var(--bg-base)] bg-[image:var(--gradient-page-shell)] px-4 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-6xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:items-start">
            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-5 py-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-6 md:rounded-[32px] md:px-10 md:py-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                  Error 404
                </span>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gray-300">
                  Ruta no encontrada
                </span>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <span className="font-rajdhani text-7xl font-bold leading-none text-white/15 sm:text-8xl">404</span>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00CCFF]/20 bg-[#00CCFF]/10 text-[#9BE7FF] shadow-[0_0_40px_rgba(0,204,255,0.12)]">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>

              <h1 className="mt-8 max-w-4xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
                Esta URL no coincide con ninguna página activa.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
                La ruta que abriste no existe, cambió o vino desde un enlace roto. Te devolvemos al recorrido real de
                TuWebAI.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,204,255,0.2)] transition hover:opacity-95"
                >
                  <Home className="h-4 w-4" />
                  Volver al inicio
                </Link>

                <Link
                  to="/diagnostico-gratuito"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Ir al diagnóstico gratuito
                </Link>
              </div>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a la página anterior
              </button>
            </section>

            <aside className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.1),transparent_42%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.08),transparent_34%),linear-gradient(180deg,rgba(20,26,42,0.98),rgba(12,18,31,0.92))] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)] sm:p-8 md:rounded-[32px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                  Rutas recomendadas
                </span>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-gray-300">
                  4 accesos útiles
                </span>
              </div>

              <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">Seguí por una ruta real.</h2>

              <div className="mt-6 space-y-4">
                {SUGGESTED_LINKS.map(({ title, description, href, icon: Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    className="group block rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:border-[#00CCFF]/35 hover:bg-white/8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00CCFF]/10 text-[#9BE7FF]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-rajdhani text-xl font-bold text-white transition group-hover:text-[#9BE7FF]">
                          {title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-gray-300">{description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
