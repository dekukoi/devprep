import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout";
import { SkillBankView } from "@/components/skill-bank";
import { getAppShellData } from "@/lib/app-shell-data";
import { getSkillBankData } from "@/lib/db/skill-bank";
import { getCurrentUser } from "@/lib/db/current-user";

interface SkillBankCategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function SkillBankCategoryPage({ params }: SkillBankCategoryPageProps) {
  const { category } = await params;
  const shellData = getAppShellData();
  const [data, user] = await Promise.all([getSkillBankData(), getCurrentUser()]);

  if (!data.categories.some((c) => c.slug === category)) notFound();

  return (
    <AppShell {...shellData}>
      <SkillBankView data={data} initialCategorySlug={category} isPro={user.isPro} />
    </AppShell>
  );
}
