import { experiences, projects, skills } from "@/lib/mock-data";
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

export function getProjectsData(): ProjectsData {
  const allSkills: SkillOptionView[] = skills.map((s) => ({ id: s.id, name: s.name, categoryId: s.categoryId }));
  const skillNameById = new Map(skills.map((s) => [s.id, s.name]));
  const experienceById = new Map(experiences.map((e) => [e.id, e]));
  const experienceOptions: ProjectExperienceOption[] = experiences.map((e) => ({
    id: e.id,
    label: `${e.title} — ${e.company}`,
  }));

  const projectViews: ProjectView[] = projects.map((p) => {
    const exp = p.experienceId ? experienceById.get(p.experienceId) : undefined;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      bullets: p.bullets,
      startDate: p.startDate,
      endDate: p.endDate,
      experienceId: p.experienceId,
      experienceLabel: exp ? `${exp.title} — ${exp.company}` : null,
      linkedSkillIds: p.linkedSkillIds,
      linkedSkillNames: p.linkedSkillIds
        .map((id) => skillNameById.get(id))
        .filter((n): n is string => Boolean(n)),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  });

  return { projects: projectViews, allSkills, experienceOptions };
}
