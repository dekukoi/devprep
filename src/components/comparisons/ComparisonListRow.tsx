import Link from "next/link";
import { Calendar } from "lucide-react";
import { getFitSeverity } from "@/lib/fit-score";
import { formatCompactRelativeDate } from "@/lib/format";
import type { ComparisonListItem } from "@/lib/comparisons-list-data";

export function ComparisonListRow({ id, company, role, fitScore, createdAt, topGapLabel }: ComparisonListItem) {
  const severity = getFitSeverity(fitScore);

  return (
    <Link
      href={`/comparisons/${id}`}
      className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          color: `var(--color-sev-${severity})`,
          backgroundColor: `color-mix(in srgb, var(--color-sev-${severity}) 15%, transparent)`,
        }}
      >
        {fitScore}%
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-semibold text-text-primary">{company}</span>
        <span className="truncate text-[13px] text-text-secondary">{role}</span>
      </div>

      {topGapLabel && (
        <span className="hidden shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] bg-bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-text-secondary sm:inline-flex">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: `var(--color-sev-${severity})` }} />
          {topGapLabel}
        </span>
      )}

      <div className="hidden shrink-0 items-center gap-1.5 text-text-muted sm:flex">
        <Calendar className="size-3" />
        <span className="text-[11px]">{formatCompactRelativeDate(createdAt)}</span>
      </div>
    </Link>
  );
}
