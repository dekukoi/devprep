import type { IconName } from "@/lib/constants/icons";
import type { ProficiencyLevel } from "@/types/skill";

export const FREE_TIER_SKILL_BANK_CAP = 30;

export interface SkillBankUsedIn {
  id: string;
  label: string;
}

export interface SkillBankEntryView {
  id: string;
  skillId: string;
  skillName: string;
  categoryId: string;
  categorySlug: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number | null;
  lastUsedAt: string;
  tags: string[];
}

export interface SkillBankCategoryView {
  id: string;
  name: string;
  slug: string;
  icon: IconName;
}

export interface SkillOptionView {
  id: string;
  name: string;
  categoryId: string;
}

export interface SkillBankData {
  categories: SkillBankCategoryView[];
  entries: SkillBankEntryView[];
  skillsByCategory: Record<string, SkillOptionView[]>;
  usedInBySkillId: Record<string, SkillBankUsedIn[]>;
  cap: number;
}
