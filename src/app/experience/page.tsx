import { AppShell } from "@/components/layout";
import { ExperienceBankView } from "@/components/experience";
import { getAppShellData } from "@/lib/app-shell-data";
import { getExperienceData } from "@/lib/db/experience";

export default async function ExperiencePage() {
  const shellData = getAppShellData();
  const data = await getExperienceData();

  return (
    <AppShell {...shellData}>
      <ExperienceBankView data={data} />
    </AppShell>
  );
}
