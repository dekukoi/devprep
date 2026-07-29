import { cn } from "@/lib/utils";
import type { GapSeverity } from "@/types/comparison";

interface ScoreRingProps {
  score: number;
  severity: GapSeverity;
  size?: number;
  className?: string;
}

export function ScoreRing({ score, severity, size = 104, className }: ScoreRingProps) {
  const color = `var(--color-sev-${severity})`;
  const inset = Math.round(size * 0.09);

  return (
    <div
      className={cn("relative shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${score * 3.6}deg, var(--color-bg-surface-2) 0deg)`,
      }}
    >
      <div
        className="absolute flex flex-col items-center justify-center rounded-full bg-bg-surface"
        style={{ inset }}
      >
        <span className="text-[28px] font-bold" style={{ color }}>
          {score}%
        </span>
        <span className="text-[11px] font-medium text-text-muted">fit</span>
      </div>
    </div>
  );
}
