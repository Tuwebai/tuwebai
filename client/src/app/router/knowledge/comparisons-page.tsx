import { Link } from 'react-router-dom';

import ComparisonSection from '@/features/marketing-home/components/comparison-section';
import MetaTags from '@/shared/ui/meta-tags';
import PageBanner from '@/shared/ui/page-banner';
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

      <main className="min-h-screen bg-[#0a0a0f] text-white">
        <PageBanner
          title="Comparativas y criterio web"
          subtitle="Reunimos el bloque comparativo fuera de la home para que siga disponible, pero en un contexto mas comodo para leer y evaluar opciones."
        />

        <div className="container mx-auto px-4 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">&larr;</span>
            Volver al inicio
          </Link>
        </div>

        <ComparisonSection />
      </main>
    </>
  );
}
