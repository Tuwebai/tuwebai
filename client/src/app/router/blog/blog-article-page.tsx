import { useParams } from 'react-router-dom';

import BlogArticlePage from '@/features/blog/components/blog-article-page';

export default function BlogArticleRoutePage() {
  const { slug = '' } = useParams();

  return <BlogArticlePage slug={slug} />;
}
