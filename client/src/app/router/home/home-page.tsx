import MarketingHomePage from '@/features/marketing-home/components/marketing-home-page';
import MetaTags from '@/shared/ui/meta-tags';

export default function HomePage() {
  return (
    <>
      <MetaTags
        title="TuWebAI | Desarrollo Web Profesional para Negocios Argentinos"
        description="Construimos sitios web a medida para negocios argentinos que quieren vender online. Webs comerciales, e-commerce y sistemas web. Sin templates. Código real. Río Tercero, Córdoba."
        keywords="desarrollo web Argentina, sitios web para negocios, e-commerce Argentina, sistemas web a medida, desarrollo web Córdoba, TuWebAI"
        url="https://tuweb-ai.com/"
        ogImage="/logo-tuwebai.png"
        ogType="website"
        twitterCard="summary_large_image"
      />
      <MarketingHomePage />
    </>
  );
}
