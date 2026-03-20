import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, ArrowUp, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBlogArticle } from '@/features/blog/hooks/use-blog-article';
import NewsletterForm from '@/features/newsletter/components/newsletter-form';
import { TUWEBAI_SITE_FULL_URL, TUWEBAI_WHATSAPP_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

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
      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="font-rajdhani text-3xl font-bold sm:text-4xl">Articulo no encontrado</h1>
          <p className="mt-4 text-gray-300">El contenido que buscabas no existe o fue movido.</p>
          <Link
            to="/blog/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-5 py-3 font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  const articleUrl = `${TUWEBAI_SITE_FULL_URL}/blog/${article.slug}`;
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

      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-20 pt-28 text-white">
        <div className="mx-auto max-w-6xl">
          <Link to="/blog/" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,_rgba(18,18,23,0.98),_rgba(10,10,15,0.98))] shadow-2xl shadow-black/30">
              <header id="inicio-articulo-blog" className="border-b border-white/10 px-6 py-8 md:px-10">
                <p className="text-sm uppercase tracking-[0.24em] text-[#9BE7FF]">Blog TuWeb.ai</p>
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
                  className="blog-prose max-w-none text-[15px] leading-7 text-gray-200 sm:text-[17px] sm:leading-8
                    [&_a]:text-[#9BE7FF] [&_a]:underline [&_a]:underline-offset-4
                    [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-1 [&_code]:text-sm
                    [&_em]:text-gray-100 [&_em]:italic
                    [&_h1]:mb-6 [&_h1]:font-rajdhani [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight sm:[&_h1]:text-4xl
                    [&_h2]:mt-10 [&_h2]:mb-5 [&_h2]:font-rajdhani [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-white sm:[&_h2]:text-3xl
                    [&_hr]:my-10 [&_hr]:border-white/10
                    [&_li]:mb-3 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-5 [&_strong]:text-white
                    [&_table]:min-w-full [&_table]:border-collapse [&_table]:text-left [&_tbody_tr]:border-t [&_tbody_tr]:border-white/10
                    [&_td]:border border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top
                    [&_th]:border border-white/10 [&_th]:bg-white/[0.06] [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold [&_th]:text-white
                    [&_ul]:ml-6 [&_ul]:list-disc
                    [&_.blog-score-input]:mx-2 [&_.blog-score-input]:w-16 [&_.blog-score-input]:rounded-lg [&_.blog-score-input]:border [&_.blog-score-input]:border-white/15 [&_.blog-score-input]:bg-white/[0.04] [&_.blog-score-input]:px-2 [&_.blog-score-input]:py-1.5 [&_.blog-score-input]:text-center [&_.blog-score-input]:text-white [&_.blog-score-input]:outline-none [&_.blog-score-input]:transition-colors focus:[&_.blog-score-input]:border-[#00CCFF]/50
                    [&_.blog-table-wrap]:my-8 [&_.blog-table-wrap]:overflow-x-auto [&_.task-list-item]:list-none [&_.task-list-item]:pl-0 [&_.task-list-item]:flex [&_.task-list-item]:items-start [&_.task-list-item]:gap-3
                    [&_.task-list-checkbox]:mt-1 [&_.task-list-checkbox]:h-4 [&_.task-list-checkbox]:w-4 [&_.task-list-checkbox]:accent-[#00CCFF]"
                  dangerouslySetInnerHTML={{ __html: articleHtml }}
                />

                <div className="mt-10 border-t border-white/10 pt-6">
                  <div className="rounded-[28px] border border-[#00CCFF]/20 bg-[radial-gradient(circle_at_left_top,_rgba(0,204,255,0.14),_transparent_32%),radial-gradient(circle_at_right_bottom,_rgba(153,51,255,0.12),_transparent_30%),linear-gradient(180deg,_rgba(16,19,27,0.92),_rgba(10,10,15,0.92))] p-6 md:p-8">
                    <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#9BE7FF]">
                      Newsletter TuWeb.ai
                    </span>
                    <h2 className="mt-4 font-rajdhani text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                      Si este articulo te sirvio, recibi los proximos por email.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
                      Te enviamos nuevas publicaciones, aprendizajes de conversion y recursos tecnicos aplicables a negocios reales. Confirmas tu alta por email y podes darte de baja cuando quieras.
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
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#00CCFF]/40 hover:bg-[#00CCFF]/10"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Volver al inicio del articulo
                  </button>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-[#00CCFF]/20 bg-[#10131b] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9BE7FF]">Diagnostico gratuito</p>
                <h2 className="mt-3 font-rajdhani text-2xl font-bold text-white sm:text-3xl">Descubri por que tu web no convierte.</h2>
                <p className="mt-4 text-sm leading-7 text-gray-300">
                  Si tu sitio recibe trafico web sin conversiones, revisamos estructura, CTA, mobile y velocidad para decirte que esta frenando las consultas.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={whatsappCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] px-5 py-3 font-medium text-white"
                  >
                    Pedir diagnostico
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link
                    to="/servicios/desarrollo-web"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 font-medium text-white transition-colors hover:border-[#00CCFF]/40 hover:bg-white/[0.03]"
                  >
                    Ver desarrollo web
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="font-rajdhani text-2xl font-bold text-white">Indice del articulo</h2>
                <nav className="mt-4">
                  <ul className="space-y-3 text-sm leading-6 text-gray-300">
                    {article.headings
                      .filter((heading) => heading.level === 2)
                      .map((heading) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="transition-colors hover:text-[#9BE7FF]">
                            {heading.text}
                          </a>
                        </li>
                      ))}
                  </ul>
                </nav>
              </div>

              {relatedArticles.length > 0 && (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <h2 className="font-rajdhani text-2xl font-bold text-white">Segui leyendo</h2>
                  <div className="mt-4 space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.slug}
                        to={`/blog/${relatedArticle.slug}`}
                        className="block rounded-2xl border border-white/10 p-4 transition-colors hover:border-[#00CCFF]/40 hover:bg-white/[0.04]"
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
