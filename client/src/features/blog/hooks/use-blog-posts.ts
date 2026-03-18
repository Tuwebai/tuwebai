import { getAllBlogPosts } from '@/features/blog/services/blog.service';
import type { BlogArticle } from '@/features/blog/types';

export function useBlogPosts(): BlogArticle[] {
  return getAllBlogPosts();
}
