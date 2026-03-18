import { Link } from 'react-router-dom';

import AnimatedShape from '@/shared/ui/animated-shape';
import ComparisonSection from '@/features/marketing-home/components/comparison-section';
import MetaTags from '@/shared/ui/meta-tags';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';

export default function ComparisonsPage() {
  return (
    <>
      <MetaTags
        title="Comparativas y criterio para proyectos web"
        description="Explora la comparativa de criterio de TuWeb.ai para evaluar soluciones web genericas frente a proyectos pensados para negocio, conversion y crecimiento."
        keywords="comparativa desarrollo web, criterio proyecto web, soluciones web genericas, TuWeb.ai"
        url={`${TUWEBAI_SITE_FULL_URL}/comparativas`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Comparativas y criterio para proyectos web',
          url: `${TUWEBAI_SITE_FULL_URL}/comparativas`,
          description:
            'Comparativa de criterio para entender que cambia entre una solucion web generica y un proyecto pensado para negocio.',
        }}
      />

      <main className="min-h-screen bg-gradient-1 text-white">
        <section className="relative overflow-hidden bg-gradient-1 pt-24 pb-8">
          <AnimatedShape type={1} className="top-[12%] right-[-150px]" delay={1} />
          <AnimatedShape type={2} className="bottom-[-40px] left-[-110px]" delay={2} />

          <div className="container relative z-10 mx-auto grid min-h-[132px] grid-cols-[1fr_auto_1fr] items-center px-4">
            <div className="flex items-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
              >
                <span aria-hidden="true">&larr;</span>
                Volver al inicio
              </Link>
            </div>

            <h1 className="text-center font-rajdhani text-2xl font-bold md:text-4xl">
              <span className="gradient-text gradient-border inline-block pb-2">
                La diferencia no es solo visual
              </span>
            </h1>

            <div aria-hidden="true" />
          </div>
        </section>

        <ComparisonSection showIntro={false} sectionClassName="bg-gradient-1 -mt-8 pt-0" />
      </main>
    </>
  );
}
