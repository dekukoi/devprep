import { Code2, Boxes, Wrench, MessageSquare, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const SKILL_CATEGORY_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Tools: Wrench,
  "Soft Skills": MessageSquare,
  "Domain Knowledge": BookOpen,
};

export const GAP_SEVERITY_COLORS = {
  missing: "#ef4444",
  below: "#f59e0b",
  met: "#10b981",
  stale: "#eab308",
} as const;
