import MetaTags from '@/components/seo/meta-tags';
import MarketingHomePage from '@/features/marketing-home/components/marketing-home-page';

export default function Home() {
  return (
    <>
      <MetaTags
        title="TuWeb.ai - Agencia Digital de Desarrollo Web y Marketing Digital en Argentina"
        description="Desarrollo web profesional, marketing digital y automatización para empresas. Especialistas en React, Node.js, SEO y estrategias digitales. Consultoría gratuita disponible."
        keywords="desarrollo web argentina, marketing digital, diseño web, ecommerce, SEO, agencia digital, React, Node.js, automatización marketing, consultoría digital, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <MarketingHomePage />
    </>
  );
}
