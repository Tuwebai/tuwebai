import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBlogPosts } from '@/features/blog/hooks/use-blog-posts';
import NewsletterForm from '@/features/newsletter/components/newsletter-form';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

import './blog-pages.css';

export default function BlogListPage() {
  const posts = useBlogPosts().filter((post) => !post.noindex);
  const pageUrl = `${TUWEBAI_SITE_FULL_URL}/blog/`;
  const publishedArticlesLabel = `${posts.length} articulos publicados`;

  return (
    <>
      <MetaTags
        title="Blog"
        description="Artículos sobre desarrollo web, conversión, SEO y marketing digital para negocios argentinos. Sin relleno, solo información útil."
        keywords="blog desarrollo web Argentina, conversión web, SEO técnico Argentina, marketing digital, TuWebAI"
        url={pageUrl}
        ogType="website"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Blog TuWeb.ai',
            description: 'Guias y articulos sobre conversion web, SEO tecnico y estrategia digital en Argentina.',
            url: pageUrl,
            publisher: {
              '@type': 'Organization',
              name: 'TuWeb.ai',
              url: TUWEBAI_SITE_FULL_URL,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: posts.map((post, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${TUWEBAI_SITE_FULL_URL}/blog/${post.slug}`,
              name: post.title,
            })),
          },
        ]}
      />

      <main className="blog-page-shell px-4 pb-20 pt-28">
        <section className="mx-auto max-w-6xl">
          <div className="blog-hero-card px-5 py-10 sm:px-6 md:px-10 md:py-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="blog-pill blog-pill-accent">
                Blog TuWeb.ai
              </span>
              <span className="blog-pill blog-pill-muted">
                {publishedArticlesLabel}
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl font-rajdhani text-[2.35rem] font-bold leading-[1.02] text-white sm:text-5xl md:text-6xl">
              Recursos para corregir una web que no convierte y vender mejor.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
              Publicamos contenido pensado para negocios argentinos que necesitan diagnosticar por que su sitio recibe trafico web sin conversiones y como mejorarlo con estrategia.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="grid gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="blog-surface-link group rounded-[28px] p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm text-gray-400">
                      {format(parseISO(post.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    <h2 className="mt-3 font-rajdhani text-2xl font-bold text-white sm:text-3xl">
                      <Link to={`/blog/${post.slug}`} className="blog-link-accent">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 md:flex-col md:items-end">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#00CCFF]" />
                      {post.readingTimeMinutes} min
                    </span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="blog-secondary-button px-4 py-2 text-sm"
                    >
                      Leer articulo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="blog-newsletter-card px-5 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="max-w-3xl">
              <span className="blog-pill blog-pill-accent">
                Newsletter editorial
              </span>
              <h2 className="mt-5 font-rajdhani text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                Recibi nuevos articulos y criterios concretos para mejorar tu web.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Enviamos una seleccion breve con analisis, errores frecuentes y oportunidades de conversion para negocios en Argentina. Sin spam y con confirmacion por email.
              </p>
            </div>

            <div className="mt-8 max-w-3xl">
              <NewsletterForm
                source="blog-list"
                buttonText="Recibir ediciones"
                inputPlaceholder="nombre@empresa.com"
                disclaimerClassName="text-gray-400"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
