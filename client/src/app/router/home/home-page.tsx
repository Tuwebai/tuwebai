import MarketingHomePage from '@/features/marketing-home/components/marketing-home-page';
import MetaTags from '@/shared/ui/meta-tags';

export default function HomePage() {
  return (
    <>
      <MetaTags
        title="TuWeb.ai | Sitios web para negocios que quieren vender más online"
        description="Construimos sitios web, e-commerce y sistemas a medida para negocios argentinos que necesitan vender online, generar consultas y crecer con código real."
        keywords="desarrollo web argentina, sitios web para negocios, ecommerce argentina, sistemas a medida, diseño web argentina, landing pages, React, Node.js, TuWeb.ai"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <MarketingHomePage />
    </>
  );
}
