import MetaTags from '@/shared/ui/meta-tags';
import AnimatedShape from '@/shared/ui/animated-shape';
import RevealBlock from '@/shared/ui/reveal-block';

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
                  <span className="gradient-text">Somos un equipo que construye webs que trabajan de verdad.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  TuWebAI nació en Río Tercero, Córdoba, con una convicción simple: la mayoría
                  de los negocios argentinos merece una presencia digital que venda, no que solo
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
                  className={`text-center ${index < CONTEXT_STATS.length - 1 ? 'md:border-r md:border-white/10' : ''}`}
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
      </div>
    </>
  );
}
