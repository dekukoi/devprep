import { cn } from "@/lib/utils";
import type { GapSeverity } from "@/types/comparison";

export type BadgeSeverity = GapSeverity | "stale";

const SEVERITY_LABEL: Record<BadgeSeverity, string> = {
  met: "Met",
  below: "Below required",
  missing: "Missing",
  stale: "Stale",
};

const SEVERITY_VAR: Record<BadgeSeverity, string> = {
  met: "--color-sev-met",
  below: "--color-sev-below",
  missing: "--color-sev-missing",
  stale: "--color-sev-stale",
};

interface StatusBadgeProps {
  severity: BadgeSeverity;
  label?: string;
  className?: string;
}

export function StatusBadge({ severity, label, className }: StatusBadgeProps) {
  const colorVar = `var(${SEVERITY_VAR[severity]})`;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      style={{
        color: colorVar,
        backgroundColor: `color-mix(in srgb, ${colorVar} 15%, transparent)`,
      }}
    >
      {label ?? SEVERITY_LABEL[severity]}
    </span>
  );
}
