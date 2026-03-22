import React from 'react';
import { Helmet } from 'react-helmet';

import {
  TUWEBAI_EMAIL,
  TUWEBAI_INSTAGRAM_URL,
  TUWEBAI_LINKEDIN_URL,
  TUWEBAI_SITE_FULL_URL,
  TUWEBAI_WHATSAPP_TEL,
  TUWEBAI_WHATSAPP_URL,
} from '@/shared/constants/contact';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  ogImage?: string;
  ogType?: string;
  author?: string;
  robots?: string;
  language?: string;
  geoRegion?: string;
  geoPlacename?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  image = '/logo-tuwebai.png',
  url = typeof window !== 'undefined' ? window.location.href : TUWEBAI_SITE_FULL_URL,
  type = 'website',
  twitterCard = 'summary_large_image',
  ogImage,
  ogType,
  author = 'TuWeb.ai',
  robots = 'index, follow',
  language = 'es-AR',
  geoRegion = 'AR',
  geoPlacename = 'Argentina',
  structuredData,
}) => {
  const fullTitle = `${title} | Tuweb.ai`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="language" content={language} />
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />

      <meta property="og:type" content={ogType || type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || image} />
      <meta property="og:site_name" content="TuWeb.ai" />
      <meta property="og:locale" content="es_AR" />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || image} />
      <meta name="twitter:site" content="@tuwebai" />

      <link rel="canonical" href={url} />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#00CCFF" />
      <meta name="msapplication-TileColor" content="#00CCFF" />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'TuWebAI',
          alternateName: ['TuWeb.ai', 'Tuweb AI'],
          url: TUWEBAI_SITE_FULL_URL,
          logo: `${TUWEBAI_SITE_FULL_URL}/logo-tuwebai.png`,
          description:
            'Agencia de desarrollo web profesional en Río Tercero, Córdoba. Webs comerciales, e-commerce y sistemas a medida para negocios argentinos.',
          founder: {
            '@type': 'Person',
            name: 'Juan Esteban López Pachao',
            alternateName: ['Juanchi', 'Juanchi López', 'juanchiidev'],
            jobTitle: 'Fundador y Desarrollador Fullstack',
            url: TUWEBAI_LINKEDIN_URL,
            sameAs: [TUWEBAI_LINKEDIN_URL, TUWEBAI_INSTAGRAM_URL],
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Juan Larrea',
            addressLocality: 'Río Tercero',
            addressRegion: 'Córdoba',
            addressCountry: 'AR',
            postalCode: 'X5850',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -32.1731,
            longitude: -64.1146,
          },
          telephone: TUWEBAI_WHATSAPP_TEL,
          email: TUWEBAI_EMAIL,
          openingHours: 'Mo-Sa 09:00-18:00',
          priceRange: '$$',
          currenciesAccepted: 'ARS',
          paymentAccepted: 'MercadoPago, Transferencia bancaria',
          areaServed: {
            '@type': 'Country',
            name: 'Argentina',
          },
          serviceType: [
            'Desarrollo web',
            'E-commerce',
            'Sistemas web a medida',
            'SEO técnico',
            'Landing pages',
          ],
          sameAs: [TUWEBAI_WHATSAPP_URL, TUWEBAI_INSTAGRAM_URL, TUWEBAI_LINKEDIN_URL],
        })}
      </script>
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default MetaTags;
