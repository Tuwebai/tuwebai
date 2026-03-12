import MetaTags from '@/components/seo/meta-tags';
import MarketingHomePage from '@/features/marketing-home/components/marketing-home-page';

export default function HomePage() {
  return (
    <>
      <MetaTags
        title="TuWeb.ai - Agencia Digital de Desarrollo Web y Marketing Digital en Argentina"
        description="Desarrollo web profesional, marketing digital y automatizacion para empresas. Especialistas en React, Node.js, SEO y estrategias digitales. Consultoria gratuita disponible."
        keywords="desarrollo web argentina, marketing digital, diseno web, ecommerce, SEO, agencia digital, React, Node.js, automatizacion marketing, consultoria digital, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <MarketingHomePage />
    </>
  );
}
