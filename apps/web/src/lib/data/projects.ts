export type ProjectTechStackData = {
  id: string;
  name: string;
  category: string;
  displayOrder: number;
};

export type ProjectData = {
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
  techStacks: ProjectTechStackData[];
  createdAt: string;
  updatedAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function fetchProjects(signal?: AbortSignal): Promise<ProjectData[]> {
  const response = await fetch(`${API_URL}/projects`, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Unable to fetch projects from the portfolio API.');
  }

  const projects = (await response.json()) as ProjectData[];

  return [...projects].sort((left, right) => left.displayOrder - right.displayOrder || left.title.localeCompare(right.title));
}

export async function fetchProjectBySlug(slug: string, signal?: AbortSignal): Promise<ProjectData> {
  const response = await fetch(`${API_URL}/projects/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    signal,
  });

  if (!response.ok) {
    throw new Error('Unable to fetch project case study from the portfolio API.');
  }

  return (await response.json()) as ProjectData;
}
