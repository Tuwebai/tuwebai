import type { BlogArticleSummary } from '@/features/blog/types';
import { blogPostsIndex } from 'virtual:blog-posts-index';

const publishedBlogPostsIndex = [...blogPostsIndex] as BlogArticleSummary[];

export function getAllBlogPosts(): BlogArticleSummary[] {
  return publishedBlogPostsIndex.filter((post) => !post.noindex);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogArticleSummary[] {
  return publishedBlogPostsIndex
    .filter((post) => !post.noindex && post.slug !== currentSlug)
    .slice(0, limit);
}
