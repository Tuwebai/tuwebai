import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { BlogArticle, BlogArticleSummary } from '@/features/blog/types';

interface BlogArticleSidebarProps {
  article: BlogArticle;
  relatedArticles: BlogArticleSummary[];
}

export default function BlogArticleSidebar({ article, relatedArticles }: BlogArticleSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="blog-side-surface-accent p-6">
        <p className="blog-heading-kicker text-xs">Diagnóstico gratuito</p>
        <h2 className="mt-3 font-rajdhani text-2xl font-bold text-white sm:text-3xl">Descubrí qué frena tus consultas.</h2>
        <p className="mt-4 text-sm leading-7 text-gray-300">
          Revisamos estructura, propuesta, CTA y experiencia mobile para decirte qué mejorar primero.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/diagnostico-gratuito" className="blog-primary-button px-5 py-3">
            Pedir diagnóstico gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/calculadora-precio-web" className="blog-secondary-button px-5 py-3">
            Calcular precio web
          </Link>
        </div>
      </div>

      <div className="blog-side-surface p-6">
        <h2 className="font-rajdhani text-2xl font-bold text-white">Índice del artículo</h2>
        <nav className="mt-4">
          <ul className="space-y-3 text-sm leading-6 text-gray-300">
            {article.headings
              .filter((heading) => heading.level === 2)
              .map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} className="blog-link-accent transition-colors">
                    {heading.text}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      {relatedArticles.length > 0 ? (
        <div className="blog-side-surface p-6">
          <h2 className="font-rajdhani text-2xl font-bold text-white">Seguí leyendo</h2>
          <div className="mt-4 space-y-4">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.slug}
                to={`/blog/${relatedArticle.slug}/`}
                className="blog-surface-link block rounded-2xl p-4"
              >
                <p className="font-rajdhani text-xl font-bold text-white">{relatedArticle.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-300">{relatedArticle.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
