import { Link } from 'react-router-dom';

import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/seo-local-argentina`;

const rankingSignals = [
  {
    title: 'Perfil de Google bien resuelto',
    description: 'Nombre, categoría, horarios, teléfono, fotos y servicios cargados con criterio.',
  },
  {
    title: 'Consistencia de datos',
    description: 'La dirección, el teléfono y el nombre del negocio tienen que coincidir en todos lados.',
  },
  {
    title: 'Reseñas reales',
    description: 'No es solo cantidad: importa la frecuencia, el contenido y que respondas con contexto.',
  },
  {
    title: 'Web que acompaña',
    description: 'Google no mira solo la ficha; también necesita una web clara, local y confiable.',
  },
];

const commonProblems = [
  'La ficha existe, pero nadie la trabaja ni la actualiza.',
  'El negocio aparece mal categorizado o con datos distintos según la plataforma.',
  'Hay visitas en Maps, pero no se convierten en llamados o consultas.',
  'La web no refuerza ubicación, servicios ni confianza local.',
];

const nextActions = [
  {
    title: 'Corregir la base',
    description: 'Ordenar ficha, datos, categorías y señales básicas antes de pensar en escalar.',
  },
  {
    title: 'Medir consultas',
    description: 'No alcanza con “aparecer”: hay que saber si eso trae llamados, WhatsApp o formularios.',
  },
  {
    title: 'Conectar Maps con la web',
    description: 'Cuando la web acompaña, Google entiende mejor el negocio y el usuario confía más.',
  },
];

export default function SeoLocalArgentinaPillarPage() {
  return (
    <>
      <MetaTags
        title="SEO local en Argentina"
        description="Cómo aparecer mejor en Google Maps Argentina y qué necesita un negocio para transformar visibilidad local en consultas reales."
        keywords="seo local argentina, como aparecer en google maps argentina, google maps negocio argentina, posicionamiento local argentina"
        url={PAGE_URL}
        ogType="article"
        ogImage="/logo-tuwebai.webp"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'SEO local en Argentina',
          description:
            'Servicio y guía de TuWebAI para mejorar visibilidad local en Google Maps y convertir búsquedas en consultas reales.',
          url: PAGE_URL,
          provider: {
            '@type': 'LocalBusiness',
            name: 'TuWebAI',
            url: TUWEBAI_SITE_FULL_URL,
          },
          areaServed: 'Argentina',
        }}
      />

      <main className="page-shell-surface min-h-screen px-4 pb-20 pt-28 text-white sm:pt-32">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,158,245,0.16),transparent_45%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(11,15,30,0.98)_100%)] px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
              Guía SEO local
            </p>
            <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
              SEO local en Argentina
              <br />
              <span className="gradient-text">para aparecer en Google Maps y generar consultas.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Aparecer en Maps no depende de suerte. Depende de ordenar señales locales, sostener la ficha de negocio y tener una web que acompañe esa intención.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            El problema no es solo “no aparezco”
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Muchas veces el negocio sí aparece, pero no genera llamados ni visitas útiles. El trabajo real de SEO local es mejorar visibilidad y convertir esa visibilidad en acciones concretas.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              Qué mira Google para posicionarte mejor
            </h2>
            <div className="mt-8 grid gap-4">
              {rankingSignals.map((signal) => (
                <article key={signal.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{signal.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{signal.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Atajo útil
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">
              ¿Querés una auditoría SEO local?
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Revisamos ficha, señales locales y cómo responde tu web para detectar por qué hoy no estás capitalizando Google Maps.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
                Pedir auditoría SEO local
              </Link>
              <Link to="/consulta" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
                Contar mi negocio
              </Link>
            </div>
          </aside>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              Problemas frecuentes
            </p>
            <ul className="mt-6 space-y-4">
              {commonProblems.map((problem) => (
                <li key={problem} className="text-base leading-7 text-gray-300">
                  {problem}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Qué hacer ahora
            </p>
            <div className="mt-6 grid gap-4">
              {nextActions.map((action) => (
                <article key={action.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{action.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{action.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            La ficha sola no alcanza
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Cuando Maps, reseñas y web empujan para el mismo lado, el negocio gana claridad y confianza. Ahí el SEO local deja de ser visibilidad vacía y empieza a traer consultas reales.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
              Pedir auditoría SEO local
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
