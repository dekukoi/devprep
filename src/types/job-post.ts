import type { ProficiencyLevel } from "./skill";

export interface JobPost {
  id: string;
  userId: string;
  title: string;
  company: string | null;
  content: string;
  createdAt: string;
}

export interface JobPostRequirement {
  id: string;
  jobPostId: string;
  skillId: string;
  requiredLevel: ProficiencyLevel;
  weight: number | null;
}
