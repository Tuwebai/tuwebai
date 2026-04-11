import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Compass, FileCheck2, Home, MessageCircle } from 'lucide-react';

import AnimatedShape from '@/shared/ui/animated-shape';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
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

      <main className="page-shell-surface relative min-h-screen overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
        <AnimatedShape type={1} className="left-[-180px] top-16" delay={0.2} />
        <AnimatedShape type={2} className="right-[-140px] top-[28%]" delay={0.35} />

        <div className="relative mx-auto flex min-h-[calc(100vh-10rem)] max-w-6xl items-center">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,420px)] lg:items-center">
            <section className="max-w-3xl">
              <Badge className="mb-6 border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-[#9BE7FF]">
                Error 404 · Ruta no encontrada
              </Badge>

              <div className="mb-6 flex items-center gap-4">
                <span className="font-rajdhani text-7xl font-bold leading-none text-white/15 sm:text-8xl">
                  404
                </span>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#00CCFF]/20 bg-[#00CCFF]/10 text-[#9BE7FF] shadow-[0_0_40px_rgba(0,204,255,0.12)]">
                  <AlertTriangle className="h-8 w-8" />
                </div>
              </div>

              <h1 className="max-w-2xl font-rajdhani text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
                Esta URL no coincide con
                <br />
                ninguna página activa.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-xl sm:leading-8">
                La ruta que abriste no existe, cambió o vino desde un enlace roto. En vez de dejarte
                en una pantalla genérica, te devolvemos al recorrido real de TuWebAI.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="min-h-12 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,204,255,0.2)] transition hover:opacity-95"
                >
                  <Link to="/">
                    <Home className="h-4 w-4" />
                    Volver al inicio
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-12 rounded-full border-white/15 bg-white/5 px-7 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to="/diagnostico-gratuito">
                    <MessageCircle className="h-4 w-4" />
                    Ir al diagnóstico gratuito
                  </Link>
                </Button>
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

            <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(19,19,28,0.92)_0%,rgba(11,11,17,0.96)_100%)] text-white shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
              <CardContent className="p-6 sm:p-8">
                <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">
                  Rutas recomendadas
                </p>
                <div className="space-y-4">
                  {SUGGESTED_LINKS.map(({ title, description, href, icon: Icon }) => (
                    <Link
                      key={href}
                      to={href}
                      className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 p-4 transition hover:border-[#00CCFF]/35 hover:bg-white/8"
                    >
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00CCFF]/10 text-[#9BE7FF]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-rajdhani text-xl font-bold text-white transition group-hover:text-[#9BE7FF]">
                          {title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-gray-300">{description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
