import { experiences, projects, skills } from "@/lib/mock-data";
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

export function getExperienceData(): ExperienceData {
  const allSkills: SkillOptionView[] = skills.map((s) => ({ id: s.id, name: s.name, categoryId: s.categoryId }));
  const skillNameById = new Map(skills.map((s) => [s.id, s.name]));

  const experienceViews: ExperienceView[] = experiences.map((exp) => ({
    id: exp.id,
    company: exp.company,
    title: exp.title,
    startDate: exp.startDate,
    endDate: exp.endDate,
    bullets: exp.bullets,
    linkedSkillIds: exp.linkedSkillIds,
    linkedSkillNames: exp.linkedSkillIds.map((id) => skillNameById.get(id)).filter((n): n is string => Boolean(n)),
    projects: projects
      .filter((p) => p.experienceId === exp.id)
      .map((p) => ({ id: p.id, title: p.title })),
  }));

  return { experiences: experienceViews, allSkills };
}
