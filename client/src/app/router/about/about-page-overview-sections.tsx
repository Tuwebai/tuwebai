import { Code2, ShieldCheck, TrendingUp } from 'lucide-react';

import RevealBlock from '@/shared/ui/reveal-block';
import {
  TUWEBAI_GITHUB_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_LOCATION,
} from '@/shared/constants/contact';

import { CONTEXT_STATS, PRINCIPLES, STACK_CHIPS, STORY_PARAGRAPHS } from './about-page.content';
import { AboutAccentPill, AboutMutedPill, heroSurfaceClassName, surfaceClassName } from './about-page.primitives';

const principleIcons = [ShieldCheck, Code2, TrendingUp] as const;

export function AboutHeroSection() {
  return (
    <section className="mx-auto max-w-6xl">
      <RevealBlock>
        <div className={`${heroSurfaceClassName} px-5 py-10 sm:px-6 md:px-10 md:py-12`}>
          <div className="flex flex-wrap items-center gap-3">
            <AboutAccentPill>Quiénes somos</AboutAccentPill>
            <AboutMutedPill>{TUWEBAI_LOCATION}</AboutMutedPill>
          </div>

          <h1 className="mt-6 max-w-4xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
            No somos una agencia más. Construimos webs que trabajan de verdad.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
            TuWebAI nació en {TUWEBAI_LOCATION}, con una convicción simple: la mayoría de los negocios argentinos merece una presencia digital que venda, no que solo exista.
          </p>
        </div>
      </RevealBlock>
    </section>
  );
}

export function AboutStatsSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="grid gap-6 md:grid-cols-3">
        {CONTEXT_STATS.map((stat, index) => (
          <RevealBlock key={stat.label} delayMs={index * 90}>
            <article className={`${surfaceClassName} px-6 py-8 text-center`}>
              <p className="font-rajdhani text-5xl font-bold text-white sm:text-6xl">{stat.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-gray-400">{stat.label}</p>
            </article>
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}

export function AboutStorySection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <RevealBlock>
        <div className={`${surfaceClassName} px-6 py-10 sm:px-8 md:px-10`}>
          <div className="flex flex-wrap items-center gap-3">
            <AboutAccentPill>Cómo empezamos</AboutAccentPill>
          </div>

          <div className="mt-6 space-y-6 text-base leading-8 text-gray-300 sm:text-lg">
            {STORY_PARAGRAPHS.map((paragraph, index) => (
              <RevealBlock key={paragraph} delayMs={index * 90}>
                <p>{paragraph}</p>
              </RevealBlock>
            ))}
          </div>
        </div>
      </RevealBlock>
    </section>
  );
}

export function AboutPrinciplesSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <RevealBlock className="text-center">
        <div className="flex justify-center">
          <AboutAccentPill>Cómo pensamos</AboutAccentPill>
        </div>
        <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Tres principios que no negociamos.
        </h2>
      </RevealBlock>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PRINCIPLES.map((principle, index) => {
          const Icon = principleIcons[index];

          return (
            <RevealBlock key={principle.title} delayMs={index * 90}>
              <article className={`${surfaceClassName} h-full px-6 py-8`}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white">{principle.title}</h3>
                <p className="mt-4 text-base leading-7 text-gray-300">{principle.description}</p>
              </article>
            </RevealBlock>
          );
        })}
      </div>
    </section>
  );
}

export function AboutTeamSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <RevealBlock className="text-center">
        <div className="flex justify-center">
          <AboutAccentPill>El equipo</AboutAccentPill>
        </div>
        <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Una persona. Todo el stack.
        </h2>
      </RevealBlock>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
        <RevealBlock delayMs={80}>
          <div className={`${surfaceClassName} space-y-6 px-6 py-8 text-base leading-8 text-gray-300 sm:text-lg`}>
            <p>
              TuWebAI es Juan Esteban López, Juanchi para los que nos conocen. Desarrollador fullstack y desarrollador web Córdoba desde Río Tercero, Córdoba.
            </p>
            <p>
              Diseño, frontend, backend, bases de datos y deploys. Juan Esteban López lleva TuWebAI de punta a punta: un solo interlocutor desde el primer wireframe hasta el lanzamiento. Sin capas de intermediarios, sin ¿te consulto con el equipo técnico?.
            </p>
            <p>
              Cuando hablás con TuWebAI, hablás directamente con Juanchi, la persona que va a construir tu proyecto. Así trabajamos desarrollo web Argentina sin vendedores en el medio.
            </p>
          </div>
        </RevealBlock>

        <RevealBlock delayMs={150}>
          <aside className={`${surfaceClassName} px-6 py-8`}>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
                <img
                  src="/image_perfil.webp"
                  alt="Foto de perfil de Juan Esteban López"
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-rajdhani text-2xl font-bold text-white">Juan Esteban López</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-gray-400">
                  Fundador &amp; Desarrollador Fullstack
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {STACK_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-gray-300"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <a
                href={TUWEBAI_LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 font-medium text-cyan-300 transition-colors hover:border-cyan-300/50 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href={TUWEBAI_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-gray-300 transition-colors hover:border-white/20 hover:text-white"
              >
                GitHub
              </a>
            </div>
          </aside>
        </RevealBlock>
      </div>
    </section>
  );
}
