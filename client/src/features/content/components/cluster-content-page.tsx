import { Link } from 'react-router-dom';

import type { ClusterPageConfig } from '@/features/content/cluster-content-page.types';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

interface ClusterContentPageProps {
  config: ClusterPageConfig;
}

export default function ClusterContentPage({ config }: ClusterContentPageProps) {
  const pageUrl = `${TUWEBAI_SITE_FULL_URL}/${config.slug}`;

  return (
    <>
      <MetaTags
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        url={pageUrl}
        ogType="article"
        ogImage="/logo-tuwebai.png"
      />

      <main className="page-shell-surface min-h-screen px-4 pb-20 pt-28 text-white sm:pt-32">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,158,245,0.16),transparent_45%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(11,15,30,0.98)_100%)] px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
              {config.eyebrow}
            </p>
            <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
              {config.heroTitle}
              <br />
              <span className="gradient-text">{config.heroHighlight}</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              {config.heroBody}
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            {config.introTitle}
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            {config.introBody}
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              {config.primaryTitle}
            </h2>
            <div className="mt-8 grid gap-4">
              {config.primaryItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Atajo útil
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">
              {config.asideTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              {config.asideBody}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
                {config.asidePrimaryCta}
              </Link>
              <Link to="/consulta" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
                Contar mi proyecto
              </Link>
            </div>
          </aside>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              Problemas frecuentes
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              {config.issuesTitle}
            </h2>
            <ul className="mt-6 space-y-4">
              {config.issuesItems.map((item) => (
                <li key={item} className="text-base leading-7 text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Qué hacer ahora
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              {config.nextStepsTitle}
            </h2>
            <div className="mt-6 grid gap-4">
              {config.nextSteps.map((step) => (
                <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            {config.closingTitle}
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            {config.closingBody}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
              Pedir diagnóstico
            </Link>
            <Link to="/cuanto-cuesta-una-web" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
              Ver guía de precio
            </Link>
            <Link to="/como-elegir-agencia-web-argentina" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
              Cómo elegir agencia web
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
