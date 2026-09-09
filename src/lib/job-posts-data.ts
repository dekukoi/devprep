import type { ProficiencyLevel } from "@/types/skill";
import { comparisons, jobPostRequirements, jobPosts, skillCategories, skills, unresolvedRequirements } from "@/lib/mock-data";

export interface JobPostListItem {
  id: string;
  company: string;
  role: string;
  createdAt: string;
  fitScore: number | null;
}

export interface JobPostRequirementItem {
  id: string;
  skillId: string;
  skillName: string;
  requiredLevel: ProficiencyLevel;
  mustHave: boolean;
}

export interface JobPostUnresolvedItem {
  id: string;
  phrase: string;
}

export interface JobPostFull {
  id: string;
  title: string;
  company: string | null;
  content: string;
  seniority: string | null;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  createdAt: string;
  fitScore: number | null;
  comparisonId: string | null;
  requirements: JobPostRequirementItem[];
  unresolved: JobPostUnresolvedItem[];
}

export interface SkillOption {
  id: string;
  name: string;
  categoryName: string;
}

export interface JobPostsData {
  items: JobPostListItem[];
  detailsById: Record<string, JobPostFull>;
  skillOptions: SkillOption[];
}

export function getJobPostsData(): JobPostsData {
  const skillOptions: SkillOption[] = skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    categoryName: skillCategories.find((c) => c.id === skill.categoryId)?.name ?? "",
  }));

  const items: JobPostListItem[] = jobPosts.map((job) => ({
    id: job.id,
    company: job.company ?? job.title,
    role: job.title,
    createdAt: job.createdAt,
    fitScore: comparisons.find((c) => c.jobPostId === job.id)?.fitScore ?? null,
  }));

  const detailsById: Record<string, JobPostFull> = {};
  for (const job of jobPosts) {
    const requirements: JobPostRequirementItem[] = jobPostRequirements
      .filter((r) => r.jobPostId === job.id)
      .map((r) => {
        const skill = skills.find((s) => s.id === r.skillId);
        return {
          id: r.id,
          skillId: r.skillId,
          skillName: skill?.name ?? r.skillId,
          requiredLevel: r.requiredLevel,
          mustHave: r.mustHave,
        };
      });

    const unresolved: JobPostUnresolvedItem[] = unresolvedRequirements
      .filter((u) => u.jobPostId === job.id)
      .map((u) => ({ id: u.id, phrase: u.phrase }));

    detailsById[job.id] = {
      id: job.id,
      title: job.title,
      company: job.company,
      content: job.content,
      seniority: job.seniority ?? null,
      location: job.location ?? null,
      employmentType: job.employmentType ?? null,
      salaryRange: job.salaryRange ?? null,
      createdAt: job.createdAt,
      fitScore: comparisons.find((c) => c.jobPostId === job.id)?.fitScore ?? null,
      comparisonId: comparisons.find((c) => c.jobPostId === job.id)?.id ?? null,
      requirements,
      unresolved,
    };
  }

  return { items, detailsById, skillOptions };
}
