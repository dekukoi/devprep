export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

export interface SkillCategory {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
}

export interface SkillBankEntry {
  id: string;
  userId: string;
  skillId: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number | null;
  lastUsedAt: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
