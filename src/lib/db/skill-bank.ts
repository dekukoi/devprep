import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/db/current-user";
import { SKILL_CATEGORY_ICON_NAMES } from "@/lib/constants/icons";
import { slugify } from "@/lib/utils";
import {
  FREE_TIER_SKILL_BANK_CAP,
  type SkillBankCategoryView,
  type SkillBankData,
  type SkillBankEntryView,
  type SkillBankUsedIn,
  type SkillOptionView,
} from "@/lib/skill-bank-data";

export async function getSkillBankData(): Promise<SkillBankData> {
  const userId = await getCurrentUserId();

  const [categoriesRaw, skillsRaw, entriesRaw, experiencesRaw] = await Promise.all([
    prisma.skillCategory.findMany(),
    prisma.skill.findMany(),
    prisma.skillBankEntry.findMany({
      where: { userId },
      include: { skill: { include: { category: true } } },
    }),
    prisma.experience.findMany({
      where: { userId },
      include: { linkedSkills: true },
    }),
  ]);

  const categories: SkillBankCategoryView[] = categoriesRaw.map((category) => ({
    id: category.id,
    name: category.name,
    slug: slugify(category.name),
    icon: SKILL_CATEGORY_ICON_NAMES[category.name],
  }));

  const categorySlugById = new Map(categories.map((category) => [category.id, category.slug]));

  const skillsByCategory: Record<string, SkillOptionView[]> = {};
  for (const category of categories) skillsByCategory[category.id] = [];
  for (const skill of skillsRaw) {
    skillsByCategory[skill.categoryId]?.push({ id: skill.id, name: skill.name, categoryId: skill.categoryId });
  }

  const usedInBySkillId: Record<string, SkillBankUsedIn[]> = {};
  for (const skill of skillsRaw) usedInBySkillId[skill.id] = [];
  for (const experience of experiencesRaw) {
    for (const skill of experience.linkedSkills) {
      usedInBySkillId[skill.id]?.push({ id: experience.id, label: `${experience.title} — ${experience.company}` });
    }
  }

  const entries: SkillBankEntryView[] = entriesRaw.map((entry) => ({
    id: entry.id,
    skillId: entry.skillId,
    skillName: entry.skill.name,
    categoryId: entry.skill.categoryId,
    categorySlug: categorySlugById.get(entry.skill.categoryId) ?? slugify(entry.skill.category.name),
    proficiencyLevel: entry.proficiencyLevel,
    yearsOfExperience: entry.yearsOfExperience,
    lastUsedAt: (entry.lastUsedAt ?? entry.createdAt).toISOString(),
    tags: entry.tags,
  }));

  return { categories, entries, skillsByCategory, usedInBySkillId, cap: FREE_TIER_SKILL_BANK_CAP };
}
