import { AppShell } from "@/components/layout";
import { DashboardView, type DashboardCvItem } from "@/components/dashboard";
import type { RecentComparisonCardData } from "@/components/dashboard/RecentComparisonCard";
import type { NewComparisonJobPost } from "@/components/dashboard/NewComparisonModal";
import { getAppShellData } from "@/lib/app-shell-data";
import { formatRelativeDate } from "@/lib/format";
import { comparisons, cvs, cvVersions, dashboardStats, jobPosts } from "@/lib/mock-data";

export default function Home() {
  const shellData = getAppShellData();

  const dashboardComparisons: RecentComparisonCardData[] = [...comparisons]
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

  const dashboardCvs: DashboardCvItem[] = cvs.map((cv) => {
    const job = jobPosts.find((j) => j.id === cv.jobPostId);
    const version = cvVersions.find((v) => v.id === cv.latestVersionId)?.versionNumber ?? 1;
    return {
      id: cv.id,
      title: cv.title,
      role: cv.title.split(" - ")[0],
      targetCompany: job?.company ?? null,
      version,
      editedRelative: formatRelativeDate(cv.updatedAt),
      isStale: (cv.staleFields?.length ?? 0) > 0,
    };
  });

  const dashboardJobPosts: NewComparisonJobPost[] = jobPosts.map((job) => ({
    id: job.id,
    company: job.company ?? job.title,
    role: job.title,
  }));

  return (
    <AppShell {...shellData}>
      <DashboardView
        stats={dashboardStats}
        comparisons={dashboardComparisons}
        cvs={dashboardCvs}
        jobPosts={dashboardJobPosts}
      />
    </AppShell>
  );
}
