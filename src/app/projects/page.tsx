import { AppShell } from "@/components/layout";
import { ProjectsBankView } from "@/components/projects";
import { getAppShellData } from "@/lib/app-shell-data";
import { getProjectsData } from "@/lib/db/projects";

interface ProjectsPageProps {
  searchParams: Promise<{ experienceId?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { experienceId } = await searchParams;
  const shellData = getAppShellData();
  const data = await getProjectsData();

  return (
    <AppShell {...shellData}>
      <ProjectsBankView data={data} initialExperienceId={experienceId ?? null} />
    </AppShell>
  );
}
