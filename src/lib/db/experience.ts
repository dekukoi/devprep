import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/db/current-user";
import type { ExperienceData, ExperienceView } from "@/lib/experience-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export async function getExperienceData(): Promise<ExperienceData> {
  const userId = await getCurrentUserId();

  const [skillsRaw, experiencesRaw] = await Promise.all([
    prisma.skill.findMany(),
    prisma.experience.findMany({
      where: { userId },
      include: { linkedSkills: true, projects: true },
      orderBy: { startDate: "desc" },
    }),
  ]);

  const allSkills: SkillOptionView[] = skillsRaw.map((skill) => ({
    id: skill.id,
    name: skill.name,
    categoryId: skill.categoryId,
  }));

  const experiences: ExperienceView[] = experiencesRaw.map((exp) => ({
    id: exp.id,
    company: exp.company,
    title: exp.title,
    startDate: exp.startDate.toISOString(),
    endDate: exp.endDate ? exp.endDate.toISOString() : null,
    bullets: exp.bullets,
    linkedSkillIds: exp.linkedSkills.map((skill) => skill.id),
    linkedSkillNames: exp.linkedSkills.map((skill) => skill.name),
    projects: exp.projects.map((project) => ({ id: project.id, title: project.title })),
  }));

  return { experiences, allSkills };
}
