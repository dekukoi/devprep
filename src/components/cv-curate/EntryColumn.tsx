import type { LucideIcon } from "lucide-react";
import type { CurateCandidate } from "@/lib/cv-curate-data";
import { EntryRow } from "./EntryRow";

interface EntryColumnProps {
  icon: LucideIcon;
  heading: string;
  candidates: CurateCandidate[];
  checkedIds: Set<string>;
  onToggle: (id: string, checked: boolean) => void;
}

export function EntryColumn({ icon: Icon, heading, candidates, checkedIds, onToggle }: EntryColumnProps) {
  return (
    <div className="flex h-full flex-1 flex-col gap-3.5 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon className="size-[17px] text-accent" />
          <span className="text-base font-semibold text-text-primary">{heading}</span>
        </div>
        <span className="text-xs text-text-muted">
          {candidates.length} {candidates.length === 1 ? "entry" : "entries"} · sorted by required-skill match, then recency
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {candidates.map((candidate) => (
          <EntryRow
            key={candidate.id}
            candidate={candidate}
            checked={checkedIds.has(candidate.id)}
            onToggle={(checked) => onToggle(candidate.id, checked)}
          />
        ))}
      </div>
    </div>
  );
}
