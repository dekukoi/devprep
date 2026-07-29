import { AppShell } from "@/components/layout";
import { CvTemplatePickerView } from "@/components/cv-templates";
import { getAppShellData } from "@/lib/app-shell-data";
import { cvs, cvTemplates } from "@/lib/mock-data";

interface CvTemplatesPageProps {
  searchParams: Promise<{ cvId?: string }>;
}

export default async function CvTemplatesPage({ searchParams }: CvTemplatesPageProps) {
  const { cvId } = await searchParams;
  const shellData = getAppShellData();
  const cv = cvId ? cvs.find((c) => c.id === cvId) : undefined;

  return (
    <AppShell {...shellData}>
      <CvTemplatePickerView
        templates={cvTemplates}
        cv={cv ? { id: cv.id, title: cv.title, templateId: cv.templateId } : null}
      />
    </AppShell>
  );
}
