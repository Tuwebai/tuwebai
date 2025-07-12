import React from 'react';
import { Helmet } from 'react-helmet';
import BlogArticle from '../../components/ui/blog-article';
import { blogPosts } from '../../data/blog-posts';

export default function SeoTecnicoOptimizarVelocidadPage() {
  // Obtener el post con id 3 (SEO técnico: Guía completa)
  const post = blogPosts.find(p => p.id === 3);
  
  if (!post) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>{post.title} | TuWeb.ai Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
      </Helmet>
      
      <BlogArticle post={post} />
    </>
  );
}