import { comparisons, jobPosts } from "@/lib/mock-data";
import type { RecentComparisonCardData } from "@/components/dashboard/RecentComparisonCard";
import type { NewComparisonJobPost } from "@/components/dashboard/NewComparisonModal";

export type ComparisonListItem = RecentComparisonCardData;

export function getComparisonsListData(): ComparisonListItem[] {
  return [...comparisons]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((comparison) => {
      const job = jobPosts.find((j) => j.id === comparison.jobPostId);
      const topGap = comparison.gaps.find((g) => g.severity !== "met") ?? comparison.gaps[0] ?? null;
      return {
        id: comparison.id,
        company: job?.company ?? job?.title ?? "Unknown",
        role: job?.title ?? "",
        fitScore: comparison.fitScore,
        createdAt: comparison.createdAt,
        topGapLabel: topGap?.skillName ?? null,
      };
    });
}

export function getNewComparisonJobPosts(): NewComparisonJobPost[] {
  return jobPosts.map((job) => ({ id: job.id, company: job.company ?? job.title, role: job.title }));
}

export function getComparisonIdByJobId(): Record<string, string> {
  return Object.fromEntries(comparisons.map((c) => [c.jobPostId, c.id]));
}
