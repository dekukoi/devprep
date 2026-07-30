"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { CurateCandidate } from "@/lib/cv-curate-data";

interface EntryRowProps {
  candidate: CurateCandidate;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

export function EntryRow({ candidate, checked, onToggle }: EntryRowProps) {
  return (
    <label
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-md)] border p-3 transition-colors",
        checked ? "border-accent bg-accent-soft" : "border-border-subtle bg-bg-surface-2 hover:border-border-strong",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => onToggle(value === true)}
          className="size-5 shrink-0 rounded-[5px]"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold text-text-primary">{candidate.title}</span>
          <span className="truncate text-xs text-text-secondary">{candidate.subtitle}</span>
        </div>
      </div>
      <StatusBadge
        severity={candidate.severity}
        label={`${candidate.matchCount}/${candidate.matchTotal} required skills matched`}
        className="shrink-0 whitespace-nowrap"
      />
    </label>
  );
}
