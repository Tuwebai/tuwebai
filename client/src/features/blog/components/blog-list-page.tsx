import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import BlogFeaturedGuidesSection from '@/features/blog/components/blog-featured-guides-section';
import { useBlogPosts } from '@/features/blog/hooks/use-blog-posts';
import NewsletterForm from '@/features/newsletter/components/newsletter-form';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

import './blog-pages.css';

export default function BlogListPage() {
  const posts = useBlogPosts().filter((post) => !post.noindex);
  const pageUrl = `${TUWEBAI_SITE_FULL_URL}/blog/`;
  const publishedArticlesLabel = `${posts.length} artículos publicados`;

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
            description: 'Guías y artículos sobre conversión web, SEO técnico y estrategia digital en Argentina.',
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
              url: `${TUWEBAI_SITE_FULL_URL}/blog/${post.slug}/`,
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
              Publicamos contenido pensado para negocios argentinos que necesitan diagnosticar por qué su sitio recibe tráfico web sin conversiones y cómo mejorarlo con estrategia.
            </p>
          </div>
        </section>

        <BlogFeaturedGuidesSection />

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="grid gap-6">
            {posts.map((post) => (
              <article key={post.slug} className="blog-post-card group flex h-full flex-col p-6 sm:p-7">
                <div className="flex h-full flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="blog-post-card-meta">
                      <span className="blog-pill blog-pill-accent">
                        {format(parseISO(post.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="mt-4 max-w-3xl md:pr-6">
                      <h2 className="font-rajdhani text-2xl font-bold leading-tight text-white sm:text-3xl">
                        <Link to={`/blog/${post.slug}/`} className="blog-link-accent">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-sm text-gray-300 md:min-w-[136px] md:flex-col md:items-end md:justify-start md:border-t-0 md:pt-0">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#00CCFF]" />
                      {post.readingTimeMinutes} min
                    </span>
                    <Link
                      to={`/blog/${post.slug}/`}
                      className="blog-link-accent inline-flex items-center gap-2 font-medium text-[#9BE7FF]"
                    >
                      Leer artículo
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
                Recibí nuevos artículos y criterios concretos para mejorar tu web.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                Enviamos una selección breve con análisis, errores frecuentes y oportunidades de conversión para negocios en Argentina. Sin spam y con confirmación por email.
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
