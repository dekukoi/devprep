import { redirect } from "next/navigation";
import { getSkillBankData } from "@/lib/skill-bank-data";

export default function SkillBankIndexPage() {
  const data = getSkillBankData();
  redirect(`/skill-bank/${data.categories[0].slug}`);
}
