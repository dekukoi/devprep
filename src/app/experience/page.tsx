import { AppShell } from "@/components/layout";
import { ExperienceBankView } from "@/components/experience";
import { getAppShellData } from "@/lib/app-shell-data";
import { getExperienceData } from "@/lib/experience-data";

export default function ExperiencePage() {
  const shellData = getAppShellData();
  const data = getExperienceData();

  return (
    <AppShell {...shellData}>
      <ExperienceBankView data={data} />
    </AppShell>
  );
}
