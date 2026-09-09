import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/db/current-user";
import type { ProjectExperienceOption, ProjectsData, ProjectView } from "@/lib/projects-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export async function getProjectsData(): Promise<ProjectsData> {
  const userId = await getCurrentUserId();

  const [skillsRaw, experiencesRaw, projectsRaw] = await Promise.all([
    prisma.skill.findMany(),
    prisma.experience.findMany({ where: { userId } }),
    prisma.project.findMany({
      where: { userId },
      include: { linkedSkills: true, experience: true },
    }),
  ]);

  const allSkills: SkillOptionView[] = skillsRaw.map((skill) => ({
    id: skill.id,
    name: skill.name,
    categoryId: skill.categoryId,
  }));

  const experienceOptions: ProjectExperienceOption[] = experiencesRaw.map((exp) => ({
    id: exp.id,
    label: `${exp.title} — ${exp.company}`,
  }));

  const projects: ProjectView[] = projectsRaw.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    bullets: project.bullets,
    startDate: project.startDate ? project.startDate.toISOString() : null,
    endDate: project.endDate ? project.endDate.toISOString() : null,
    experienceId: project.experienceId,
    experienceLabel: project.experience ? `${project.experience.title} — ${project.experience.company}` : null,
    linkedSkillIds: project.linkedSkills.map((skill) => skill.id),
    linkedSkillNames: project.linkedSkills.map((skill) => skill.name),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }));

  return { projects, allSkills, experienceOptions };
}
