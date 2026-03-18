import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBlogPosts } from '@/features/blog/hooks/use-blog-posts';
import { TUWEBAI_SITE_FULL_URL } from '@/shared/constants/contact';
import MetaTags from '@/shared/ui/meta-tags';

export default function BlogListPage() {
  const posts = useBlogPosts().filter((post) => !post.noindex);
  const pageUrl = `${TUWEBAI_SITE_FULL_URL}/blog`;
  const publishedArticlesLabel = `${posts.length} articulos publicados`;

  return (
    <>
      <MetaTags
        title="Blog de Desarrollo Web y Conversion"
        description="Guias de TuWeb.ai sobre conversion web, SEO tecnico y crecimiento digital para negocios en Argentina."
        keywords="blog desarrollo web argentina, blog conversion web, seo tecnico argentina, tuwebai blog"
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

      <main className="min-h-screen bg-[#0a0a0f] px-4 pb-20 pt-28 text-white">
        <section className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(0,204,255,0.18),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(153,51,255,0.14),_transparent_32%),linear-gradient(180deg,_rgba(18,18,23,0.98),_rgba(10,10,15,0.98))] px-6 py-12 shadow-2xl shadow-black/30 md:px-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[#00CCFF]/30 bg-[#00CCFF]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#9BE7FF]">
                Blog TuWeb.ai
              </span>
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-gray-300">
                {publishedArticlesLabel}
              </span>
            </div>
            <h1 className="mt-6 max-w-3xl font-rajdhani text-4xl font-bold leading-tight text-white md:text-6xl">
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
                className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00CCFF]/40 hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm text-gray-400">
                      {format(parseISO(post.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    <h2 className="mt-3 font-rajdhani text-3xl font-bold text-white">
                      <Link to={`/blog/${post.slug}`} className="transition-colors group-hover:text-[#9BE7FF]">
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#00CCFF]/40 hover:bg-[#00CCFF]/10"
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
      </main>
    </>
  );
}
