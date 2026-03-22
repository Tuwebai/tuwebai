import type { BlogArticle } from '@/features/blog/types';
import { blogPostsFull } from 'virtual:blog-posts-full';

const publishedBlogPostsFull = [...blogPostsFull] as BlogArticle[];

export function getBlogPostBySlug(slug: string): BlogArticle | undefined {
  return publishedBlogPostsFull.find((post) => post.slug === slug);
}
