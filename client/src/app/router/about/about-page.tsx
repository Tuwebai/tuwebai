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
        title="Nosotros - Juanchi L?pez, Desarrollador Web C?rdoba"
        description="Conoc? a Juanchi, fundador de TuWebAI. Desarrollador fullstack de R?o Tercero, C?rdoba. Casi 6 a?os construyendo webs que venden para negocios argentinos."
        keywords="nosotros tuwebai, juanchi l?pez, juanchiidev, juan esteban l?pez, desarrollador web c?rdoba, desarrollo web argentina"
        ogType="website"
        ogImage="/logo-tuwebai.png"
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
