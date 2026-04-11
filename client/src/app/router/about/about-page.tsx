import MetaTags from '@/shared/ui/meta-tags';
import AnimatedShape from '@/shared/ui/animated-shape';
import RevealBlock from '@/shared/ui/reveal-block';
import { Link } from 'react-router-dom';
import {
  TUWEBAI_GITHUB_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_LOCATION,
  TUWEBAI_SITE_FULL_URL,
} from '@/shared/constants/contact';

const STORY_PARAGRAPHS = [
  'TuWebAI arrancó en 2020. No con un plan de negocios ni con inversores. Arrancó con una computadora, ganas de construir cosas que funcionen y la certeza de que el desarrollo web en Argentina estaba mal enfocado.',
  'Había demasiadas agencias haciendo webs bonitas que no convertían nada. Demasiados clientes pagando por sitios que nadie usaba. Demasiado foco en el diseño y cero en el negocio detrás del diseño.',
  'Decidimos trabajar distinto: entender primero qué necesita el negocio, construir después. Sin templates, sin atajos, sin promesas que no podemos cumplir. Casi 6 años después, esa sigue siendo la única regla.',
];

const CONTEXT_STATS = [
  { value: '2020', label: 'Fundación' },
  { value: '6', label: 'Años construyendo' },
  { value: '3', label: 'Productos propios en producción' },
];

const PRINCIPLES = [
  {
    title: 'Honestidad antes que venta',
    description:
      'Si tu proyecto no encaja con lo que hacemos, te lo decimos antes de arrancar. Preferimos perder un cliente hoy que generarle un problema mañana.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-cyan-300" aria-hidden="true">
        <path
          d="M12 3l7 3v5c0 4.6-2.7 8.8-7 10-4.3-1.2-7-5.4-7-10V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.5l1.7 1.7 3.3-3.7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Código, no atajos',
    description:
      'Ningún proyecto de TuWebAI usa page builders, templates comprados ni WordPress mal configurado. Lo que construimos es código real, tuyo y mantenible.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-cyan-300" aria-hidden="true">
        <path
          d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Resultados medibles',
    description:
      'Una web que no genera consultas no es una inversión, es un costo. Por eso cada proyecto arranca definiendo qué tiene que lograr y cómo vamos a medirlo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-cyan-300" aria-hidden="true">
        <path
          d="M5 16l4-4 3 3 6-7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 8h-4V4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const STACK_CHIPS = ['React', 'Node.js', 'Supabase', 'PostgreSQL', 'Tailwind'];

const FEATURED_PROJECTS = [
  {
    title: 'LH Decants',
    category: 'E-commerce',
    description:
      'Tienda de decants con catálogo por mililitro, checkout con MercadoPago y panel de stock propio.',
    stack: ['React', 'Node.js', 'MercadoPago'],
    image: '/lhdecant-card.webp',
    href: 'https://lhdecant.com/',
    badge: 'Cliente',
  },
  {
    title: 'SafeSpot',
    category: 'Seguridad',
    description:
      'Plataforma colaborativa con alertas, reportes geolocalizados y seguimiento comunitario en tiempo real.',
    stack: ['React', 'Supabase', 'Mapas'],
    image: '/safespot.webp',
    href: 'https://safespot.tuweb-ai.com/',
  },
  {
    title: 'Captiva',
    category: 'Landing Pages',
    description:
      'Sistema de demos y landings orientadas a conversión para negocios locales con propuesta comercial clara.',
    stack: ['React', 'Tailwind', 'Vite'],
    image: '/captiva.png',
    href: 'https://captiva.tuweb-ai.com/captiva',
  },
];

const ABOUT_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/nosotros`;

const ABOUT_PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Juan Esteban López Pachao',
  alternateName: ['Juanchi', 'Juanchi López', 'Juanchi Dev', 'juanchiidev'],
  jobTitle: 'Fundador y Desarrollador Fullstack',
  worksFor: {
    '@type': 'Organization',
    name: 'TuWebAI',
    url: TUWEBAI_SITE_FULL_URL,
  },
  url: ABOUT_PAGE_URL,
  sameAs: [TUWEBAI_LINKEDIN_URL],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Río Tercero',
    addressRegion: 'Córdoba',
    addressCountry: 'AR',
  },
  knowsAbout: [
    'Desarrollo web',
    'React',
    'Node.js',
    'Supabase',
    'PostgreSQL',
    'Tailwind CSS',
    'SEO técnico',
    'E-commerce Argentina',
    'MercadoPago',
  ],
};

export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nosotros - Juanchi López, Desarrollador Web Córdoba"
        description="Conocé a Juanchi, fundador de TuWebAI. Desarrollador fullstack de Río Tercero, Córdoba. Casi 6 años construyendo webs que venden para negocios argentinos."
        keywords="nosotros tuwebai, juanchi lópez, juanchiidev, juan esteban lópez, desarrollador web córdoba, desarrollo web argentina"
        ogType="website"
        ogImage="/logo-tuwebai.png"
        url={ABOUT_PAGE_URL}
        structuredData={ABOUT_PERSON_SCHEMA}
      />

      <div className="page-shell-surface min-h-screen text-gray-300">
        <section className="relative overflow-hidden bg-gradient-1 pb-20 pt-28 sm:pb-24 sm:pt-32">
          <AnimatedShape type={1} className="right-[-140px] top-[12%]" delay={1} />
          <AnimatedShape type={2} className="bottom-[8%] left-[-120px]" delay={2} />

          <div className="container relative z-10 mx-auto px-4">
            <RevealBlock
              hiddenClassName="opacity-0 translate-y-8"
              visibleClassName="opacity-100 translate-y-0"
              durationMs={700}
            >
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <div className="mb-5 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Quiénes somos
                </div>

                <h1 className="max-w-4xl font-rajdhani text-4xl font-bold leading-[0.98] text-white sm:text-5xl md:text-6xl">
                  No somos una agencia más.
                  <br />
                  <span className="gradient-text">
                    Somos un equipo que construye webs que trabajan de verdad.
                  </span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  TuWebAI nació en {TUWEBAI_LOCATION}, con una convicción simple: la mayoría de
                  los negocios argentinos merece una presencia digital que venda, no que solo
                  exista.
                </p>
              </div>
            </RevealBlock>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <RevealBlock>
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Cómo empezamos
                </p>
              </RevealBlock>

              <div className="space-y-8 text-base leading-8 text-gray-300 sm:text-lg">
                <RevealBlock delayMs={80}>
                  <p>{STORY_PARAGRAPHS[0]}</p>
                </RevealBlock>

                <RevealBlock delayMs={140}>
                  <p>{STORY_PARAGRAPHS[1]}</p>
                </RevealBlock>

                <RevealBlock delayMs={200}>
                  <div className="mx-auto h-px w-full max-w-xl bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                </RevealBlock>

                <RevealBlock delayMs={260}>
                  <p>{STORY_PARAGRAPHS[2]}</p>
                </RevealBlock>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3 md:gap-0">
              {CONTEXT_STATS.map((stat, index) => (
                <RevealBlock
                  key={stat.label}
                  className={`text-center ${
                    index < CONTEXT_STATS.length - 1 ? 'md:border-r md:border-white/10' : ''
                  }`}
                  delayMs={index * 90}
                >
                  <div className="px-4 py-4">
                    <p className="gradient-text font-rajdhani text-5xl font-bold sm:text-6xl">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Cómo pensamos
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Tres principios que no negociamos.
                </h2>
              </RevealBlock>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {PRINCIPLES.map((principle, index) => (
                  <RevealBlock key={principle.title} delayMs={index * 90}>
                    <article className="h-full rounded-2xl border border-white/5 bg-[#12121f] p-8">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10">
                        {principle.icon}
                      </div>
                      <h3 className="font-rajdhani text-2xl font-bold text-white">
                        {principle.title}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-gray-300">
                        {principle.description}
                      </p>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  El equipo
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Una persona. Todo el stack.
                </h2>
              </RevealBlock>

              <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
                <RevealBlock delayMs={80}>
                  <div className="space-y-6 text-base leading-8 text-gray-300 sm:text-lg">
                    <p>
                      TuWebAI es Juan Esteban López, Juanchi para los que nos conocen. Desarrollador fullstack y desarrollador web Córdoba desde Río Tercero, Córdoba.
                    </p>
                    <p>
                      Diseño, frontend, backend, bases de datos, deploys. Juan Esteban López lleva TuWebAI de punta a punta: un solo interlocutor desde el primer wireframe hasta el lanzamiento. Sin capas de intermediarios, sin "te consulto con el equipo técnico".
                    </p>
                    <p>
                      Cuando hablás con TuWebAI, hablás directamente con Juanchi, la persona que va a construir tu proyecto. Así trabajamos desarrollo web Argentina sin vendedores en el medio.
                    </p>
                  </div>
                </RevealBlock>

                <RevealBlock delayMs={150}>
                  <aside className="rounded-2xl border border-white/5 bg-[#12121f] p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <img
                          src="/image_perfil.webp"
                          alt="Foto de perfil de Juan Esteban López"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-rajdhani text-2xl font-bold text-white">
                          Juan Esteban López
                        </p>
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
            </div>
          </div>
        </section>

        <section className="bg-slate-900/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Lo que construimos
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Proyectos reales.
                  <br />
                  Problemas reales resueltos.
                </h2>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  Algunos propios, uno de cliente. Todos con código a medida y lógica de negocio
                  pensada desde cero.
                </p>
              </RevealBlock>

              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {FEATURED_PROJECTS.map((project, index) => (
                  <RevealBlock key={project.title} delayMs={index * 90}>
                    <article className="overflow-hidden rounded-2xl border border-white/5 bg-[#12121f]">
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
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
                        <h3 className="font-rajdhani text-2xl font-bold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-4 text-base leading-7 text-gray-300">
                          {project.description}
                        </p>

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
                            <span className="ml-2">→</span>
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
                  Ver todos los proyectos →
                </a>
              </RevealBlock>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <RevealBlock
              hiddenClassName="opacity-0 translate-y-8"
              visibleClassName="opacity-100 translate-y-0"
              className="mx-auto max-w-5xl rounded-[32px] border border-white/5 bg-[radial-gradient(circle_at_top,rgba(0,204,255,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(153,51,255,0.12),transparent_35%),linear-gradient(180deg,rgba(18,18,31,0.96)_0%,rgba(10,10,15,0.98)_100%)] px-6 py-10 text-center sm:px-10 sm:py-14"
            >
              <h2 className="mx-auto max-w-3xl font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Si esto resuena con lo que necesita tu negocio, hablemos.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                La primera conversación es siempre sin cargo. Te decimos si podemos ayudarte y
                cómo.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/diagnostico-gratuito"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-6 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(0,204,255,0.18)] transition-transform duration-200 hover:scale-[1.02]"
                >
                  Pedí tu diagnóstico gratuito →
                </Link>
                <Link
                  to="/?section=showroom"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-200 transition-colors duration-200 hover:border-cyan-300/40 hover:text-white"
                >
                  Ver proyectos reales
                </Link>
              </div>
            </RevealBlock>
          </div>
        </section>
      </div>
    </>
  );
}
