import { getAllBlogPosts } from '@/features/blog/services/blog-index.service';
import type { BlogArticleSummary } from '@/features/blog/types';

export function useBlogPosts(): BlogArticleSummary[] {
  return getAllBlogPosts();
}
