import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, ArrowUp, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBlogArticle } from '@/features/blog/hooks/use-blog-article';
import NewsletterForm from '@/features/newsletter/components/newsletter-form';
import { TUWEBAI_SITE_FULL_URL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

import './blog-pages.css';

interface BlogArticlePageProps {
  slug: string;
}

export default function BlogArticlePage({ slug }: BlogArticlePageProps) {
  const { article, relatedArticles } = useBlogArticle(slug);

  const scrollToArticleTop = () => {
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
  };

  if (!article) {
    return (
      <main className="blog-page-shell px-4 pb-20 pt-28">
        <div className="blog-side-surface mx-auto max-w-3xl p-8 text-center">
          <h1 className="font-rajdhani text-3xl font-bold sm:text-4xl">Articulo no encontrado</h1>
          <p className="mt-4 text-gray-300">El contenido que buscabas no existe o fue movido.</p>
          <Link
            to="/blog/"
            className="blog-primary-button mt-6 px-5 py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const articleUrl = `${TUWEBAI_SITE_FULL_URL}/blog/${article.slug}/`;
  const whatsappMessage = encodeURIComponent(
    `Hola TuWebAI, vengo desde el articulo "${article.title}" y quiero hablar sobre una web que convierta mejor para mi negocio.`,
  );
  const whatsappCtaUrl = `${TUWEBAI_WHATSAPP_URL}?text=${whatsappMessage}`;
  const articleHtml = article.html
    .replace(/^<h1[\s\S]*?<\/h1>\n?/, '')
    .replace(/href="\/consulta"/g, `href="${whatsappCtaUrl}" target="_blank" rel="noopener noreferrer"`);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: TUWEBAI_SITE_FULL_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${TUWEBAI_SITE_FULL_URL}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
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
    author: {
      '@type': 'Organization',
      name: 'TuWeb.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TuWeb.ai',
      logo: {
        '@type': 'ImageObject',
        url: `${TUWEBAI_SITE_FULL_URL}/logo-tuwebai.png`,
      },
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
                <div
                  className="blog-prose"
                  dangerouslySetInnerHTML={{ __html: articleHtml }}
                />

                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="blog-article-newsletter p-6 md:p-8">
                    <span className="blog-pill blog-pill-accent">
                      Newsletter TuWeb.ai
                    </span>
                    <h2 className="mt-4 font-rajdhani text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                      Si este articulo te sirvio, recibi los proximos por email.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
                      Te enviamos nuevas publicaciones, aprendizajes de conversión y recursos técnicos aplicables a negocios reales. Confirmás tu alta por email y podés darte de baja cuando quieras.
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
                    Volver al inicio del articulo
                  </button>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="blog-side-surface-accent p-6">
                <p className="blog-heading-kicker text-xs">Diagnostico gratuito</p>
                <h2 className="mt-3 font-rajdhani text-2xl font-bold text-white sm:text-3xl">Descubrí por qué tu web no convierte.</h2>
                <p className="mt-4 text-sm leading-7 text-gray-300">
                  Si tu sitio recibe tráfico web sin conversiones, revisamos estructura, CTA, mobile y velocidad para decirte qué está frenando las consultas.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={whatsappCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="blog-primary-button px-5 py-3"
                  >
                    Pedir diagnostico
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    to="/servicios/desarrollo-web"
                    className="blog-secondary-button px-5 py-3"
                  >
                    Ver desarrollo web
                  </Link>
                </div>
              </div>

              <div className="blog-side-surface p-6">
                <h2 className="font-rajdhani text-2xl font-bold text-white">Indice del articulo</h2>
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

              {relatedArticles.length > 0 && (
                <div className="blog-side-surface p-6">
                  <h2 className="font-rajdhani text-2xl font-bold text-white">Segui leyendo</h2>
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
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
