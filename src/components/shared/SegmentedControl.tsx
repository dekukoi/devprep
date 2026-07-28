import { cn } from "@/lib/utils";
import type { ProficiencyLevel } from "@/types/skill";

const OPTIONS: ProficiencyLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const LABELS: Record<ProficiencyLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

interface SegmentedControlProps {
  value: ProficiencyLevel;
  onChange?: (value: ProficiencyLevel) => void;
  className?: string;
}

export function SegmentedControl({ value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("flex w-full gap-1.5", className)}>
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange?.(option)}
            className={cn(
              "flex-1 rounded-sm border px-1 py-2 text-xs transition-colors",
              active
                ? "border-accent bg-accent font-semibold text-white"
                : "border-border-subtle bg-bg-elevated text-text-secondary",
            )}
          >
            {LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
