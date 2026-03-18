import fs from 'node:fs/promises';
import path from 'node:path';

import { buildBlogPosts } from './blog-content-utils.mjs';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const docsDir = path.join(projectRoot, 'docs-blogs');
const siteUrl = 'https://tuweb-ai.com';
const defaultOgImage = `${siteUrl}/logo-tuwebai.png`;

const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: '1.0', lastmod: '2024-12-19' },
  { url: '/corporativos', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/uxui', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/ecommerce', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/consulta', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/servicios/consultoria-estrategica', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/servicios/desarrollo-web', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/servicios/posicionamiento-marketing', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/servicios/automatizacion-marketing', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/faq', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/equipo', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/tecnologias', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/estudio', changefreq: 'monthly', priority: '0.6', lastmod: '2024-12-15' },
  { url: '/panel', changefreq: 'monthly', priority: '0.5', lastmod: '2024-12-15' },
  { url: '/pago-exitoso', changefreq: 'monthly', priority: '0.4', lastmod: '2024-12-15' },
  { url: '/pago-fallido', changefreq: 'monthly', priority: '0.4', lastmod: '2024-12-15' },
  { url: '/pago-pendiente', changefreq: 'monthly', priority: '0.4', lastmod: '2024-12-15' },
  { url: '/contacto', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/terminos-condiciones', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
  { url: '/politica-privacidad', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
  { url: '/politica-cookies', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function replaceTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function injectPrerenderContent(html, prerenderedContent) {
  return html.replace('<div id="root">', `<div id="root"><div id="prerendered-content">${prerenderedContent}</div>`);
}

function applyHeadMetadata(html, metadata) {
  let nextHtml = html;

  nextHtml = replaceTag(nextHtml, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${escapeHtml(metadata.keywords)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${metadata.robots}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${metadata.ogType}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${metadata.url}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${metadata.ogImage}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${metadata.url}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${metadata.ogImage}" />`);
  nextHtml = replaceTag(nextHtml, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${metadata.url}" />`);

  const structuredDataScripts = metadata.structuredData
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n    ');

  nextHtml = nextHtml.replace('</head>', `    ${structuredDataScripts}\n  </head>`);

  return nextHtml;
}

function renderListPageContent(posts) {
  const publishedArticlesLabel = `${posts.length} articulos publicados`;
  const items = posts
    .map(
      (post) => `
        <article style="border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:24px;background:rgba(255,255,255,.03);margin-bottom:24px;">
          <p style="color:#a3a3a3;font-size:14px;">${escapeHtml(post.publishedAt.slice(0, 10))}</p>
          <h2 style="font-size:32px;line-height:1.15;margin:12px 0 16px;">
            <a href="/blog/${post.slug}" style="color:#fff;text-decoration:none;">${escapeHtml(post.title)}</a>
          </h2>
          <p style="font-size:18px;line-height:1.7;color:#d4d4d8;">${escapeHtml(post.excerpt)}</p>
        </article>`,
    )
    .join('\n');

  return `
    <main style="min-height:100vh;background:#0a0a0f;color:#fff;padding:120px 16px 80px;font-family:Inter,sans-serif;">
      <section style="max-width:960px;margin:0 auto;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:0 0 24px;">
          <span style="display:inline-flex;border:1px solid rgba(0,204,255,.3);background:rgba(0,204,255,.1);padding:8px 16px;border-radius:999px;font-size:12px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#9BE7FF;">
            Blog TuWeb.ai
          </span>
          <span style="display:inline-flex;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);padding:8px 16px;border-radius:999px;font-size:12px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#d4d4d8;">
            ${escapeHtml(publishedArticlesLabel)}
          </span>
        </div>
        <h1 style="font-family:Rajdhani,sans-serif;font-size:56px;line-height:1.05;margin:0 0 16px;">Recursos para corregir una web que no convierte y vender mejor.</h1>
        <p style="max-width:720px;font-size:20px;line-height:1.7;color:#d4d4d8;margin:0 0 40px;">
          Recursos para corregir una web que no convierte, mejorar SEO tecnico y crecer con estrategia digital en Argentina.
        </p>
        ${items}
      </section>
    </main>`;
}

function renderArticlePageContent(article) {
  const articleBodyHtml = article.html.replace(/^<h1[\s\S]*?<\/h1>\n?/, '');

  return `
    <main style="min-height:100vh;background:#0a0a0f;color:#fff;padding:120px 16px 80px;font-family:Inter,sans-serif;">
      <article style="max-width:960px;margin:0 auto;border:1px solid rgba(255,255,255,.1);border-radius:28px;background:linear-gradient(180deg,rgba(18,18,23,.98),rgba(10,10,15,.98));overflow:hidden;">
        <header style="padding:40px;border-bottom:1px solid rgba(255,255,255,.1);">
          <p style="font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:#9BE7FF;margin:0 0 12px;">Blog TuWeb.ai</p>
          <h1 style="font-family:Rajdhani,sans-serif;font-size:52px;line-height:1.05;margin:0 0 16px;">${escapeHtml(article.title)}</h1>
          <p style="color:#a3a3a3;font-size:15px;margin:0;">${escapeHtml(article.publishedAt.slice(0, 10))}</p>
        </header>
        <section style="padding:40px;font-size:18px;line-height:1.8;color:#e4e4e7;">
          ${articleBodyHtml}
        </section>
      </article>
    </main>`;
}

function buildListStructuredData(posts) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Blog TuWeb.ai',
      description: 'Guias y articulos sobre conversion web, SEO tecnico y estrategia digital en Argentina.',
      url: `${siteUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'TuWeb.ai',
        url: siteUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  ];
}

function buildArticleStructuredData(article) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      inLanguage: 'es-AR',
      mainEntityOfPage: article.seo.canonicalUrl,
      url: article.seo.canonicalUrl,
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
          url: defaultOgImage,
        },
      },
      image: article.seo.ogImage,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: article.title, item: article.seo.canonicalUrl },
      ],
    },
  ];
}

async function writePage(relativePath, html) {
  const targetDirectory = path.join(distDir, relativePath);
  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.writeFile(path.join(targetDirectory, 'index.html'), html, 'utf8');
}

function buildSitemapXml(posts) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const route of staticRoutes) {
    lines.push('  <url>');
    lines.push(`    <loc>${siteUrl}${route.url}</loc>`);
    lines.push(`    <lastmod>${route.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push('  </url>');
  }

  lines.push('  <url>');
  lines.push(`    <loc>${siteUrl}/blog</loc>`);
  lines.push(`    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`);
  lines.push('    <changefreq>weekly</changefreq>');
  lines.push('    <priority>0.85</priority>');
  lines.push('  </url>');

  for (const post of posts.filter((article) => !article.noindex)) {
    lines.push('  <url>');
    lines.push(`    <loc>${post.seo.canonicalUrl}</loc>`);
    lines.push(`    <lastmod>${post.updatedAt.slice(0, 10)}</lastmod>`);
    lines.push('    <changefreq>monthly</changefreq>');
    lines.push('    <priority>0.8</priority>');
    lines.push('  </url>');
  }

  lines.push('</urlset>');

  return lines.join('\n');
}

async function main() {
  const posts = buildBlogPosts(docsDir);
  const publicPosts = posts.filter((post) => !post.noindex);
  const indexHtml = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

  const blogIndexHtml = applyHeadMetadata(
    injectPrerenderContent(indexHtml, renderListPageContent(publicPosts)),
    {
      title: 'Blog de Desarrollo Web y Conversion | TuWeb.ai',
      description: 'Guias de TuWeb.ai sobre conversion web, SEO tecnico y crecimiento digital para negocios en Argentina.',
      keywords: 'blog desarrollo web argentina, blog conversion web, seo tecnico argentina, tuwebai blog',
      robots: 'index, follow',
      url: `${siteUrl}/blog`,
      ogType: 'website',
      ogImage: defaultOgImage,
      structuredData: buildListStructuredData(publicPosts),
    },
  );

  await writePage('blog', blogIndexHtml);

  for (const article of publicPosts) {
    const articleHtml = applyHeadMetadata(
      injectPrerenderContent(indexHtml, renderArticlePageContent(article)),
      {
        title: `${article.seo.title} | Tuweb.ai`,
        description: article.seo.description,
        keywords: article.keywords.join(', '),
        robots: article.noindex ? 'noindex, nofollow' : 'index, follow',
        url: article.seo.canonicalUrl,
        ogType: article.seo.ogType,
        ogImage: article.seo.ogImage,
        structuredData: buildArticleStructuredData(article),
      },
    );

    await writePage(path.join('blog', article.slug), articleHtml);
  }

  await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(posts), 'utf8');

  console.log(`Prerender blog completado: ${publicPosts.length} articulo(s) y sitemap actualizado.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
