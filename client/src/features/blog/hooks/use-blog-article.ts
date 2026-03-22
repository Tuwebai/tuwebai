import { getRelatedBlogPosts } from '@/features/blog/services/blog-index.service';
import { getBlogPostBySlug } from '@/features/blog/services/blog-article.service';
import type { BlogArticle, BlogArticleSummary } from '@/features/blog/types';

interface UseBlogArticleResult {
  article?: BlogArticle;
  relatedArticles: BlogArticleSummary[];
}

export function useBlogArticle(slug: string): UseBlogArticleResult {
  return {
    article: getBlogPostBySlug(slug),
    relatedArticles: getRelatedBlogPosts(slug),
  };
}
