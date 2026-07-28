import type { ProficiencyLevel } from "./skill";

export type GapSeverity = "met" | "below" | "missing";

export interface ComparisonGap {
  skillId: string;
  skillName: string;
  requiredLevel: ProficiencyLevel;
  currentLevel: ProficiencyLevel | null;
  severity: GapSeverity;
}

export interface Comparison {
  id: string;
  userId: string;
  jobPostId: string;
  fitScore: number;
  gaps: ComparisonGap[];
  advice: string;
  createdAt: string;
}
