import { AppShell } from "@/components/layout";
import { ComparisonsListView } from "@/components/comparisons";
import { getAppShellData } from "@/lib/app-shell-data";
import { getComparisonIdByJobId, getComparisonsListData, getNewComparisonJobPosts } from "@/lib/comparisons-list-data";

export default function ComparisonsPage() {
  const shellData = getAppShellData();
  const comparisons = getComparisonsListData();
  const jobPosts = getNewComparisonJobPosts();
  const comparisonIdByJobId = getComparisonIdByJobId();

  return (
    <AppShell {...shellData}>
      <ComparisonsListView comparisons={comparisons} jobPosts={jobPosts} comparisonIdByJobId={comparisonIdByJobId} />
    </AppShell>
  );
}
