import { redirect } from "next/navigation";
import { getSkillBankData } from "@/lib/db/skill-bank";

export default async function SkillBankIndexPage() {
  const data = await getSkillBankData();
  redirect(`/skill-bank/${data.categories[0].slug}`);
}
