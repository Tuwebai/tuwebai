export interface ShowroomProject {
  id: number;
  title: string;
  category: string;
  description: string;
  features: string[];
  results: { label: string; value: string }[];
  image: string;
  detailsUrl: string;
  externalUrl?: string;
}
