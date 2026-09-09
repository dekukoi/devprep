import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout";
import { CvCurateContentView } from "@/components/cv-curate";
import { getAppShellData } from "@/lib/app-shell-data";
import { getCvCurateContentData } from "@/lib/cv-curate-data";
import { FREE_TEMPLATE_ID, TEMPLATE_FAMILY } from "@/lib/constants/cv-templates";
import { cvTemplates } from "@/lib/mock-data";

interface CvCuratePageProps {
  searchParams: Promise<{ jobPostId?: string; templateId?: string }>;
}

export default async function CvCuratePage({ searchParams }: CvCuratePageProps) {
  const { jobPostId, templateId } = await searchParams;
  if (!jobPostId) notFound();

  const data = getCvCurateContentData(jobPostId);
  if (!data) notFound();

  const resolvedTemplateId = templateId ?? FREE_TEMPLATE_ID;
  const template = cvTemplates.find((t) => t.id === resolvedTemplateId);
  const templateFamilyLabel = template ? TEMPLATE_FAMILY[template.name] : TEMPLATE_FAMILY.Aurora;

  const shellData = getAppShellData();

  return (
    <AppShell {...shellData}>
      <CvCurateContentView
        job={data.job}
        comparisonId={data.comparisonId}
        templateId={resolvedTemplateId}
        templateFamilyLabel={templateFamilyLabel}
        experience={data.experience}
        projectCandidates={data.projectCandidates}
        totalCareerEntries={data.totalCareerEntries}
      />
    </AppShell>
  );
}
