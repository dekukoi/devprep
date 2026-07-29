import Link from "next/link";
import { ScoreRing } from "@/components/shared";
import { getFitSeverity } from "@/lib/fit-score";
import { formatShortDate } from "@/lib/format";

export interface RecentComparisonCardData {
  id: string;
  company: string;
  role: string;
  fitScore: number;
  createdAt: string;
  topGapLabel: string | null;
}

export function RecentComparisonCard({ company, role, fitScore, createdAt, topGapLabel, id }: RecentComparisonCardData) {
  const severity = getFitSeverity(fitScore);

  return (
    <Link
      href={`/comparisons/${id}`}
      className="flex min-w-0 flex-1 flex-col gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-5 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-text-primary">{company}</span>
        <span className="text-[13px] text-text-secondary">{role}</span>
      </div>
      <div className="flex justify-center py-1">
        <ScoreRing score={fitScore} severity={severity} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">{formatShortDate(createdAt)}</span>
        {topGapLabel && (
          <span
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-bg-surface-2 px-2 py-1 text-[11px] font-medium text-text-secondary"
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: `var(--color-sev-${severity})` }} />
            {topGapLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
