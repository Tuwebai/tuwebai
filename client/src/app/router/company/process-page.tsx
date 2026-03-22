import { Link } from 'react-router-dom';

import AnimatedShape from '@/shared/ui/animated-shape';
import MetaTags from '@/shared/ui/meta-tags';
import RevealBlock from '@/shared/ui/reveal-block';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

const PROCESS_PAGE_URL = `${TUWEBAI_SITE_FULL_URL}/proceso`;

const PROCESS_OVERVIEW = [
  { step: '01', title: 'Consulta inicial', duration: '1 día' },
  { step: '02', title: 'Propuesta y alcance', duration: '1 a 2 días' },
  { step: '03', title: 'Diseño y desarrollo', duration: '2 a 4 semanas' },
  { step: '04', title: 'Revisión y ajustes', duration: '3 a 5 días' },
  { step: '05', title: 'Lanzamiento y entrega', duration: '1 día' },
];

export default function ProcessPage() {
  return (
    <>
      <MetaTags
        title="Proceso de Trabajo"
        description="Conocé cómo trabaja TuWebAI en cada proyecto: etapas, tiempos reales, entregables concretos y qué esperamos del cliente en cada paso."
        keywords="proceso de trabajo, desarrollo web argentina, etapas proyecto web, entregables TuWebAI"
        url={PROCESS_PAGE_URL}
        ogType="website"
      />

      <main className="min-h-screen bg-[#0a0a0f] text-gray-300">
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
                  Cómo trabajamos
                </div>

                <h1 className="max-w-4xl font-rajdhani text-4xl font-bold leading-[0.98] text-white sm:text-5xl md:text-6xl">
                  Sin reuniones infinitas.
                  <br />
                  <span className="gradient-text">Sin sorpresas al final.</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
                  Un proceso claro de 5 etapas desde el primer mensaje hasta que tenés el control
                  total de tu sitio.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/contacto"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00CCFF] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,204,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Contar mi proyecto
                  </Link>
                  <Link
                    to="/?section=showroom"
                    className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-[#DCE7FF] transition-colors duration-200 hover:border-[#00CCFF]/45 hover:text-white"
                  >
                    Ver proyectos reales
                  </Link>
                </div>
              </div>
            </RevealBlock>
          </div>
        </section>

        <section className="bg-[#0a0a0f] py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <RevealBlock className="text-center">
                <p className="mb-4 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Vista general
                </p>
                <h2 className="font-rajdhani text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                  Las 5 etapas que vamos a desarrollar en esta página.
                </h2>
              </RevealBlock>

              <div className="mt-12 grid gap-4 md:grid-cols-5">
                {PROCESS_OVERVIEW.map((item, index) => (
                  <RevealBlock key={item.step} delayMs={index * 70}>
                    <article className="h-full rounded-2xl border border-white/5 bg-[#12121f] p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                        Etapa {item.step}
                      </p>
                      <h3 className="mt-3 font-rajdhani text-2xl font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-400">{item.duration}</p>
                    </article>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
