import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BlogArticle from '../components/ui/blog-article';
import { BlogPost } from '../types/blog';

// Mock de datos de artículos. En una implementación real, estos vendrían de una API o base de datos
import { blogPosts } from '../data/blog-posts';

interface BlogArticlePageProps {
  post?: BlogPost; // Si se proporciona un post específico, se usa ese en lugar de buscarlo por ID
}

export default function BlogArticlePage({ post: injectedPost }: BlogArticlePageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Si se proporciona un post directamente, lo usamos, de lo contrario lo buscamos por ID
  const post = injectedPost || (id ? blogPosts.find(p => p.id === parseInt(id)) : undefined);
  
  useEffect(() => {
    // Scroll al inicio al cargar la página
    window.scrollTo(0, 0);
    
    // Si no se encuentra el post, redirigir a la página de blog
    if (!post && !injectedPost) {
      navigate('/blog', { replace: true });
    }
  }, [post, navigate, injectedPost]);
  
  if (!post) {
    return null; // Redirigiendo, no renderizamos nada
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