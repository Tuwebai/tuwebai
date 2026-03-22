declare module 'virtual:blog-posts-index' {
  import type { BlogArticleSummary } from '@/features/blog/types';

  export const blogPostsIndex: BlogArticleSummary[];
}

declare module 'virtual:blog-posts-full' {
  import type { BlogArticle } from '@/features/blog/types';

  export const blogPostsFull: BlogArticle[];
}
