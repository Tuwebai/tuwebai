import { Link } from 'react-router-dom';

import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/crear-tienda-online-argentina`;

const sellingBlocks = [
  {
    title: 'Catálogo claro',
    description: 'Productos bien ordenados, fotos correctas y una estructura que ayude a elegir sin marear.',
  },
  {
    title: 'Checkout simple',
    description: 'Menos fricción para comprar, pagar o dejar una consulta si el ticket necesita más contexto.',
  },
  {
    title: 'Operación real',
    description: 'Stock, medios de pago, logística y seguimiento pensados para el día a día del negocio.',
  },
  {
    title: 'Base para crecer',
    description: 'Una tienda que hoy venda y mañana pueda sumar campañas, automatizaciones o integraciones.',
  },
];

const commonMistakes = [
  'Elegir plataforma solo por precio y descubrir después que queda corta.',
  'Cargar productos sin criterio y obligar al cliente a adivinar qué comprar.',
  'Tener una tienda linda pero lenta, confusa o incómoda en mobile.',
  'No definir quién va a gestionar stock, consultas y actualizaciones.',
];

const decisionPaths = [
  {
    title: 'Tienda simple para validar',
    description: 'Sirve cuando necesitás empezar rápido con pocos productos y una operación chica.',
  },
  {
    title: 'E-commerce para vender en serio',
    description: 'Hace falta cuando la tienda tiene que ordenar ventas, campañas, pagos y seguimiento real.',
  },
  {
    title: 'Solución a medida',
    description: 'Conviene cuando ya hay reglas propias, integraciones o una operación que no entra en una plantilla.',
  },
];

export default function EcommerceArgentinaPillarPage() {
  return (
    <>
      <MetaTags
        title="Crear tienda online en Argentina"
        description="Qué tener en cuenta para crear una tienda online en Argentina, vender mejor y evitar errores típicos de una PyME al salir al e-commerce."
        keywords="crear tienda online argentina, cómo vender online en argentina, ecommerce pyme argentina, tienda online argentina"
        url={PAGE_URL}
        ogType="article"
        ogImage="/logo-tuwebai.webp"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Desarrollo de tienda online en Argentina',
          description:
            'Guía y servicio de TuWebAI para crear tiendas online en Argentina con foco en operación, conversión y crecimiento.',
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
              Guía e-commerce
            </p>
            <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
              Crear tienda online en Argentina
              <br />
              <span className="gradient-text">sin improvisar una vidriera que no vende.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Vender online no es subir productos y esperar. Para una PyME, una tienda funciona cuando ordena catálogo,
              cobro, confianza y seguimiento sin complicarte más la operación.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            El problema no es “tener tienda”
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            El problema es si la tienda ayuda a vender o te suma trabajo manual, consultas perdidas y abandono antes de pagar.
            Una buena base de e-commerce tiene que servirle al cliente y también a tu equipo.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              Qué tiene que resolver una tienda online
            </h2>
            <div className="mt-8 grid gap-4">
              {sellingBlocks.map((block) => (
                <article key={block.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{block.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{block.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Atajo útil
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">
              ¿Querés saber si tu caso ya pide e-commerce?
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Revisamos catálogo, medios de pago, experiencia mobile y qué tan lista está tu operación para vender online.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
                Pedir diagnóstico e-commerce
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
              Errores comunes
            </p>
            <ul className="mt-6 space-y-4">
              {commonMistakes.map((mistake) => (
                <li key={mistake} className="text-base leading-7 text-gray-300">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Qué camino elegir
            </p>
            <div className="mt-6 grid gap-4">
              {decisionPaths.map((path) => (
                <article key={path.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{path.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{path.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            La pregunta correcta no es “qué plataforma usar”
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            La pregunta correcta es qué necesita tu negocio para vender online sin romper la operación. Cuando eso está claro,
            elegir plataforma, alcance y presupuesto deja de ser intuición y pasa a ser decisión.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnostico-gratuito" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]">
              Pedir diagnóstico e-commerce
            </Link>
            <Link to="/comparar-opciones-web" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
              Comparar opciones web
            </Link>
            <Link to="/cuanto-cuesta-una-web" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200">
              Ver guía de precio
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
