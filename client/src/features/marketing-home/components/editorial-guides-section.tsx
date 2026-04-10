import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const guides = [
  {
    eyebrow: 'Precio web',
    title: 'Cuánto cuesta una web en Argentina y qué cambia el presupuesto real.',
    description:
      'Una guía para entender rangos, variables de precio y cuándo conviene invertir más o recortar alcance.',
    href: '/cuanto-cuesta-una-web',
    cta: 'Ver guía de precios',
  },
  {
    eyebrow: 'Comparador',
    title: 'Wix, WordPress o desarrollo a medida: compará qué te conviene.',
    description:
      'Una vista clara para decidir según soporte, flexibilidad, propiedad y resultados esperables para tu negocio.',
    href: '/comparar-opciones-web',
    cta: 'Comparar opciones',
  },
  {
    eyebrow: 'Agencia web',
    title: 'Cómo elegir una agencia web sin comprar humo ni promesas vacías.',
    description:
      'Preguntas, señales y criterios concretos para evaluar proveedores antes de avanzar con una propuesta.',
    href: '/como-elegir-agencia-web-argentina',
    cta: 'Leer guía para elegir',
  },
];

export default function EditorialGuidesSection() {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-14">
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.78))] px-5 py-8 shadow-[0_28px_70px_rgba(2,6,23,0.28)] sm:px-7 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9BE7FF]">
            Guías para decidir mejor
          </p>
          <h2 className="mt-4 font-rajdhani text-3xl font-bold leading-tight text-white sm:text-4xl">
            Entrá por contenido útil, no por un menú cargado.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Si todavía estás comparando opciones o bajando a tierra números, estas guías te ayudan a ordenar decisión,
            presupuesto y proveedor sin lenguaje técnico.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.href}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7DD3FC]">
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
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#9BE7FF] transition-colors hover:text-white"
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
