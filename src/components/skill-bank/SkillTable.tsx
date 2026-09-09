"use client";

import * as React from "react";
import { ListX, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SkillTableRow } from "./SkillTableRow";
import type { SkillBankEntryView } from "@/lib/skill-bank-data";

type SortMode = "proficiency" | "years" | "lastUsed";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "proficiency", label: "Proficiency" },
  { value: "years", label: "Years" },
  { value: "lastUsed", label: "Last used" },
];

const LEVEL_RANK: Record<SkillBankEntryView["proficiencyLevel"], number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
  EXPERT: 3,
};

const HEADER_CELLS = [
  { label: "SKILL", className: "flex-1" },
  { label: "PROFICIENCY", className: "w-[190px] shrink-0" },
  { label: "YEARS", className: "w-20 shrink-0" },
  { label: "LAST USED", className: "w-[120px] shrink-0" },
  { label: "TAGS", className: "w-[170px] shrink-0" },
];

interface SkillTableProps {
  entries: SkillBankEntryView[];
  showProUpsell: boolean;
  onRowClick: (entry: SkillBankEntryView) => void;
  onDeleteClick: (entry: SkillBankEntryView) => void;
  onAddClick: () => void;
}

export function SkillTable({ entries, showProUpsell, onRowClick, onDeleteClick, onAddClick }: SkillTableProps) {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortMode>("lastUsed");

  const filtered = entries.filter((entry) => entry.skillName.toLowerCase().includes(search.trim().toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "proficiency") return LEVEL_RANK[b.proficiencyLevel] - LEVEL_RANK[a.proficiencyLevel];
    if (sort === "years") return (b.yearsOfExperience ?? -1) - (a.yearsOfExperience ?? -1);
    return new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime();
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-[280px] items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-3.5 py-2.5">
          <Search className="size-[15px] shrink-0 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            aria-label="Search skills"
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Sort by</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={cn(
                "rounded-[var(--radius-sm)] border px-3 py-1.5 text-[12.5px] transition-colors",
                sort === option.value
                  ? "border-accent bg-accent-soft font-medium text-text-primary"
                  : "border-border-subtle bg-bg-surface-2 font-normal text-text-secondary hover:border-border-strong",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface">
        {sorted.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-8 text-center">
            <ListX className="size-10 text-text-muted" />
            <p className="text-sm text-text-secondary">
              {entries.length === 0
                ? "No skills added in this category yet"
                : `No skills match "${search}"`}
            </p>
            {entries.length === 0 && (
              <Button onClick={onAddClick}>
                <Plus />
                Add skill
              </Button>
            )}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
            <div className="flex min-h-0 min-w-[700px] flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-4 border-b border-border-subtle bg-bg-surface-2 px-5 py-3">
                {HEADER_CELLS.map((cell) => (
                  <span
                    key={cell.label}
                    className={cn("text-[11px] font-semibold tracking-wide text-text-muted", cell.className)}
                  >
                    {cell.label}
                  </span>
                ))}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                {sorted.map((entry) => (
                  <SkillTableRow
                    key={entry.id}
                    entry={entry}
                    onClick={() => onRowClick(entry)}
                    onDelete={() => onDeleteClick(entry)}
                  />
                ))}
                {showProUpsell && (
                  <div className="flex items-center gap-2.5 px-5 py-3">
                    <div className="h-px flex-1 bg-border-subtle" />
                    <span className="text-[11px] font-semibold text-sev-below">Pro — unlock unlimited entries</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
