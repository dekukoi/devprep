import { comparisons, jobPosts } from "@/lib/mock-data";
import type { Comparison } from "@/types/comparison";
import type { JobPost } from "@/types/job-post";

export interface ComparisonReportData {
  job: JobPost;
  /** All comparisons ever run for this job post, oldest to newest. Always has at least one entry. */
  history: Comparison[];
}

export function getComparisonReportData(comparisonId: string): ComparisonReportData | null {
  const comparison = comparisons.find((c) => c.id === comparisonId);
  if (!comparison) return null;

  const job = jobPosts.find((j) => j.id === comparison.jobPostId);
  if (!job) return null;

  const history = comparisons
    .filter((c) => c.jobPostId === comparison.jobPostId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return { job, history };
}
