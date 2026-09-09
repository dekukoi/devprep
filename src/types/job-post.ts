import type { ProficiencyLevel } from "./skill";

export interface JobPost {
  id: string;
  userId: string;
  title: string;
  company: string | null;
  content: string;
  seniority?: string | null;
  location?: string | null;
  employmentType?: string | null;
  salaryRange?: string | null;
  createdAt: string;
}

export interface JobPostRequirement {
  id: string;
  jobPostId: string;
  skillId: string;
  requiredLevel: ProficiencyLevel;
  mustHave: boolean;
  weight: number | null;
}

export interface UnresolvedRequirement {
  id: string;
  jobPostId: string;
  phrase: string;
}
