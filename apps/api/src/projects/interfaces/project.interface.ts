export interface ProjectTechStackResponse {
  id: string;
  name: string;
  category: string;
  displayOrder: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  techStacks: ProjectTechStackResponse[];
  createdAt: Date;
  updatedAt: Date;
}
