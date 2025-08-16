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
}) => {
  // Construimos el título completo con el nombre del sitio
  const fullTitle = `${title} | Tuweb.ai`;

  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default MetaTags;