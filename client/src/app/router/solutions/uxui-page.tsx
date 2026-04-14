import { Link } from 'react-router-dom';
import { ArrowRight, Check, Compass, LayoutTemplate, MessageCircle, Search, Workflow } from 'lucide-react';

import ScrollProgress from '@/shared/ui/scroll-progress';
import WhatsAppButton from '@/shared/ui/whatsapp-button';
import { TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

const services = [
  {
    title: 'Investigación UX',
    description: 'Detectamos fricciones, recorridos rotos y expectativas reales antes de diseñar.',
    items: ['Entrevistas y hallazgos', 'Mapas de recorrido', 'Tests de usabilidad', 'Prioridades de negocio'],
    icon: Search,
  },
  {
    title: 'Diseño de interfaz',
    description: 'Ordenamos la experiencia con wireframes, prototipos y un sistema visual consistente.',
    items: ['Wireframes', 'Prototipos', 'Sistema de diseño', 'Responsive real'],
    icon: LayoutTemplate,
  },
  {
    title: 'Optimización de conversión',
    description: 'Diseñamos para que el usuario entienda qué hacer y avance sin fricción.',
    items: ['CTA claros', 'Jerarquía visual', 'Mejora de flujos', 'Validación antes de lanzar'],
    icon: Compass,
  },
] as const;

const process = [
  {
    step: '01',
    title: 'Descubrimiento',
    description: 'Aterrizamos objetivos, contexto comercial y prioridades del proyecto.',
  },
  {
    step: '02',
    title: 'Estructura y prototipo',
    description: 'Definimos pantallas, jerarquías y recorridos antes del diseño final.',
  },
  {
    step: '03',
    title: 'Diseño visual',
    description: 'Convertimos la lógica en una interfaz clara, moderna y alineada a tu marca.',
  },
  {
    step: '04',
    title: 'Validación',
    description: 'Revisamos decisiones, corregimos fricción y dejamos listo el paso a desarrollo.',
  },
] as const;

const projects = [
  {
    title: 'LH Decants',
    category: 'E-commerce premium',
    description: 'Rediseño visual y orden de compra para una tienda con catálogo amplio y percepción de marca alta.',
    image: '/lhdecant-card.webp',
  },
  {
    title: 'Captiva',
    category: 'Landing pages',
    description: 'Sistema visual y estructura editorial para demos que necesitan explicar, convencer y convertir.',
    image: '/captiva.png',
  },
  {
    title: 'SafeSpot',
    category: 'Producto digital',
    description: 'Interfaz enfocada en claridad operativa, lectura rápida y uso repetido en contexto real.',
    image: '/safespot.webp',
  },
] as const;

const pillClassName =
  'inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]';
const mutedPillClassName =
  'inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-gray-300';
const surfaceClassName =
  'overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.1),transparent_40%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.08),transparent_34%),linear-gradient(180deg,rgba(20,26,42,0.98),rgba(12,18,31,0.92))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)] md:rounded-[32px]';

export default function UxUiPage() {
  return (
    <>
      <MetaTags
        title="Diseño UX/UI Web"
        description="Diseño de interfaces web centradas en conversión. Wireframes, prototipos y diseño visual alineado al objetivo comercial del negocio."
        keywords="diseño UX UI web, interfaces que convierten, wireframes, prototipos, diseño visual, TuWebAI"
        url="https://tuweb-ai.com/uxui"
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />

      <main className="min-h-screen bg-[var(--bg-base)] bg-[image:var(--gradient-page-shell)] px-4 pb-20 pt-28 text-white">
        <ScrollProgress color="#00CCFF" />
        <WhatsAppButton />

        <section className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-5 py-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-6 md:rounded-[32px] md:px-10 md:py-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className={pillClassName}>UX/UI TuWebAI</span>
              <span className={mutedPillClassName}>Diseño orientado a conversión</span>
            </div>

            <h1 className="mt-6 max-w-4xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
              Diseño UX/UI moderno para que tus pantallas conviertan mejor.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
              Diseñamos experiencias claras, prototipos validados y sistemas visuales listos para pasar a desarrollo sin improvisación.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/consulta"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-7 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,204,255,0.2)] transition hover:opacity-95"
              >
                Solicitar propuesta UX/UI
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#servicios"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver servicios
              </a>
            </div>
          </div>
        </section>

        <section id="servicios" className="mx-auto mt-10 max-w-6xl">
          <div className="text-center">
            <div className="flex justify-center">
              <span className={pillClassName}>Servicios UX/UI</span>
            </div>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Lo que resolvemos dentro de una interfaz.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
              No hacemos pantallas lindas porque sí. Diseñamos recorridos útiles para vender, explicar y reducir fricción.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.map(({ title, description, items, icon: Icon }) => (
              <article key={title} className={`${surfaceClassName} h-full px-6 py-8`}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#00CCFF]/10 text-[#9BE7FF]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-rajdhani text-2xl font-bold text-white">{title}</h3>
                <p className="mt-4 text-base leading-7 text-gray-300">{description}</p>

                <ul className="mt-6 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00CCFF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="procesos" className="mx-auto mt-10 max-w-6xl">
          <div className={`${surfaceClassName} px-6 py-10 sm:px-8 md:px-10`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={pillClassName}>Proceso UX/UI</span>
              <span className={mutedPillClassName}>De idea a validación</span>
            </div>

            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Un proceso simple para bajar decisiones antes del desarrollo.
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {process.map(({ step, title, description }) => (
                <article key={step} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] font-rajdhani text-lg font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-4 font-rajdhani text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="proyectos" className="mx-auto mt-10 max-w-6xl">
          <div className="text-center">
            <div className="flex justify-center">
              <span className={pillClassName}>Proyectos UX/UI</span>
            </div>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Casos donde la interfaz tenía que ordenar el negocio.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className={`${surfaceClassName} overflow-hidden`}>
                <div className="relative h-52 overflow-hidden">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full border border-white/10 bg-slate-950/75 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-200">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{project.title}</h3>
                  <p className="mt-4 text-base leading-7 text-gray-300">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contacto" className="mx-auto mt-10 max-w-6xl">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-6 py-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-10 sm:py-14 md:rounded-[32px]">
            <div className="flex justify-center">
              <span className={pillClassName}>Siguiente paso</span>
            </div>
            <h2 className="mx-auto mt-4 max-w-3xl font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Si tu producto necesita claridad visual y mejor conversión, lo diseñamos.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Podemos trabajar desde cero o reordenar una interfaz existente para que explique mejor, guíe mejor y convierta mejor.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/consulta"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(0,204,255,0.18)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <Workflow className="h-4 w-4" />
                Solicitar proyecto UX/UI
              </Link>
              <a
                href={`${TUWEBAI_WHATSAPP_URL}?text=Hola,%20quiero%20mejorar%20el%20UX/UI%20de%20mi%20sitio`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-200 transition-colors duration-200 hover:border-cyan-300/40 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
