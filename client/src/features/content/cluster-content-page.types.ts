export interface ClusterSectionItem {
  title: string;
  description: string;
}

export interface ClusterPageConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  eyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroBody: string;
  introTitle: string;
  introBody: string;
  primaryTitle: string;
  primaryItems: ClusterSectionItem[];
  asideTitle: string;
  asideBody: string;
  asidePrimaryCta: string;
  issuesTitle: string;
  issuesItems: string[];
  nextStepsTitle: string;
  nextSteps: ClusterSectionItem[];
  closingTitle: string;
  closingBody: string;
}
