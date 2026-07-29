"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFitSeverity } from "@/lib/fit-score";
import { formatCompactRelativeDate } from "@/lib/format";

interface JobPostListRowProps {
  company: string;
  role: string;
  fitScore: number | null;
  createdAt: string;
  selected: boolean;
  onClick: () => void;
}

export function JobPostListRow({ company, role, fitScore, createdAt, selected, onClick }: JobPostListRowProps) {
  const severity = fitScore !== null ? getFitSeverity(fitScore) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col gap-2 rounded-[var(--radius-md)] border p-3 text-left transition-colors",
        selected ? "border-accent bg-accent-soft" : "border-border-subtle bg-bg-surface hover:border-border-strong",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-text-primary">{company}</span>
          <span className="text-xs text-text-secondary">{role}</span>
        </div>
        {severity && (
          <span
            className="shrink-0 rounded-full px-2 py-[3px] text-xs font-semibold"
            style={{
              color: `var(--color-sev-${severity})`,
              backgroundColor: `color-mix(in srgb, var(--color-sev-${severity}) 15%, transparent)`,
            }}
          >
            {fitScore}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-text-muted">
        <Calendar className="size-3" />
        <span className="text-[11px]">Added {formatCompactRelativeDate(createdAt)}</span>
      </div>
    </button>
  );
}
