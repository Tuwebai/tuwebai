import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredGuides = [
  {
    eyebrow: 'Precio web',
    title: 'Cuánto cuesta una web en Argentina',
    description: 'Entendé rangos, variables y decisiones que mueven un presupuesto real.',
    href: '/cuanto-cuesta-una-web',
    cta: 'Ver guía',
  },
  {
    eyebrow: 'Proveedor',
    title: 'Cómo elegir una agencia web en Argentina',
    description: 'Usá criterios concretos para filtrar promesas y evaluar propuestas con contexto.',
    href: '/como-elegir-agencia-web-argentina',
    cta: 'Leer guía',
  },
  {
    eyebrow: 'E-commerce',
    title: 'Crear tienda online en Argentina',
    description: 'Ordená plataforma, operación y venta antes de salir a publicar productos.',
    href: '/crear-tienda-online-argentina',
    cta: 'Ver guía e-commerce',
  },
  {
    eyebrow: 'SEO local',
    title: 'Cómo aparecer mejor en Google Maps',
    description: 'Mejorá visibilidad local y transformala en llamados, WhatsApp o formularios.',
    href: '/seo-local-argentina',
    cta: 'Ver guía SEO local',
  },
];

export default function BlogFeaturedGuidesSection() {
  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <div className="blog-newsletter-card px-5 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="max-w-3xl">
          <span className="blog-pill blog-pill-accent">
            Guías clave
          </span>
          <h2 className="mt-5 font-rajdhani text-3xl font-bold leading-tight text-white sm:text-4xl">
            Antes de leer el blog, resolvé las cuatro decisiones que más traban una web nueva.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
            Si todavía no definiste presupuesto, proveedor, e-commerce o visibilidad local, entrá primero por estas guías editoriales.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {featuredGuides.map((guide) => (
            <article key={guide.href} className="blog-surface-link rounded-[24px] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#9BE7FF]">
                {guide.eyebrow}
              </p>
              <h3 className="mt-4 font-rajdhani text-2xl font-bold leading-tight text-white">
                {guide.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                {guide.description}
              </p>
              <Link to={guide.href} className="blog-link-accent mt-5 inline-flex items-center gap-2">
                {guide.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
