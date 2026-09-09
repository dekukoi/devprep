import { AppShell } from "@/components/layout";
import { DashboardView, type DashboardCvItem } from "@/components/dashboard";
import { getAppShellData } from "@/lib/app-shell-data";
import { formatRelativeDate } from "@/lib/format";
import { getComparisonIdByJobId, getComparisonsListData, getNewComparisonJobPosts } from "@/lib/comparisons-list-data";
import { cvs, cvVersions, dashboardStats, jobPosts } from "@/lib/mock-data";

export default function Home() {
  const shellData = getAppShellData();

  const dashboardComparisons = getComparisonsListData();

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

  const dashboardJobPosts = getNewComparisonJobPosts();
  const comparisonIdByJobId = getComparisonIdByJobId();

  return (
    <AppShell {...shellData}>
      <DashboardView
        stats={dashboardStats}
        comparisons={dashboardComparisons}
        cvs={dashboardCvs}
        jobPosts={dashboardJobPosts}
        comparisonIdByJobId={comparisonIdByJobId}
      />
    </AppShell>
  );
}
