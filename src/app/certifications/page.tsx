import { AppShell } from "@/components/layout";
import { CertificationsView } from "@/components/certifications";
import { getAppShellData } from "@/lib/app-shell-data";
import { getCertificationsData } from "@/lib/certifications-data";

export default function CertificationsPage() {
  const shellData = getAppShellData();
  const data = getCertificationsData();

  return (
    <AppShell {...shellData}>
      <CertificationsView data={data} />
    </AppShell>
  );
}
