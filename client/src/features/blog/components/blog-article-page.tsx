import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, ArrowUp, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import BlogArticleInlineCta from '@/features/blog/components/blog-article-inline-cta';
import BlogArticleSidebar from '@/features/blog/components/blog-article-sidebar';
import { useBlogArticle } from '@/features/blog/hooks/use-blog-article';
import NewsletterForm from '@/features/newsletter/components/newsletter-form';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

import './blog-pages.css';

interface BlogArticlePageProps {
  slug: string;
}

function scrollToArticleTop() {
  const articleTopElement = document.getElementById('inicio-articulo-blog');
  const headerOffset = 96;
  const startPosition = window.scrollY;
  const targetPosition = articleTopElement
    ? articleTopElement.getBoundingClientRect().top + window.scrollY - headerOffset
    : 0;
  const distance = targetPosition - startPosition;
  const durationMs = 650;
  const startTime = performance.now();
  const easeInOutCubic = (progress: number) =>
    progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    }
  };

  window.requestAnimationFrame(animateScroll);
}

export default function BlogArticlePage({ slug }: BlogArticlePageProps) {
  const { article, relatedArticles } = useBlogArticle(slug);

  if (!article) {
    return (
      <main className="blog-page-shell px-4 pb-20 pt-28">
        <div className="blog-side-surface mx-auto max-w-3xl p-8 text-center">
          <h1 className="font-rajdhani text-3xl font-bold sm:text-4xl">Artículo no encontrado</h1>
          <p className="mt-4 text-gray-300">El contenido que buscabas no existe o fue movido.</p>
          <Link to="/blog/" className="blog-primary-button mt-6 px-5 py-3">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const articleUrl = `${TUWEBAI_SITE_FULL_URL}/blog/${article.slug}/`;
  const articleHtml = article.html.replace(/^<h1[\s\S]*?<\/h1>\n?/, '');
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: TUWEBAI_SITE_FULL_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${TUWEBAI_SITE_FULL_URL}/blog/` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'es-AR',
    mainEntityOfPage: articleUrl,
    url: articleUrl,
    articleSection: 'Blog',
    keywords: article.keywords.join(', '),
    author: { '@type': 'Organization', name: 'TuWeb.ai' },
    publisher: {
      '@type': 'Organization',
      name: 'TuWeb.ai',
      logo: { '@type': 'ImageObject', url: `${TUWEBAI_SITE_FULL_URL}/logo-tuwebai.png` },
    },
  };

  return (
    <>
      <MetaTags
        title={article.seo.title}
        description={article.description}
        robots={article.noindex ? 'noindex, nofollow' : 'index, follow'}
        keywords={article.keywords.join(', ')}
        url={article.seo.canonicalUrl}
        type="article"
        ogImage={article.seo.ogImage}
        ogType={article.seo.ogType}
        structuredData={[articleSchema, breadcrumbSchema]}
      />

      <main className="blog-page-shell px-4 pb-20 pt-28">
        <div className="mx-auto max-w-6xl">
          <Link to="/blog/" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="blog-article-card">
              <header id="inicio-articulo-blog" className="border-b border-white/10 px-6 py-8 md:px-10">
                <p className="blog-heading-kicker text-sm">Blog TuWeb.ai</p>
                <h1 className="mt-4 font-rajdhani text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{article.title}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>{format(parseISO(article.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[#00CCFF]" />
                    {article.readingTimeMinutes} min de lectura
                  </span>
                </div>
              </header>

              <div className="px-6 py-8 md:px-10">
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: articleHtml }} />

                <BlogArticleInlineCta articleTitle={article.title} />

                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="blog-article-newsletter p-6 md:p-8">
                    <span className="blog-pill blog-pill-accent">Newsletter TuWeb.ai</span>
                    <h2 className="mt-4 font-rajdhani text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                      Si este artículo te sirvió, recibí los próximos por email.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
                      Te enviamos nuevas publicaciones y criterios útiles para mejorar tu web. Confirmás tu alta por email y podés darte de baja cuando quieras.
                    </p>
                    <div className="mt-6 max-w-2xl">
                      <NewsletterForm
                        source={`blog-article:${article.slug}`}
                        buttonText="Quiero recibirlos"
                        inputPlaceholder="tuemail@negocio.com"
                        disclaimerClassName="text-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={scrollToArticleTop}
                    className="blog-secondary-button mt-6 px-5 py-3 text-sm"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Volver al inicio del artículo
                  </button>
                </div>
              </div>
            </article>

            <BlogArticleSidebar article={article} relatedArticles={relatedArticles} />
          </div>
        </div>
      </main>
    </>
  );
}
