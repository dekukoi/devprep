import { cn } from "@/lib/utils";
import type { ProficiencyLevel } from "@/types/skill";

const LEVEL_ORDER: ProficiencyLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const LEVEL_LABEL: Record<ProficiencyLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

const LEVEL_COLOR: Record<ProficiencyLevel, string> = {
  BEGINNER: "bg-sev-below",
  INTERMEDIATE: "bg-accent",
  ADVANCED: "bg-accent",
  EXPERT: "bg-sev-met",
};

interface ProficiencyMeterProps {
  level: ProficiencyLevel;
  showLabel?: boolean;
  className?: string;
}

export function ProficiencyMeter({ level, showLabel = true, className }: ProficiencyMeterProps) {
  const filled = LEVEL_ORDER.indexOf(level) + 1;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex items-center gap-[3px]">
        {LEVEL_ORDER.map((_, i) => (
          <div
            key={i}
            className={cn("h-4 w-1.5 rounded-[2px]", i < filled ? LEVEL_COLOR[level] : "bg-border-strong")}
          />
        ))}
      </div>
      {showLabel && <span className="text-[13px] text-text-secondary">{LEVEL_LABEL[level]}</span>}
    </div>
  );
}
