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
  { url: '/nosotros', changefreq: 'monthly', priority: '0.8', lastmod: '2026-03-22' },
  { url: '/proceso', changefreq: 'monthly', priority: '0.8', lastmod: '2026-03-22' },
  { url: '/corporativos', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/uxui', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/ecommerce', changefreq: 'monthly', priority: '0.9', lastmod: '2024-12-15' },
  { url: '/consulta', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/diagnostico-gratuito', changefreq: 'monthly', priority: '0.9', lastmod: '2026-03-22' },
  { url: '/checklist-web-gratis', changefreq: 'monthly', priority: '0.8', lastmod: '2026-03-22' },
  { url: '/servicios/desarrollo-web', changefreq: 'monthly', priority: '0.8', lastmod: '2024-12-15' },
  { url: '/faq', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/contacto', changefreq: 'monthly', priority: '0.7', lastmod: '2024-12-15' },
  { url: '/terminos-condiciones', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
  { url: '/politica-privacidad', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
  { url: '/politica-cookies', changefreq: 'yearly', priority: '0.3', lastmod: '2024-12-15' },
];

const staticRouteHead = {
  '/nosotros': {
    title: 'Nosotros - Juanchi López, Desarrollador Web Córdoba',
    description:
      'Conocé a Juanchi, fundador de TuWebAI. Desarrollador fullstack de Río Tercero, Córdoba. Casi 6 años construyendo webs que venden para negocios argentinos.',
    keywords:
      'nosotros tuwebai, juanchi lópez, juanchiidev, juan esteban lópez, desarrollador web córdoba, desarrollo web argentina',
    url: `${siteUrl}/nosotros`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/proceso': {
    title: 'Proceso de Trabajo | TuWebAI - Cómo Construimos tu Proyecto Web',
    description:
      'Conocé las 5 etapas del proceso de TuWebAI: consulta, propuesta, desarrollo, revisión y lanzamiento. Tiempos reales, entregables concretos y sin sorpresas al final.',
    keywords:
      'proceso de trabajo TuWebAI, cómo trabajamos en TuWebAI, etapas proyecto web, desarrollo web Argentina, entregables proyecto web',
    url: `${siteUrl}/proceso`,
    ogType: 'website',
    ogImage: defaultOgImage,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'Cómo trabajamos en TuWebAI',
        description: 'Proceso de 5 etapas para desarrollar un proyecto web profesional',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Consulta inicial',
            text: 'Una llamada de 20 a 30 minutos para entender el proyecto.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Propuesta y alcance',
            text: 'Propuesta escrita con precio cerrado y cronograma.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Diseño y desarrollo',
            text: 'Construcción completa del proyecto en 2 a 4 semanas según tipo.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Revisión y ajustes',
            text: 'Una ronda de revisión completa incluida en todos los planes.',
          },
          {
            '@type': 'HowToStep',
            position: 5,
            name: 'Lanzamiento y entrega',
            text: 'Deploy en producción y entrega de todos los accesos al cliente.',
          },
        ],
      },
    ],
  },
  '/corporativos': {
    title: 'Sitios Web Corporativos',
    description:
      'Webs corporativas a medida para empresas argentinas. Diseño profesional, SEO técnico y optimización para convertir visitas en consultas. Desde $420.000 ARS.',
    keywords:
      'sitios web corporativos, desarrollo web Córdoba, webs corporativas Argentina, SEO técnico, TuWebAI',
    url: `${siteUrl}/corporativos`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/uxui': {
    title: 'Diseño UX/UI Web',
    description:
      'Diseño de interfaces web centradas en conversión. Wireframes, prototipos y diseño visual alineado al objetivo comercial del negocio.',
    keywords:
      'diseño UX UI web, interfaces que convierten, wireframes, prototipos, diseño visual, TuWebAI',
    url: `${siteUrl}/uxui`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/ecommerce': {
    title: 'E-commerce a Medida',
    description:
      'Tiendas online con MercadoPago integrado, panel de stock y checkout optimizado. Desarrollo e-commerce a medida para negocios argentinos. Sin plugins. Código real.',
    keywords:
      'e-commerce a medida, tiendas online Argentina, MercadoPago integrado, checkout optimizado, TuWebAI',
    url: `${siteUrl}/ecommerce`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/consulta': {
    title: 'Consulta y propuesta inicial',
    description:
      'Contanos qué necesita tu negocio y te respondemos con un diagnóstico claro. Consulta inicial sin cargo para webs, e-commerce y sistemas a medida.',
    keywords:
      'consulta desarrollo web, propuesta web, diagnóstico gratuito, proyecto web Argentina, TuWebAI',
    url: `${siteUrl}/consulta`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/diagnostico-gratuito': {
    title: 'Diagnóstico Web Gratuito | TuWebAI — Descubrí qué falla en tu sitio',
    description:
      'Revisamos tu web sin cargo y te decimos exactamente qué está frenando tus consultas. Velocidad, conversión y SEO básico. Sin compromiso. Respondemos en menos de 24 horas.',
    ogTitle: 'Diagnóstico Web Gratuito | TuWebAI',
    ogDescription: 'Descubrí qué está frenando las consultas de tu web. Sin cargo, sin compromiso.',
    twitterTitle: 'Diagnóstico Web Gratuito | TuWebAI',
    twitterDescription: 'Descubrí qué está frenando las consultas de tu web.',
    ogSiteName: 'TuWebAI',
    keywords:
      'diagnóstico web gratuito, auditoría web inicial, velocidad web, conversión web, SEO básico, TuWebAI',
    url: `${siteUrl}/diagnostico-gratuito`,
    ogType: 'website',
    ogImage: defaultOgImage,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Diagnóstico Web Gratuito',
        alternateName: 'Diagnóstico gratuito de sitio web',
        provider: {
          '@type': 'LocalBusiness',
          name: 'TuWebAI',
          url: siteUrl,
        },
        description:
          'Revisión gratuita del sitio web para identificar problemas de velocidad, conversión y SEO básico. Sin cargo y sin compromiso.',
        url: `${siteUrl}/diagnostico-gratuito`,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'ARS',
          availability: 'https://schema.org/InStock',
          description: 'Diagnóstico gratuito sin cargo ni compromiso',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Argentina',
        },
        serviceType: 'Diagnóstico web',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Qué incluye el diagnóstico',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Análisis de velocidad de carga',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Revisión de conversión y CTA',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Diagnóstico SEO básico',
              },
            },
          ],
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿El diagnóstico es realmente gratis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí, completamente gratis y sin compromiso. No hay ningún costo oculto ni obligación de contratar después.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Cuánto tarda en llegar el diagnóstico?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Respondemos en menos de 24 horas hábiles con un resumen de los principales problemas encontrados.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué incluye el diagnóstico gratuito?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Revisamos velocidad de carga en mobile, elementos de conversión y diagnóstico SEO básico para detectar qué frena las consultas.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Necesito tener una web para pedir el diagnóstico?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Si no tenés web todavía, igualmente podemos evaluar tu presencia digital actual y recomendarte el mejor punto de partida.',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Diagnóstico gratuito',
            item: `${siteUrl}/diagnostico-gratuito`,
          },
        ],
      },
    ],
  },
  '/checklist-web-gratis': {
    title: 'Checklist Web Gratis | TuWebAI - 35 puntos para auditar tu sitio',
    description:
      'Descarg\u00e1 gratis el checklist de 35 puntos que usamos en TuWebAI para auditar sitios web. Velocidad, mobile, conversi\u00f3n, SEO y analytics. Usalo online o descargalo en PDF. Sin registro obligatorio.',
    ogTitle: 'Checklist Web Gratis | TuWebAI - 35 puntos para auditar tu sitio',
    ogDescription: 'El checklist que usamos para auditar sitios web. 35 puntos, 7 categor\u00edas, resultado instant\u00e1neo.',
    twitterTitle: 'Checklist Web Gratis | TuWebAI',
    twitterDescription: '35 puntos para saber si tu web est\u00e1 lista para vender.',
    ogSiteName: 'TuWebAI',
    keywords:
      'checklist web gratis, auditor\u00eda web, checklist sitio web, conversi\u00f3n web, seo t\u00e9cnico, TuWebAI',
    url: `${siteUrl}/checklist-web-gratis`,
    ogType: 'website',
    ogImage: defaultOgImage,
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'C\u00f3mo auditar tu sitio web en 10 minutos',
        description:
          'Checklist de 35 puntos para evaluar velocidad, mobile, conversi\u00f3n, SEO y analytics de cualquier sitio web argentino.',
        totalTime: 'PT10M',
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'ARS',
          value: '0',
        },
        step: [
          {
            '@type': 'HowToSection',
            name: 'Velocidad y performance',
            position: 1,
            url: `${siteUrl}/checklist-web-gratis#velocidad`,
            itemListElement: [
              { '@type': 'HowToStep', position: 1, text: 'Verificar que la web carga en menos de 3 segundos en mobile' },
              { '@type': 'HowToStep', position: 2, text: 'Comprimir im\u00e1genes y convertir a formato WebP' },
              { '@type': 'HowToStep', position: 3, text: 'Eliminar scripts de terceros bloqueantes' },
              { '@type': 'HowToStep', position: 4, text: 'Medir el puntaje de PageSpeed en mobile' },
              { '@type': 'HowToStep', position: 5, text: 'Verificar que las fuentes cargan con display=swap' },
            ],
          },
          {
            '@type': 'HowToSection',
            name: 'Mobile y responsive',
            position: 2,
            url: `${siteUrl}/checklist-web-gratis#mobile`,
            itemListElement: [
              { '@type': 'HowToStep', position: 1, text: 'Verificar el dise\u00f1o en pantallas de 375px de ancho' },
              { '@type': 'HowToStep', position: 2, text: 'Comprobar que los botones tienen \u00e1rea t\u00e1ctil suficiente' },
              { '@type': 'HowToStep', position: 3, text: 'Confirmar que el texto es legible sin zoom' },
              { '@type': 'HowToStep', position: 4, text: 'Probar los formularios desde el teclado del celular' },
              { '@type': 'HowToStep', position: 5, text: 'Verificar que no hay elementos superpuestos en mobile' },
            ],
          },
          {
            '@type': 'HowToSection',
            name: 'Conversi\u00f3n y CTAs',
            position: 3,
            url: `${siteUrl}/checklist-web-gratis#conversion`,
            itemListElement: [
              { '@type': 'HowToStep', position: 1, text: 'Verificar CTA visible sin scroll en la home' },
              { '@type': 'HowToStep', position: 2, text: 'Comprobar que el CTA describe qu\u00e9 pasa al hacer clic' },
              { '@type': 'HowToStep', position: 3, text: 'Confirmar que el formulario tiene 5 campos o menos' },
              { '@type': 'HowToStep', position: 4, text: 'Verificar que el negocio se entiende en 5 segundos' },
              { '@type': 'HowToStep', position: 5, text: 'Comprobar que hay un bot\u00f3n de WhatsApp siempre visible' },
            ],
          },
          {
            '@type': 'HowToSection',
            name: 'SEO b\u00e1sico',
            position: 4,
            url: `${siteUrl}/checklist-web-gratis#seo`,
            itemListElement: [
              { '@type': 'HowToStep', position: 1, text: 'Verificar t\u00edtulos \u00fanicos en cada p\u00e1gina' },
              { '@type': 'HowToStep', position: 2, text: 'Confirmar meta descriptions \u00fanicas' },
              { '@type': 'HowToStep', position: 3, text: 'Verificar sitemap.xml enviado a Search Console' },
              { '@type': 'HowToStep', position: 4, text: 'Confirmar verificaci\u00f3n en Google Search Console' },
              { '@type': 'HowToStep', position: 5, text: 'Verificar Google Business Profile completo' },
            ],
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: '\u00bfEl checklist es realmente gratis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'S\u00ed, completamente gratis. Pod\u00e9s usarlo online sin registro o descargarlo en PDF dejando tu email.',
            },
          },
          {
            '@type': 'Question',
            name: '\u00bfPara qu\u00e9 tipo de sitio web sirve este checklist?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Para cualquier sitio web de negocio: tiendas online, sitios corporativos, profesionales independientes o sistemas web. Los 35 puntos aplican a cualquier web que quiera generar consultas o ventas.',
            },
          },
          {
            '@type': 'Question',
            name: '\u00bfNecesito conocimientos t\u00e9cnicos para usarlo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. El checklist est\u00e1 escrito en lenguaje simple para que cualquier due\u00f1o de negocio pueda completarlo sin ayuda t\u00e9cnica.',
            },
          },
          {
            '@type': 'Question',
            name: '\u00bfQu\u00e9 hago si encuentro problemas en el checklist?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pod\u00e9s pedir un diagn\u00f3stico gratuito en TuWebAI donde revisamos los problemas identificados y te decimos c\u00f3mo resolverlos.',
            },
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Recursos',
            item: `${siteUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Checklist web gratis',
            item: `${siteUrl}/checklist-web-gratis`,
          },
        ],
      },
    ],
  },

  '/servicios/desarrollo-web': {
    title: 'Desarrollo Web Profesional',
    description:
      'Desarrollo web profesional para negocios argentinos: sitios corporativos, landing pages optimizadas y tecnología a medida para convertir visitas en clientes.',
    keywords:
      'desarrollo web profesional, desarrollo web argentina, landing pages optimizadas, sitios corporativos, TuWebAI',
    url: `${siteUrl}/servicios/desarrollo-web`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/faq': {
    title: 'Preguntas Frecuentes',
    description:
      'Respondemos las dudas más comunes antes de arrancar: tiempos de entrega, precios, qué incluye cada plan y qué pasa después del lanzamiento.',
    keywords:
      'preguntas frecuentes TuWebAI, tiempos de entrega, precios desarrollo web, planes web, soporte',
    url: `${siteUrl}/faq`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/contacto': {
    title: 'Contacto',
    description:
      'Consulta gratuita sin compromiso. Contanos qué necesita tu negocio y te respondemos en menos de 24 horas. Río Tercero, Córdoba. Atención lunes a sábado.',
    keywords:
      'contacto TuWebAI, consulta gratuita, proyecto web, Río Tercero, Córdoba',
    url: `${siteUrl}/contacto`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/terminos-condiciones': {
    title: 'Términos y Condiciones',
    description:
      'Leé las condiciones de uso, contratación, pagos y propiedad intelectual que rigen los servicios de TuWebAI.',
    keywords:
      'términos y condiciones, contratación web, pagos TuWebAI, propiedad intelectual',
    url: `${siteUrl}/terminos-condiciones`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/politica-privacidad': {
    title: 'Política de Privacidad',
    description:
      'Conocé cómo TuWebAI recopila, usa y protege tus datos personales al navegar o contratar nuestros servicios.',
    keywords:
      'política de privacidad, protección de datos, tratamiento de datos personales, TuWebAI',
    url: `${siteUrl}/politica-privacidad`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
  '/politica-cookies': {
    title: 'Política de Cookies',
    description:
      'Información técnica sobre las cookies que usa TuWebAI, para qué sirven y cómo podés administrarlas.',
    keywords:
      'política de cookies, cookies TuWebAI, cookies sitio web, preferencias de cookies',
    url: `${siteUrl}/politica-cookies`,
    ogType: 'website',
    ogImage: defaultOgImage,
  },
};

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
  return html.replace(
    /<!-- APP_PRERENDER_FALLBACK_START -->[\s\S]*?<!-- APP_PRERENDER_FALLBACK_END -->/i,
    `<div id="prerendered-content">${prerenderedContent}</div>`,
  );
}

function deferSpaBootstrap(html) {
  const moduleScriptMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/i);

  if (!moduleScriptMatch) {
    return html;
  }

  const moduleSrc = moduleScriptMatch[1];
  const deferredBootstrapScript = `
    <script>
      (() => {
        let bootstrapped = false;
        let idleHandle = null;
        let timeoutHandle = null;
        const start = () => {
          if (bootstrapped) return;
          bootstrapped = true;
          window.removeEventListener('pointerdown', start, passiveOptions);
          window.removeEventListener('touchstart', start, passiveOptions);
          window.removeEventListener('keydown', start);
          window.removeEventListener('scroll', start, passiveOptions);
          if (idleHandle !== null && 'cancelIdleCallback' in window) {
            window.cancelIdleCallback(idleHandle);
          }
          if (timeoutHandle !== null) {
            window.clearTimeout(timeoutHandle);
          }
          import('${moduleSrc}');
        };
        const passiveOptions = { passive: true, once: true };
        window.addEventListener('pointerdown', start, passiveOptions);
        window.addEventListener('touchstart', start, passiveOptions);
        window.addEventListener('keydown', start, { once: true });
        window.addEventListener('scroll', start, passiveOptions);
        if ('requestIdleCallback' in window) {
          idleHandle = window.requestIdleCallback(start, { timeout: 2500 });
        } else {
          timeoutHandle = window.setTimeout(start, 2500);
        }
      })();
    </script>
  `;

  return html
    .replace(moduleScriptMatch[0], '')
    .replace('</body>', `${deferredBootstrapScript}\n  </body>`);
}

function applyHeadMetadata(html, metadata) {
  let nextHtml = html;
  const ogTitle = metadata.ogTitle ?? metadata.title;
  const ogDescription = metadata.ogDescription ?? metadata.description;
  const twitterTitle = metadata.twitterTitle ?? ogTitle;
  const twitterDescription = metadata.twitterDescription ?? ogDescription;
  const ogSiteName = metadata.ogSiteName ?? 'TuWeb.ai';

  nextHtml = replaceTag(nextHtml, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${escapeHtml(metadata.keywords)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${metadata.robots}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${metadata.ogType}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${metadata.url}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${metadata.ogImage}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:site_name" content="${escapeHtml(ogSiteName)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${metadata.url}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(twitterTitle)}" />`);
  nextHtml = replaceTag(nextHtml, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(twitterDescription)}" />`);
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

function renderHomePageContent() {
  return `
    <main style="min-height:100vh;background:
      radial-gradient(circle at top left, rgba(0, 204, 255, 0.16), transparent 32%),
      radial-gradient(circle at top right, rgba(153, 51, 255, 0.14), transparent 28%),
      linear-gradient(to bottom, #0a0a0f, #121320);color:#fff;font-family:Inter,sans-serif;">
      <section style="max-width:1200px;margin:0 auto;padding:120px 24px 80px;">
        <div style="max-width:760px;">
          <div style="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:10px 18px;margin-bottom:24px;background:rgba(255,255,255,.04);color:#d1d5db;font-size:14px;font-weight:500;">
            <span style="width:8px;height:8px;border-radius:999px;background:#00CCFF;box-shadow:0 0 10px rgba(0,204,255,.8);display:inline-block;"></span>
            Diseñamos el futuro de tu negocio
          </div>
          <div style="margin-bottom:18px;color:#9BE7FF;font-family:Rajdhani,sans-serif;font-size:20px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;">
            TuWeb.ai
          </div>
          <h1 style="margin:0;font-family:Rajdhani,sans-serif;font-size:clamp(52px,8vw,88px);line-height:.96;font-weight:700;max-width:980px;">
            Desarrollo web profesional para negocios que quieren <span style="background:linear-gradient(90deg,#00CCFF,#9933FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">vender mejor online</span>
          </h1>
          <p style="margin:28px 0 0;color:#d1d5db;font-size:20px;line-height:1.8;max-width:700px;">
            Creamos sitios web, e-commerce y sistemas web que transmiten confianza, cargan rápido y convierten visitas en oportunidades reales.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:34px;">
            <a href="/consulta" style="display:inline-flex;align-items:center;justify-content:center;min-width:220px;padding:14px 24px;border-radius:999px;background:linear-gradient(90deg,#00CCFF,#9933FF);color:#fff;font-size:16px;font-weight:600;text-decoration:none;box-shadow:0 10px 30px rgba(0,204,255,.22);">
              Contar mi proyecto
            </a>
            <a href="/#showroom" style="display:inline-flex;align-items:center;justify-content:center;min-width:220px;padding:14px 24px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#e5e7eb;font-size:16px;font-weight:500;text-decoration:none;">
              Ver proyectos reales
            </a>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:28px;color:#d1d5db;font-size:14px;">
            <span style="border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:10px 16px;background:rgba(255,255,255,.05);">Sitios corporativos</span>
            <span style="border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:10px 16px;background:rgba(255,255,255,.05);">E-commerce</span>
            <span style="border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:10px 16px;background:rgba(255,255,255,.05);">Sistemas web</span>
          </div>
        </div>
      </section>

      <section style="max-width:1200px;margin:0 auto;padding:0 24px 48px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;">
          <article style="border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:24px;background:rgba(18,18,23,.72);">
            <h2 style="font-family:Rajdhani,sans-serif;font-size:28px;line-height:1.1;margin:0 0 12px;">Sitios corporativos</h2>
            <p style="margin:0;color:#d4d4d8;font-size:17px;line-height:1.7;">Webs profesionales para empresas que necesitan transmitir confianza, presentar mejor su oferta y generar consultas reales.</p>
          </article>
          <article style="border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:24px;background:rgba(18,18,23,.72);">
            <h2 style="font-family:Rajdhani,sans-serif;font-size:28px;line-height:1.1;margin:0 0 12px;">E-commerce</h2>
            <p style="margin:0;color:#d4d4d8;font-size:17px;line-height:1.7;">Tiendas online rápidas, claras y preparadas para convertir mejor, facilitar la compra y sostener crecimiento sin fricción técnica.</p>
          </article>
          <article style="border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:24px;background:rgba(18,18,23,.72);">
            <h2 style="font-family:Rajdhani,sans-serif;font-size:28px;line-height:1.1;margin:0 0 12px;">Sistemas web</h2>
            <p style="margin:0;color:#d4d4d8;font-size:17px;line-height:1.7;">Plataformas, paneles y flujos web a medida para ordenar procesos, integrar herramientas y operar con más claridad.</p>
          </article>
        </div>
      </section>

      <section style="max-width:1200px;margin:0 auto;padding:0 24px 96px;">
        <div style="border:1px solid rgba(255,255,255,.08);border-radius:28px;padding:32px;background:linear-gradient(180deg,rgba(18,18,23,.98),rgba(10,10,15,.98));">
          <p style="margin:0 0 12px;color:#9BE7FF;font-size:13px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;">Cómo trabajamos</p>
          <h2 style="margin:0 0 16px;font-family:Rajdhani,sans-serif;font-size:42px;line-height:1.05;">Una base seria para crecer sin improvisaciones</h2>
          <ol style="margin:0;padding-left:20px;color:#d4d4d8;font-size:18px;line-height:1.9;">
            <li>Entendemos el negocio y el objetivo real antes de definir alcance.</li>
            <li>Diseñamos la solución web correcta según operación, oferta y conversión.</li>
            <li>Desarrollamos con foco en rendimiento, claridad y mantenibilidad.</li>
            <li>Lanzamos una plataforma preparada para seguir evolucionando.</li>
          </ol>
        </div>
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
      url: `${siteUrl}/blog/`,
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

function buildHomeStructuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TuWeb.ai - Desarrollo Web Profesional para Negocios en Argentina',
      description:
        'Desarrollamos sitios web, e-commerce y sistemas web para negocios que necesitan una presencia digital profesional, confiable y preparada para vender.',
      url: siteUrl,
      inLanguage: 'es-AR',
      isPartOf: {
        '@type': 'WebSite',
        name: 'TuWeb.ai',
        url: siteUrl,
      },
      about: {
        '@type': 'Organization',
        name: 'TuWeb.ai',
        url: siteUrl,
      },
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
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog/` },
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
  lines.push(`    <loc>${siteUrl}/blog/</loc>`);
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
  const deferredIndexHtml = deferSpaBootstrap(indexHtml);

  const blogIndexHtml = applyHeadMetadata(
    deferSpaBootstrap(injectPrerenderContent(indexHtml, renderListPageContent(publicPosts))),
    {
      title: 'Blog de Desarrollo Web y Conversion | TuWeb.ai',
      description: 'Guias de TuWeb.ai sobre conversion web, SEO tecnico y crecimiento digital para negocios en Argentina.',
      keywords: 'blog desarrollo web argentina, blog conversion web, seo tecnico argentina, tuwebai blog',
      robots: 'index, follow',
      url: `${siteUrl}/blog/`,
      ogType: 'website',
      ogImage: defaultOgImage,
      structuredData: buildListStructuredData(publicPosts),
    },
  );

  await writePage('blog', blogIndexHtml);

  for (const [route, metadata] of Object.entries(staticRouteHead)) {
    const routeHtml = applyHeadMetadata(deferredIndexHtml, {
      ...metadata,
      robots: 'index, follow',
      structuredData: metadata.structuredData ?? [],
    });

    await writePage(route === '/' ? '' : route.slice(1), routeHtml);
  }

  for (const article of publicPosts) {
    const articleHtml = applyHeadMetadata(
      deferSpaBootstrap(injectPrerenderContent(indexHtml, renderArticlePageContent(article))),
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
