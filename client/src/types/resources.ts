export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type: 'PDF' | 'XLSX' | 'ZIP' | 'MP4' | string;
  image: string;
  downloadCount: number;
  file: string;
  tags: string[];
  featured: boolean;
  date: string;
}