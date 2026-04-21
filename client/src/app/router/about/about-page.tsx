import MetaTags from '@/shared/ui/meta-tags';

import { ABOUT_PAGE_URL, ABOUT_PERSON_SCHEMA } from './about-page.content';
import {
  AboutCtaSection,
  AboutProjectsSection,
} from './about-page-project-sections';
import {
  AboutHeroSection,
  AboutPrinciplesSection,
  AboutStatsSection,
  AboutStorySection,
  AboutTeamSection,
} from './about-page-overview-sections';

export default function AboutPage() {
  return (
    <>
      <MetaTags
        title="Nosotros - Juanchi López, Desarrollador Web Córdoba"
        description="Conocé a Juanchi, fundador de TuWebAI. Desarrollador fullstack de Río Tercero, Córdoba. Casi 6 años construyendo webs que venden para negocios argentinos."
        keywords="nosotros tuwebai, juanchi lópez, juanchiidev, juan esteban lópez, desarrollador web Córdoba, desarrollo web argentina"
        ogType="website"
        ogImage="/logo-tuwebai.webp"
        url={ABOUT_PAGE_URL}
        structuredData={ABOUT_PERSON_SCHEMA}
      />

      <main className="min-h-screen bg-[var(--bg-base)] bg-[image:var(--gradient-page-shell)] px-4 pb-20 pt-28 text-gray-300">
        <AboutHeroSection />
        <AboutStatsSection />
        <AboutStorySection />
        <AboutPrinciplesSection />
        <AboutTeamSection />
        <AboutProjectsSection />
        <AboutCtaSection />
      </main>
    </>
  );
}
