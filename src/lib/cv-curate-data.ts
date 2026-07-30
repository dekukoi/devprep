import type { GapSeverity } from "@/types/comparison";
import type { CVContent } from "@/types/cv";
import { formatDateRange } from "@/lib/format";
import { comparisons, experiences, jobPostRequirements, jobPosts, mockUser, projects, skills } from "@/lib/mock-data";

export interface CurateCandidate {
  id: string;
  title: string;
  subtitle: string;
  matchCount: number;
  matchTotal: number;
  severity: GapSeverity;
  precheck: boolean;
}

export interface CvCurateData {
  job: { id: string; title: string; company: string | null };
  comparisonId: string | null;
  experience: CurateCandidate[];
  projectCandidates: CurateCandidate[];
  totalCareerEntries: number;
}

function matchSeverity(count: number, total: number): GapSeverity {
  if (total === 0) return count > 0 ? "met" : "missing";
  const ratio = count / total;
  if (ratio >= 0.5) return "met";
  if (ratio > 0.2) return "below";
  return "missing";
}

function recencySortKey(startDate: string | null, endDate: string | null) {
  if (!endDate) return Number.MAX_SAFE_INTEGER;
  return new Date(endDate).getTime();
}

interface RankInput {
  id: string;
  title: string;
  subtitle: string;
  linkedSkillIds: string[];
  startDate: string | null;
  endDate: string | null;
}

function rankCandidates(items: RankInput[], requiredSkillIds: Set<string>, requiredTotal: number): CurateCandidate[] {
  const withMatch = items.map((item) => {
    const matchCount = item.linkedSkillIds.filter((id) => requiredSkillIds.has(id)).length;
    return { ...item, matchCount, sortKey: recencySortKey(item.startDate, item.endDate) };
  });

  withMatch.sort((a, b) => b.matchCount - a.matchCount || b.sortKey - a.sortKey);

  const topMatchCount = withMatch[0]?.matchCount ?? 0;

  return withMatch.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    matchCount: item.matchCount,
    matchTotal: requiredTotal,
    severity: matchSeverity(item.matchCount, requiredTotal),
    precheck: item.matchCount > 0 && item.matchCount >= topMatchCount * 0.5,
  }));
}

export function getCvCurateContentData(jobPostId: string): CvCurateData | null {
  const job = jobPosts.find((j) => j.id === jobPostId);
  if (!job) return null;

  const requirements = jobPostRequirements.filter((r) => r.jobPostId === jobPostId);
  const requiredSkillIds = new Set(requirements.map((r) => r.skillId));
  const requiredTotal = requirements.length;

  const experienceCandidates = rankCandidates(
    experiences.map((exp) => ({
      id: exp.id,
      title: `${exp.title} — ${exp.company}`,
      subtitle: `${new Date(exp.startDate).getFullYear()} — ${exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}`,
      linkedSkillIds: exp.linkedSkillIds,
      startDate: exp.startDate,
      endDate: exp.endDate,
    })),
    requiredSkillIds,
    requiredTotal,
  );

  const projectCandidates = rankCandidates(
    projects.map((proj) => {
      const linkedExperience = proj.experienceId ? experiences.find((e) => e.id === proj.experienceId) : undefined;
      const subtitle = linkedExperience
        ? `Linked · ${linkedExperience.company}`
        : `Standalone${proj.startDate ? ` · ${new Date(proj.startDate).getFullYear()}` : ""}`;
      return {
        id: proj.id,
        title: proj.title,
        subtitle,
        linkedSkillIds: proj.linkedSkillIds,
        startDate: proj.startDate,
        endDate: proj.endDate,
      };
    }),
    requiredSkillIds,
    requiredTotal,
  );

  const comparisonId = comparisons.find((c) => c.jobPostId === jobPostId)?.id ?? null;

  return {
    job: { id: job.id, title: job.title, company: job.company ?? null },
    comparisonId,
    experience: experienceCandidates,
    projectCandidates,
    totalCareerEntries: experiences.length + projects.length,
  };
}

export interface DraftCvResult {
  jobPost: { id: string; title: string; company: string | null };
  title: string;
  draftContent: CVContent;
}

/** Builds a brand-new CV's content from the Experience/Project entries a user checked in the Curate Content step, ordered by relevance (the order `expIds`/`projIds` already arrive in). */
export function buildDraftCvContent(jobPostId: string, expIds: string[], projIds: string[]): DraftCvResult | null {
  const job = jobPosts.find((j) => j.id === jobPostId);
  if (!job) return null;

  const selectedExperiences = expIds
    .map((id) => experiences.find((e) => e.id === id))
    .filter((e): e is (typeof experiences)[number] => e !== undefined);
  const selectedProjects = projIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is (typeof projects)[number] => p !== undefined);

  const skillIdOrder: string[] = [];
  for (const entry of [...selectedExperiences, ...selectedProjects]) {
    for (const skillId of entry.linkedSkillIds) {
      if (!skillIdOrder.includes(skillId)) skillIdOrder.push(skillId);
    }
  }
  const skillNames = skillIdOrder
    .map((id) => skills.find((s) => s.id === id)?.name)
    .filter((name): name is string => name !== undefined);

  const draftContent: CVContent = {
    name: mockUser.name,
    role: job.title,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
    links: mockUser.links,
    summary: `Add a summary highlighting your fit for the ${job.title} role at ${job.company ?? "this company"}.`,
    experience: selectedExperiences.map((entry) => ({
      company: entry.company,
      title: entry.title,
      dateRange: formatDateRange(entry.startDate, entry.endDate),
      bullets: entry.bullets,
    })),
    projects: selectedProjects.map((entry) => ({
      title: entry.title,
      dateRange: entry.startDate ? formatDateRange(entry.startDate, entry.endDate) : null,
      bullets: entry.bullets,
    })),
    skills: skillNames,
  };

  return {
    jobPost: { id: job.id, title: job.title, company: job.company ?? null },
    title: job.company ? `${job.title} — ${job.company}` : job.title,
    draftContent,
  };
}
