import type { IconName } from "@/lib/constants/icons";
import { SKILL_CATEGORY_ICON_NAMES } from "@/lib/constants/icons";
import { slugify } from "@/lib/utils";
import type { ProficiencyLevel } from "@/types/skill";
import { experiences, skillBankEntries, skillCategories, skills } from "@/lib/mock-data";

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

export function getSkillBankData(): SkillBankData {
  const categories: SkillBankCategoryView[] = skillCategories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: slugify(category.name),
    icon: SKILL_CATEGORY_ICON_NAMES[category.name],
  }));

  const skillsByCategory: Record<string, SkillOptionView[]> = {};
  for (const category of skillCategories) {
    skillsByCategory[category.id] = skills
      .filter((s) => s.categoryId === category.id)
      .map((s) => ({ id: s.id, name: s.name, categoryId: s.categoryId }));
  }

  const usedInBySkillId: Record<string, SkillBankUsedIn[]> = {};
  for (const skill of skills) {
    usedInBySkillId[skill.id] = experiences
      .filter((exp) => exp.linkedSkillIds.includes(skill.id))
      .map((exp) => ({ id: exp.id, label: `${exp.title} — ${exp.company}` }));
  }

  const entries: SkillBankEntryView[] = skillBankEntries.map((sbe) => {
    const skill = skills.find((s) => s.id === sbe.skillId)!;
    return {
      id: sbe.id,
      skillId: sbe.skillId,
      skillName: skill.name,
      categoryId: skill.categoryId,
      categorySlug: slugify(categories.find((c) => c.id === skill.categoryId)!.name),
      proficiencyLevel: sbe.proficiencyLevel,
      yearsOfExperience: sbe.yearsOfExperience,
      lastUsedAt: sbe.lastUsedAt,
      tags: sbe.tags ?? [],
    };
  });

  return { categories, entries, skillsByCategory, usedInBySkillId, cap: FREE_TIER_SKILL_BANK_CAP };
}
