import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  trackComparisonCtaClick,
  trackComparisonView,
} from '@/features/marketing-home/services/marketing-home-analytics.service';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

type ComparisonColumn = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  ctaLabel: string;
  rows: Record<string, string>;
};

const PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/comparar-opciones-web`;

const COMPARISON_ROWS = [
  { id: 'precio', label: 'Precio' },
  { id: 'tiempo', label: 'Tiempo' },
  { id: 'flexibilidad', label: 'Flexibilidad' },
  { id: 'soporte', label: 'Soporte' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'propiedad', label: 'Propiedad' },
] as const;

const COMPARISON_COLUMNS: ComparisonColumn[] = [
  {
    id: 'wix-tiendanube',
    title: 'Wix / Tiendanube',
    subtitle: 'Builder o e-commerce SaaS',
    summary:
      'Buena opción si necesitás salir rápido con algo estándar y priorizás autogestión por encima de personalización profunda.',
    ctaLabel: 'Sirve para empezar rápido',
    rows: {
      precio: 'Bajo a medio. Suscripción mensual o anual. Wix publica planes desde US$17.77/mes y Tiendanube AR publica desde AR$24.999/mes al 10 de abril de 2026.',
      tiempo: 'Rápido. Podés publicar en días si el alcance es simple.',
      flexibilidad: 'Media. Ganás velocidad, pero dependés de límites de la plataforma y sus apps.',
      soporte: 'Soporte de plataforma. Suele cubrir uso del producto, no estrategia comercial de tu negocio.',
      resultados: 'Correctos para un MVP o catálogo estándar. Se queda corto cuando necesitás una experiencia pensada para convertir mejor.',
      propiedad: 'Media. Tenés control operativo, pero la base técnica y varias decisiones quedan atadas a la plataforma.',
    },
  },
  {
    id: 'wordpress',
    title: 'WordPress',
    subtitle: 'CMS open source',
    summary:
      'Buena opción si querés más libertad que un builder y aceptás gestionar hosting, plugins, mantenimiento y decisiones técnicas.',
    ctaLabel: 'Sirve si vas a administrar más complejidad',
    rows: {
      precio: 'Variable. El software es open source, pero hosting, dominio, plugins, themes y mantenimiento se pagan aparte.',
      tiempo: 'Medio. Puede salir rápido con themes, pero escala en complejidad cuando hay personalización real.',
      flexibilidad: 'Alta. WordPress.org destaca diseño flexible, bloques y una librería extensa de plugins.',
      soporte: 'Variable. Depende de hosting, proveedor, plugins y quién implementa el sitio.',
      resultados: 'Puede rendir muy bien si está bien resuelto. También puede degradarse rápido si se arma con demasiados plugins o mala base técnica.',
      propiedad: 'Alta si está bien montado. Tenés más control que en un builder, pero también más responsabilidad técnica.',
    },
  },
  {
    id: 'tuwebai-custom',
    title: 'TuWebAI Custom',
    subtitle: 'Web a medida + Pulse',
    summary:
      'La opción correcta si tu sitio tiene que responder a tu negocio, no al template de una plataforma.',
    ctaLabel: 'Sirve cuando querés una web que trabaje',
    rows: {
      precio: 'Medio a alto de entrada, con alcance definido según necesidad real del negocio.',
      tiempo: 'Medio. Requiere discovery y construcción a medida, pero evita rehacer después lo que nació limitado.',
      flexibilidad: 'Máxima. El flujo, el contenido, las integraciones y la conversión se diseñan según tu operación.',
      soporte: 'Directo con TuWebAI. Hay contexto real del proyecto, seguimiento y Pulse como capa de visibilidad.',
      resultados: 'Enfocado en performance, claridad comercial y medición. La prioridad no es decorar: es convertir y entender qué está funcionando.',
      propiedad: 'Alta. El sitio se construye para tu negocio, con decisiones técnicas alineadas a largo plazo.',
    },
  },
];

export default function WebSolutionComparisonPage() {
  useEffect(() => {
    trackComparisonView();
  }, []);

  return (
    <>
      <MetaTags
        title="Comparar opciones web: Wix, WordPress o TuWebAI"
        description="Compará Wix, Tiendanube, WordPress y una web a medida con TuWebAI. Precio, tiempo, flexibilidad, soporte, resultados y propiedad."
        keywords="comparar wix wordpress tiendanube, opciones para hacer una web, web a medida argentina, comparar plataformas web"
        url={PAGE_URL}
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <section className="px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
                Comparador interactivo
              </p>
              <h1 className="mt-5 font-rajdhani text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl">
                Wix, WordPress o una web a medida:
                <br />
                <span className="gradient-text">cuál conviene según tu negocio.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                No todas las opciones compiten por lo mismo. Algunas priorizan velocidad de salida.
                Otras priorizan flexibilidad. Y otras están pensadas para resultados medibles.
              </p>
            </div>

            <div className="mt-10 rounded-[28px] border border-white/10 bg-[var(--bg-surface)]/90 p-6 shadow-[var(--shadow-modal)] sm:p-8">
              <div className="hidden overflow-hidden rounded-3xl border border-white/10 lg:block">
                <div className="grid grid-cols-[180px_repeat(3,minmax(0,1fr))] bg-white/5">
                  <div className="border-r border-white/10 p-6" />
                  {COMPARISON_COLUMNS.map((column) => (
                    <div key={column.id} className="border-r border-white/10 p-6 last:border-r-0">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--signal)]">
                        {column.subtitle}
                      </p>
                      <h2 className="mt-3 font-rajdhani text-3xl font-bold text-white">
                        {column.title}
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-gray-300">{column.summary}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-gray-500">
                        {column.ctaLabel}
                      </p>
                    </div>
                  ))}
                </div>

                {COMPARISON_ROWS.map((row, index) => (
                  <div
                    key={row.id}
                    className={`grid grid-cols-[180px_repeat(3,minmax(0,1fr))] ${
                      index % 2 === 0 ? 'bg-white/[0.03]' : 'bg-transparent'
                    }`}
                  >
                    <div className="border-r border-t border-white/10 p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                        {row.label}
                      </p>
                    </div>
                    {COMPARISON_COLUMNS.map((column) => (
                      <div
                        key={`${column.id}-${row.id}`}
                        className="border-r border-t border-white/10 p-6 last:border-r-0"
                      >
                        <p className="text-sm leading-6 text-gray-200">{column.rows[row.id]}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:hidden">
                {COMPARISON_COLUMNS.map((column) => (
                  <article
                    key={column.id}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--signal)]">
                      {column.subtitle}
                    </p>
                    <h2 className="mt-3 font-rajdhani text-3xl font-bold text-white">
                      {column.title}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-gray-300">{column.summary}</p>

                    <div className="mt-6 space-y-4">
                      {COMPARISON_ROWS.map((row) => (
                        <div key={`${column.id}-${row.id}`}>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                            {row.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-200">
                            {column.rows[row.id]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,158,245,0.14),transparent_45%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(11,15,30,0.98)_100%)] px-6 py-10 text-center sm:px-10 sm:py-14">
              <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                ¿Cuál es la correcta para tu negocio?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                Si querés salir de la duda con contexto real, revisamos tu caso y te decimos qué
                camino tiene más sentido para tu presupuesto, tu operación y tus objetivos.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/diagnostico-gratuito"
                  onClick={() =>
                    trackComparisonCtaClick('diagnostico_gratis', '/diagnostico-gratuito')
                  }
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--glow-signal)]"
                >
                  ¿Cuál es la correcta para tu negocio? → Diagnóstico gratis
                </Link>
                <Link
                  to="/consulta"
                  onClick={() => trackComparisonCtaClick('contar_proyecto', '/consulta')}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-200"
                >
                  Contar mi proyecto
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
