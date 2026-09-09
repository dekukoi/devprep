import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout";
import { ComparisonReportView } from "@/components/comparisons";
import { getAppShellData } from "@/lib/app-shell-data";
import { getComparisonReportData } from "@/lib/comparison-report-data";

interface ComparisonReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComparisonReportPage({ params }: ComparisonReportPageProps) {
  const { id } = await params;
  const data = getComparisonReportData(id);
  if (!data) notFound();

  const shellData = getAppShellData();

  return (
    <AppShell {...shellData}>
      <ComparisonReportView job={data.job} history={data.history} />
    </AppShell>
  );
}
