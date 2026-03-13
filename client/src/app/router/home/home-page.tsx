import MarketingHomePage from '@/features/marketing-home/components/marketing-home-page';
import MetaTags from '@/shared/ui/meta-tags';

export default function HomePage() {
  return (
    <>
      <MetaTags
        title="TuWeb.ai - Desarrollo Web Profesional para Negocios en Argentina"
        description="Desarrollamos sitios web, e-commerce y sistemas web para negocios que necesitan una presencia digital profesional, confiable y preparada para vender."
        keywords="desarrollo web argentina, desarrollo web profesional, sitios web para negocios, ecommerce argentina, sistemas web, diseno web profesional, React, Node.js, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <MarketingHomePage />
    </>
  );
}
