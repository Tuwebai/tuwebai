import { Link } from 'react-router-dom';

import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/como-elegir-agencia-web-argentina`;

const questions = [
  '¿Entienden tu negocio o solo te hablan de diseño?',
  '¿Te explican qué van a medir para saber si la web funciona?',
  '¿Te dejan claro qué incluye, qué no incluye y cómo se define el alcance?',
  '¿La propuesta está pensada para mobile, conversión y seguimiento real?',
  '¿Vas a hablar con quien construye o con alguien que solo vende?',
];

const redFlags = [
  'Prometen resultados sin revisar tu caso.',
  'Te venden una web “rápida y barata” sin hablar de objetivos.',
  'No nombran performance, analytics o CTA en ningún momento.',
  'Todo depende de templates, plugins o herramientas genéricas sin criterio.',
  'No hay proceso claro después de la entrega.',
];

const greenFlags = [
  'Hacen preguntas de negocio antes de cotizar.',
  'Te muestran cómo piensan estructura, mensaje y conversión.',
  'Ponen por escrito alcance, tiempos y prioridades.',
  'Te dicen cuándo una solución simple alcanza y cuándo no.',
  'Tienen una forma concreta de medir si el proyecto está funcionando.',
];

export default function HowToChooseWebAgencyPage() {
  return (
    <>
      <MetaTags
        title="Cómo elegir una agencia web en Argentina"
        description="Qué mirar antes de contratar una agencia web en Argentina: proceso, red flags, preguntas clave y cómo comparar opciones con criterio."
        keywords="como elegir agencia web argentina, agencia desarrollo web argentina, contratar agencia web, comparar agencias web"
        url={PAGE_URL}
        ogType="article"
        ogImage="/logo-tuwebai.webp"
      />

      <main className="page-shell-surface min-h-screen px-4 pb-20 pt-28 text-white sm:pt-32">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,158,245,0.16),transparent_45%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(11,15,30,0.98)_100%)] px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
              Guía de evaluación
            </p>
            <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
              Cómo elegir una agencia web en Argentina
              <br />
              <span className="gradient-text">sin comprar humo ni pagar dos veces.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              La mayoría no se equivoca por elegir la opción más cara o la más barata. Se equivoca por elegir sin un criterio claro para comparar.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            La primera señal no es el portfolio
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            La primera señal es cómo piensan. Si una agencia te muestra pantallas lindas pero no te puede explicar cómo esa web va a captar consultas,
            ordenar el mensaje o medirse después, el riesgo no está en el diseño: está en la falta de criterio.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[32px] border border-red-400/15 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              Red flags
            </p>
            <ul className="mt-6 space-y-4">
              {redFlags.map((item) => (
                <li key={item} className="text-base leading-7 text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-emerald-400/15 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Green flags
            </p>
            <ul className="mt-6 space-y-4">
              {greenFlags.map((item) => (
                <li key={item} className="text-base leading-7 text-gray-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            Cinco preguntas que deberías hacer antes de contratar
          </h2>
          <div className="mt-8 grid gap-4">
            {questions.map((question, index) => (
              <article key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--signal)]">
                  Pregunta {index + 1}
                </p>
                <p className="mt-3 text-base leading-7 text-gray-300">{question}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              Cómo comparar con criterio
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              No compares solo por precio. Compará por claridad, por proceso, por soporte y por si la solución está pensada para tu negocio o para la comodidad del proveedor.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/comparar-opciones-web" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
                Comparar opciones web
              </Link>
              <Link to="/cuanto-cuesta-una-web" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
                Ver guía de precio
              </Link>
              <Link to="/crear-tienda-online-argentina" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
                Guía para tienda online
              </Link>
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Si querés atajo
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">
              Te damos una segunda mirada
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Si ya estás evaluando opciones, revisamos tu caso y te decimos qué camino tiene más sentido antes de que cierres mal.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
                Pedir diagnóstico
              </Link>
              <Link to="/consulta" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
                Contar mi proyecto
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
