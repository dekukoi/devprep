import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout";
import { JobPostsView } from "@/components/job-posts";
import { getAppShellData } from "@/lib/app-shell-data";
import { getJobPostsData } from "@/lib/job-posts-data";

interface JobPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPostPage({ params }: JobPostPageProps) {
  const { id } = await params;
  const shellData = getAppShellData();
  const data = getJobPostsData();

  if (!data.detailsById[id]) notFound();

  return (
    <AppShell {...shellData}>
      <JobPostsView data={data} initialSelectedId={id} />
    </AppShell>
  );
}
