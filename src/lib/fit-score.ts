import type { GapSeverity } from "@/types/comparison";

export function getFitSeverity(score: number): GapSeverity {
  if (score >= 75) return "met";
  if (score >= 50) return "below";
  return "missing";
}
