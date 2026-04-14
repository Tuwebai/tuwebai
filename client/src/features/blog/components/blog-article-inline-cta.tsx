import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogArticleInlineCtaProps {
  articleTitle: string;
}

export default function BlogArticleInlineCta({ articleTitle }: BlogArticleInlineCtaProps) {
  return (
    <section className="blog-newsletter-card mt-10 px-6 py-6 md:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="blog-pill blog-pill-accent">Siguiente paso</span>
        <span className="blog-pill blog-pill-muted">Bloque editorial</span>
      </div>
      <h2 className="mt-4 font-rajdhani text-2xl font-bold text-white sm:text-3xl">
        Bajá esta información a tu caso real.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
        Si este artículo sobre {articleTitle.toLowerCase()} te ayudó, podés estimar tu inversión o pedir una revisión de tu web.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link to="/calculadora-precio-web" className="blog-primary-button px-5 py-3">
          Calcular precio web
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/diagnostico-gratuito" className="blog-secondary-button px-5 py-3">
          Pedir diagnóstico gratis
        </Link>
      </div>
    </section>
  );
}
