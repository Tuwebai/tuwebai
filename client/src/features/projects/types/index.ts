export interface Project {
  id: string;
  userId: string;
  name: string;
  type: string;
  startDate: string;
  estimatedEndDate: string;
  overallProgress: number;
  status: 'active' | 'completed' | 'on-hold';
  phases: ProjectPhase[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  description: string;
  estimatedDate: string;
  completedDate?: string;
  progress: number;
  files?: ProjectFile[];
  comments?: Comment[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorType: 'client' | 'admin';
  createdAt: string;
}
