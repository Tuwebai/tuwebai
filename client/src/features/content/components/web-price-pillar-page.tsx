import { Link } from 'react-router-dom';

import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/cuanto-cuesta-una-web`;

const priceFactors = [
  {
    title: 'Tipo de proyecto',
    description:
      'No cuesta lo mismo un sitio corporativo simple que un e-commerce o un sistema con lógica a medida.',
  },
  {
    title: 'Cantidad de páginas',
    description:
      'Más secciones suele implicar más contenido, más diseño, más estructura y más revisión.',
  },
  {
    title: 'Funcionalidades',
    description:
      'Reservas, pagos, integraciones, áreas privadas o automatizaciones cambian bastante el alcance.',
  },
  {
    title: 'Nivel de personalización',
    description:
      'No es igual adaptar algo estándar que construir una experiencia alineada a tu negocio y a cómo vendés.',
  },
];

const priceBands = [
  {
    title: 'Web corporativa',
    range: 'USD 900 a USD 1.500',
    description:
      'Para negocios que necesitan una presencia clara, profesional y lista para captar consultas.',
  },
  {
    title: 'E-commerce',
    range: 'USD 1.600 a USD 2.800',
    description:
      'Para vender online con catálogo, estructura comercial y una experiencia más pensada para conversión.',
  },
  {
    title: 'Web con reservas o turnos',
    range: 'USD 1.800 a USD 3.000',
    description:
      'Para negocios donde la operación depende de agenda, disponibilidad y fricción baja al momento de pedir.',
  },
  {
    title: 'Sistema web a medida',
    range: 'Desde USD 2.600',
    description:
      'Para casos donde ya no alcanza una web básica y hay procesos, accesos o flujos de negocio propios.',
  },
];

export default function WebPricePillarPage() {
  return (
    <>
      <MetaTags
        title="Cuánto cuesta una web en Argentina"
        description="Guía clara sobre cuánto cuesta una web en Argentina según tipo de proyecto, alcance y funcionalidades. Incluye calculadora y diagnóstico."
        keywords="cuánto cuesta una web argentina, precio página web argentina, costo sitio web pyme, desarrollo web precio"
        url={PAGE_URL}
        ogType="article"
        ogImage="/logo-tuwebai.png"
      />

      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-20 pt-28 text-white sm:pt-32">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,158,245,0.16),transparent_45%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(11,15,30,0.98)_100%)] px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
              Guía de precio
            </p>
            <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
              Cuánto cuesta una web en Argentina
              <br />
              <span className="gradient-text">y qué hace subir o bajar ese número.</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              La respuesta corta es: depende. Pero no depende de una manera misteriosa. Depende
              del tipo de proyecto, del alcance y de cuánto tiene que trabajar la web para tu
              negocio.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-lg leading-8 text-gray-200">
              Si querés una referencia rápida, hoy una web puede ir desde una franja accesible para
              una presencia simple hasta un rango bastante más alto cuando necesitás lógica,
              conversión, integraciones o procesos a medida. El error más común es mirar solo el
              precio inicial y no mirar si esa web te queda corta en tres meses.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1.05fr)_360px]">
          <div className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
              Qué define el precio real de una web
            </h2>
            <div className="mt-8 grid gap-4">
              {priceFactors.map((factor) => (
                <article
                  key={factor.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{factor.title}</h3>
                  <p className="mt-3 text-base leading-7 text-gray-300">{factor.description}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--signal)]">
              Atajo útil
            </p>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white">
              ¿Querés un rango para tu caso?
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Usá la calculadora y después, si querés precisión real, pasamos a diagnóstico o
              cotización.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/calculadora-precio-web"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
              >
                Abrir calculadora
              </Link>
              <Link
                to="/diagnostico-gratuito"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200"
              >
                Pedir diagnóstico
              </Link>
            </div>
          </aside>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            Rangos orientativos para no arrancar a ciegas
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {priceBands.map((band) => (
              <article
                key={band.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--signal)]">
                  {band.range}
                </p>
                <h3 className="mt-3 font-rajdhani text-2xl font-bold text-white">{band.title}</h3>
                <p className="mt-3 text-base leading-7 text-gray-300">{band.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-5xl rounded-[32px] border border-white/10 bg-[var(--bg-surface)]/88 p-6 shadow-[var(--shadow-modal)] sm:p-8">
          <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl">
            La pregunta correcta no es “cuánto sale”
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            La pregunta correcta es: qué tiene que hacer la web para que el negocio recupere la
            inversión. Cuando eso está claro, el precio deja de ser humo y pasa a tener contexto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/calculadora-precio-web"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
            >
              Calcular mi rango
            </Link>
            <Link
              to="/como-elegir-agencia-web-argentina"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200"
            >
              Cómo elegir agencia web
            </Link>
            <Link
              to="/consulta"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200"
            >
              Pedir cotización exacta
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
