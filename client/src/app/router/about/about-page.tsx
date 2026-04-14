import MetaTags from '@/shared/ui/meta-tags';
import RevealBlock from '@/shared/ui/reveal-block';
import { Link } from 'react-router-dom';
import {
  TUWEBAI_GITHUB_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_LOCATION,
  TUWEBAI_SITE_FULL_URL,
} from '@/shared/constants/contact';

const STORY_PARAGRAPHS = [
  'TuWebAI arranc? en 2020. No con un plan de negocios ni con inversores. Arranc? con una computadora, ganas de construir cosas que funcionen y la certeza de que el desarrollo web en Argentina estaba mal enfocado.',
  'Hab?a demasiadas agencias haciendo webs bonitas que no convert?an nada. Demasiados clientes pagando por sitios que nadie usaba. Demasiado foco en el dise?o y cero en el negocio detr?s del dise?o.',
  'Decidimos trabajar distinto: entender primero qu? necesita el negocio, construir despu?s. Sin templates, sin atajos, sin promesas que no podemos cumplir. Casi 6 a?os despu?s, esa sigue siendo la ?nica regla.',
];

const CONTEXT_STATS = [
  { value: '2020', label: 'Fundaci?n' },
  { value: '6', label: 'A?os construyendo' },
  { value: '3', label: 'Productos propios en producci?n' },
];

const PRINCIPLES = [
  {
    title: 'Honestidad antes que venta',
    description:
      'Si tu proyecto no encaja con lo que hacemos, te lo decimos antes de arrancar. Preferimos perder un cliente hoy que generarle un problema ma?ana.',
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
    title: 'C?digo, no atajos',
    description:
      'Ning?n proyecto de TuWebAI usa page builders, templates comprados ni WordPress mal configurado. Lo que construimos es c?digo real, tuyo y mantenible.',
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
      'Una web que no genera consultas no es una inversi?n, es un costo. Por eso cada proyecto arranca definiendo qu? tiene que lograr y c?mo vamos a medirlo.',
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
      'Tienda de decants con cat?logo por mililitro, checkout con MercadoPago y panel de stock propio.',
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
      'Sistema de demos y landings orientadas a conversi?n para negocios locales con propuesta comercial clara.',
    stack: ['React', 'Tailwind', 'Vite'],
    image: '/captiva.png',
    href: 'https://captiva.tuweb-ai.com/captiva',
  },
];

const ABOUT_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/nosotros`;

const ABOUT_PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Juan Esteban L?pez Pachao',
  alternateName: ['Juanchi', 'Juanchi L?pez', 'Juanchi Dev', 'juanchiidev'],
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
    addressLocality: 'R?o Tercero',
    addressRegion: 'C?rdoba',
    addressCountry: 'AR',
  },
  knowsAbout: [
    'Desarrollo web',
    'React',
    'Node.js',
    'Supabase',
    'PostgreSQL',
    'Tailwind CSS',
    'SEO t?cnico',
    'E-commerce Argentina',
    'MercadoPago',
  ],
};

const surfaceClassName =
  'overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.1),transparent_40%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.08),transparent_34%),linear-gradient(180deg,rgba(20,26,42,0.98),rgba(12,18,31,0.92))] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.28)] md:rounded-[32px]';

export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nosotros - Juanchi L?pez, Desarrollador Web C?rdoba"
        description="Conoc? a Juanchi, fundador de TuWebAI. Desarrollador fullstack de R?o Tercero, C?rdoba. Casi 6 a?os construyendo webs que venden para negocios argentinos."
        keywords="nosotros tuwebai, juanchi l?pez, juanchiidev, juan esteban l?pez, desarrollador web c?rdoba, desarrollo web argentina"
        ogType="website"
        ogImage="/logo-tuwebai.png"
        url={ABOUT_PAGE_URL}
        structuredData={ABOUT_PERSON_SCHEMA}
      />

      <main className="min-h-screen bg-[var(--bg-base)] bg-[image:var(--gradient-page-shell)] px-4 pb-20 pt-28 text-gray-300">
        <section className="mx-auto max-w-6xl">
          <RevealBlock>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-5 py-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-6 md:rounded-[32px] md:px-10 md:py-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                  Qui?nes somos
                </span>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.75rem] font-medium uppercase tracking-[0.18em] text-gray-300">
                  {TUWEBAI_LOCATION}
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
                No somos una agencia m?s. Construimos webs que trabajan de verdad.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300 md:text-lg">
                TuWebAI naci? en {TUWEBAI_LOCATION}, con una convicci?n simple: la mayor?a de los negocios argentinos merece una presencia digital que venda, no que solo exista.
              </p>
            </div>
          </RevealBlock>
        </section>

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

        <section className="mx-auto mt-10 max-w-6xl">
          <RevealBlock>
            <div className={`${surfaceClassName} px-6 py-10 sm:px-8 md:px-10`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                  C?mo empezamos
                </span>
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

        <section className="mx-auto mt-10 max-w-6xl">
          <RevealBlock className="text-center">
            <div className="flex justify-center">
              <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                C?mo pensamos
              </span>
            </div>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Tres principios que no negociamos.
            </h2>
          </RevealBlock>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <RevealBlock key={principle.title} delayMs={index * 90}>
                <article className={`${surfaceClassName} h-full px-6 py-8`}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10">
                    {principle.icon}
                  </div>
                  <h3 className="font-rajdhani text-2xl font-bold text-white">{principle.title}</h3>
                  <p className="mt-4 text-base leading-7 text-gray-300">{principle.description}</p>
                </article>
              </RevealBlock>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <RevealBlock className="text-center">
            <div className="flex justify-center">
              <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                El equipo
              </span>
            </div>
            <h2 className="mt-4 font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Una persona. Todo el stack.
            </h2>
          </RevealBlock>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
            <RevealBlock delayMs={80}>
              <div className={`${surfaceClassName} space-y-6 px-6 py-8 text-base leading-8 text-gray-300 sm:text-lg`}>
                <p>
                  TuWebAI es Juan Esteban L?pez, Juanchi para los que nos conocen. Desarrollador fullstack y desarrollador web C?rdoba desde R?o Tercero, C?rdoba.
                </p>
                <p>
                  Dise?o, frontend, backend, bases de datos, deploys. Juan Esteban L?pez lleva TuWebAI de punta a punta: un solo interlocutor desde el primer wireframe hasta el lanzamiento. Sin capas de intermediarios, sin "te consulto con el equipo t?cnico".
                </p>
                <p>
                  Cuando habl?s con TuWebAI, habl?s directamente con Juanchi, la persona que va a construir tu proyecto. As? trabajamos desarrollo web Argentina sin vendedores en el medio.
                </p>
              </div>
            </RevealBlock>

            <RevealBlock delayMs={150}>
              <aside className={`${surfaceClassName} px-6 py-8`}>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
                    <img
                      src="/image_perfil.webp"
                      alt="Foto de perfil de Juan Esteban L?pez"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-rajdhani text-2xl font-bold text-white">Juan Esteban L?pez</p>
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

        <section className="mx-auto mt-10 max-w-6xl">
          <RevealBlock className="text-center">
            <div className="flex justify-center">
              <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-[#9BE7FF]">
                Lo que construimos
              </span>
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

        <section className="mx-auto mt-10 max-w-6xl">
          <RevealBlock>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,204,255,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(153,51,255,0.14),transparent_32%),linear-gradient(180deg,rgba(18,18,23,0.98),rgba(10,10,15,0.98))] px-6 py-10 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] sm:px-10 sm:py-14 md:rounded-[32px]">
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
      </main>
    </>
  );
}
