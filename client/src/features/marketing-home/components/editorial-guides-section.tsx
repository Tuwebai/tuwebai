import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const guides = [
  {
    eyebrow: 'Precio web',
    title: 'Cuánto cuesta una web en Argentina.',
    description: 'Rangos, variables y decisiones que cambian el presupuesto.',
    href: '/cuanto-cuesta-una-web',
    cta: 'Ver guía',
  },
  {
    eyebrow: 'Agencia web',
    title: 'Cómo elegir una agencia web.',
    description: 'Criterios concretos para evaluar propuestas y proveedores.',
    href: '/como-elegir-agencia-web-argentina',
    cta: 'Leer guía',
  },
  {
    eyebrow: 'E-commerce',
    title: 'Crear tienda online en Argentina.',
    description: 'Qué resolver para vender online sin trabar la operación.',
    href: '/crear-tienda-online-argentina',
    cta: 'Ver guía e-commerce',
  },
  {
    eyebrow: 'SEO local',
    title: 'Aparecer en Google Maps Argentina.',
    description: 'Cómo convertir búsquedas locales en consultas reales.',
    href: '/seo-local-argentina',
    cta: 'Ver guía SEO local',
  },
];

export default function EditorialGuidesSection() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-14">
      <div className="rounded-[32px] border border-[var(--border-default)] bg-[linear-gradient(180deg,var(--bg-overlay),rgba(15,23,42,0.82))] px-5 py-8 shadow-[var(--shadow-modal)] sm:px-7 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--signal)]">
            Guías útiles
          </p>
          <h2 className="mt-4 font-rajdhani text-3xl font-bold leading-tight text-white sm:text-4xl">
            Cuatro guías para decidir mejor tu web.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {guides.map((guide) => (
            <article
              key={guide.href}
              className="rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-surface)]/72 p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--signal)]">
                {guide.eyebrow}
              </p>
              <h3 className="mt-4 font-rajdhani text-2xl font-bold leading-tight text-white">
                {guide.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {guide.description}
              </p>
              <Link
                to={guide.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--signal)] transition-colors hover:text-white"
              >
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
