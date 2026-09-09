import type { SkillOptionView } from "@/lib/skill-bank-data";

export interface ProjectExperienceOption {
  id: string;
  label: string;
}

export interface ProjectView {
  id: string;
  title: string;
  description: string | null;
  bullets: string[];
  startDate: string | null;
  endDate: string | null;
  experienceId: string | null;
  experienceLabel: string | null;
  linkedSkillIds: string[];
  linkedSkillNames: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsData {
  projects: ProjectView[];
  allSkills: SkillOptionView[];
  experienceOptions: ProjectExperienceOption[];
}
