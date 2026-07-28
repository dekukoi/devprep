import { cn } from "@/lib/utils";
import type { BadgeSeverity } from "./StatusBadge";

interface StatTileProps {
  count: number | string;
  label: string;
  severity?: BadgeSeverity;
  className?: string;
}

export function StatTile({ count, label, severity, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex w-[130px] flex-col gap-2 rounded-md border border-border-subtle bg-bg-surface-2 px-[18px] py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 rounded-full"
          style={{
            backgroundColor: severity ? `var(--color-sev-${severity})` : "var(--color-text-muted)",
          }}
        />
        <span className="text-2xl font-bold text-text-primary">{count}</span>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}
