export interface BlogHeading {
  level: number;
  text: string;
  id: string;
}

export interface BlogArticleSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage: string;
  ogType: 'article';
}

export interface BlogArticleSummary {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  sourceFile: string;
  seo: BlogArticleSeo;
  noindex?: boolean;
}

export interface BlogArticle extends BlogArticleSummary {
  html: string;
  markdown: string;
  headings: BlogHeading[];
}
