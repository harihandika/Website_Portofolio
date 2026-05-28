export interface ExperienceResponse {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
