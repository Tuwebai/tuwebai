import type { BlogArticle } from '@/features/blog/types';
import { blogPosts } from 'virtual:blog-posts';

const publishedBlogPosts = [...blogPosts] as BlogArticle[];

export function getAllBlogPosts(): BlogArticle[] {
  return publishedBlogPosts.filter((post) => !post.noindex);
}

export function getBlogPostBySlug(slug: string): BlogArticle | undefined {
  return publishedBlogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogArticle[] {
  return publishedBlogPosts.filter((post) => !post.noindex && post.slug !== currentSlug).slice(0, limit);
}
