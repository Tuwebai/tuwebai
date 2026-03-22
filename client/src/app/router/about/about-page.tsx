import MetaTags from '@/shared/ui/meta-tags';
import AnimatedShape from '@/shared/ui/animated-shape';
import RevealBlock from '@/shared/ui/reveal-block';
import {
  TUWEBAI_GITHUB_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_LOCATION,
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

const STACK_CHIPS = ['React', 'Node.js', 'Supabase', 'Firebase', 'Tailwind'];

export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nosotros | TuWeb.ai"
        description="Conocé cómo nació TuWeb.ai, qué defendemos al construir sitios web y por qué trabajamos distinto para negocios argentinos."
        keywords="nosotros tuwebai, agencia web argentina, desarrollo web cordoba, quien es tuwebai, juan esteban lopez"
        ogType="website"
        ogImage="/logo-tuwebai.png"
      />

      <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
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

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
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

        <section className="bg-[#0f0f1a] py-16 sm:py-20">
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

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
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

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
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
                      TuWebAI es Juan, Juanchi para los que nos conocen. Desarrollador fullstack de
                      Río Tercero, Córdoba.
                    </p>
                    <p>
                      Diseño, frontend, backend, bases de datos, deploys. Un solo interlocutor
                      desde el primer wireframe hasta el lanzamiento. Sin capas de intermediarios,
                      sin “te consulto con el equipo técnico”.
                    </p>
                    <p>
                      Cuando hablás con TuWebAI, hablás directamente con quien va a construir tu
                      proyecto.
                    </p>
                  </div>
                </RevealBlock>

                <RevealBlock delayMs={150}>
                  <aside className="rounded-2xl border border-white/5 bg-[#12121f] p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 font-rajdhani text-2xl font-bold text-white">
                        JL
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
      </div>
    </>
  );
}
