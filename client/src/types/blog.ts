export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  authorImage?: string;
  image: string;
  readTime: string;
  content?: string;
  tags?: string[];
  comments?: Comment[];
  likes?: number;
  views?: number;
}

export interface Comment {
  id: number;
  name: string;
  image?: string;
  text: string;
  date: string;
  likes: number;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  name: string;
  image?: string;
  text: string;
  date: string;
  likes: number;
}