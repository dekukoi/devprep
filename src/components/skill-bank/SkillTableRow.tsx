import { Trash2 } from "lucide-react";
import { formatLastUsed } from "@/lib/format";
import { TagChip } from "@/components/shared";
import { ProficiencyMeter } from "./ProficiencyMeter";
import type { SkillBankEntryView } from "@/lib/skill-bank-data";

interface SkillTableRowProps {
  entry: SkillBankEntryView;
  onClick: () => void;
  onDelete: () => void;
}

export function SkillTableRow({ entry, onClick, onDelete }: SkillTableRowProps) {
  return (
    <div className="group flex w-full items-center gap-2 border-b border-border-subtle transition-colors last:border-b-0 hover:bg-bg-surface-2">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-4 px-5 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        <div className="flex-1">
          <span className="text-sm font-medium text-text-primary">{entry.skillName}</span>
        </div>
        <div className="w-[190px] shrink-0">
          <ProficiencyMeter level={entry.proficiencyLevel} />
        </div>
        <div className="w-20 shrink-0 text-[13px] text-text-secondary">
          {entry.yearsOfExperience !== null ? `${entry.yearsOfExperience} yrs` : "—"}
        </div>
        <div className="w-[120px] shrink-0 text-[13px] text-text-secondary">{formatLastUsed(entry.lastUsedAt)}</div>
        <div className="flex w-[170px] shrink-0 flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      </button>
      <button
        type="button"
        aria-label={`Delete ${entry.skillName}`}
        onClick={onDelete}
        className="mr-4 shrink-0 rounded-[var(--radius-sm)] p-1.5 text-text-muted opacity-0 transition-opacity hover:text-sev-missing focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
