import type { SkillOptionView } from "@/lib/skill-bank-data";

export interface ExperienceProjectChip {
  id: string;
  title: string;
}

export interface ExperienceView {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  linkedSkillIds: string[];
  linkedSkillNames: string[];
  projects: ExperienceProjectChip[];
}

export interface ExperienceData {
  experiences: ExperienceView[];
  allSkills: SkillOptionView[];
}
