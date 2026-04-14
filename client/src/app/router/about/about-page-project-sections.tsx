import { Link } from 'react-router-dom';

import RevealBlock from '@/shared/ui/reveal-block';

import { FEATURED_PROJECTS } from './about-page.content';
import { AboutAccentPill, heroSurfaceClassName, surfaceClassName } from './about-page.primitives';

export function AboutProjectsSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <RevealBlock className="text-center">
        <div className="flex justify-center">
          <AboutAccentPill>Lo que construimos</AboutAccentPill>
        </div>
        <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Proyectos reales. Problemas reales resueltos.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
          Algunos propios, uno de cliente. Todos con c?digo a medida y l?gica de negocio pensada desde cero.
        </p>
      </RevealBlock>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {FEATURED_PROJECTS.map((project, index) => (
          <RevealBlock key={project.title} delayMs={index * 90}>
            <article className={`${surfaceClassName} overflow-hidden`}>
              <div className="relative h-52 overflow-hidden">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-200">
                    {project.category}
                  </span>
                  {project.badge ? (
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-200">
                      {project.badge}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-rajdhani text-2xl font-bold text-white">{project.title}</h3>
                <p className="mt-4 text-base leading-7 text-gray-300">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gray-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-cyan-300 transition-colors hover:text-white"
                  >
                    Ver proyecto
                    <span className="ml-2">?</span>
                  </a>
                </div>
              </div>
            </article>
          </RevealBlock>
        ))}
      </div>

      <RevealBlock className="mt-10 text-center" delayMs={200}>
        <a
          href="/?section=showroom"
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
        >
          Ver todos los proyectos ?
        </a>
      </RevealBlock>
    </section>
  );
}

export function AboutCtaSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <RevealBlock>
        <div className={`${heroSurfaceClassName} px-6 py-10 text-center sm:px-10 sm:py-14`}>
          <h2 className="mx-auto max-w-3xl font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Si esto resuena con lo que necesita tu negocio, hablemos.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            La primera conversaci?n es siempre sin cargo. Te decimos si podemos ayudarte y c?mo.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to="/diagnostico-gratuito"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(0,204,255,0.18)] transition-transform duration-200 hover:scale-[1.02]"
            >
              Ped? tu diagn?stico gratuito ?
            </Link>
            <Link
              to="/?section=showroom"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-200 transition-colors duration-200 hover:border-cyan-300/40 hover:text-white"
            >
              Ver proyectos reales
            </Link>
          </div>
        </div>
      </RevealBlock>
    </section>
  );
}
