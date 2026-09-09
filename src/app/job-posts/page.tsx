import { AppShell } from "@/components/layout";
import { JobPostsView } from "@/components/job-posts";
import { getAppShellData } from "@/lib/app-shell-data";
import { getJobPostsData } from "@/lib/job-posts-data";

export default function JobPostsPage() {
  const shellData = getAppShellData();
  const data = getJobPostsData();
  const initialSelectedId = data.items[0]?.id ?? null;

  return (
    <AppShell {...shellData}>
      <JobPostsView data={data} initialSelectedId={initialSelectedId} />
    </AppShell>
  );
}
