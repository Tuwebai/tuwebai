import { getBlogPostBySlug, getRelatedBlogPosts } from '@/features/blog/services/blog.service';
import type { BlogArticle } from '@/features/blog/types';

interface UseBlogArticleResult {
  article?: BlogArticle;
  relatedArticles: BlogArticle[];
}

export function useBlogArticle(slug: string): UseBlogArticleResult {
  return {
    article: getBlogPostBySlug(slug),
    relatedArticles: getRelatedBlogPosts(slug),
  };
}
