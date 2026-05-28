export enum SkillLevelValue {
  Beginner = 'BEGINNER',
  Intermediate = 'INTERMEDIATE',
  Advanced = 'ADVANCED',
  Expert = 'EXPERT',
}

export interface SkillResponse {
  id: string;
  name: string;
  category: string;
  level: SkillLevelValue;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategoryResponse {
  category: string;
  skills: SkillResponse[];
}
