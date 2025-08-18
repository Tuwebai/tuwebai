import React from 'react';
import { Helmet } from 'react-helmet';

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
}

/**
 * Componente para manejar metadatos SEO en las páginas
 */
const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  image = '/logo-tuwebai.png',
  url = window.location.href,
  type = 'website',
  twitterCard = 'summary_large_image',
  ogImage,
  ogType,
  author = 'TuWeb.ai',
  robots = 'index, follow',
  language = 'es-AR',
  geoRegion = 'AR',
  geoPlacename = 'Argentina',
}) => {
  // Construimos el título completo con el nombre del sitio
  const fullTitle = `${title} | Tuweb.ai`;

  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="language" content={language} />
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlacename} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType || type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || image} />
      <meta property="og:site_name" content="TuWeb.ai" />
      <meta property="og:locale" content="es_AR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || image} />
      <meta name="twitter:site" content="@tuwebai" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Metadatos adicionales para SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#00CCFF" />
      <meta name="msapplication-TileColor" content="#00CCFF" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "TuWeb.ai",
          "url": "https://tuweb-ai.com",
          "logo": "https://tuweb-ai.com/logo-tuwebai.png",
          "description": "Agencia digital especializada en desarrollo web y marketing digital en Argentina",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "AR"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+54-357-141-6044",
            "contactType": "customer service",
            "email": "tuwebai@gmail.com"
          },
          "sameAs": [
            "https://wa.me/543571416044"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default MetaTags;