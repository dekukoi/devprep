"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ProficiencyLevel } from "@/types/skill";
import type { JobPostRequirementItem } from "@/lib/job-posts-data";

const LEVEL_OPTIONS: ProficiencyLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const LEVEL_LABEL: Record<ProficiencyLevel, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

interface RequirementChipProps {
  requirement: JobPostRequirementItem;
  onChangeLevel: (level: ProficiencyLevel) => void;
  onToggleMustHave: (mustHave: boolean) => void;
  onRemove: () => void;
}

export function RequirementChip({ requirement, onChangeLevel, onToggleMustHave, onRemove }: RequirementChipProps) {
  const [expanded, setExpanded] = React.useState(false);
  const dotColor = requirement.mustHave ? "bg-accent" : "bg-text-muted";

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-accent-soft px-2.5 py-1.5 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className={cn("size-[5px] shrink-0 rounded-full", dotColor)} />
        <span className="text-xs font-medium text-text-primary">{requirement.skillName}</span>
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-accent bg-accent-soft px-2.5 py-2">
      <button type="button" onClick={() => setExpanded(false)} className="flex items-center gap-1.5">
        <span className={cn("size-[5px] shrink-0 rounded-full", dotColor)} />
        <span className="text-xs font-medium text-text-primary">{requirement.skillName}</span>
      </button>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2 py-1 text-[11px] font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {LEVEL_LABEL[requirement.requiredLevel]}
              <ChevronDown className="size-2.5 text-text-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {LEVEL_OPTIONS.map((level) => (
              <DropdownMenuItem key={level} onClick={() => onChangeLevel(level)}>
                {LEVEL_LABEL[level]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 p-0.5">
          <button
            type="button"
            onClick={() => onToggleMustHave(true)}
            className={cn(
              "rounded-[calc(var(--radius-sm)-2px)] px-2 py-1 text-[10.5px] font-semibold transition-colors",
              requirement.mustHave ? "bg-accent text-white" : "text-text-muted",
            )}
          >
            Must-have
          </button>
          <button
            type="button"
            onClick={() => onToggleMustHave(false)}
            className={cn(
              "rounded-[calc(var(--radius-sm)-2px)] px-2 py-1 text-[10.5px] font-medium transition-colors",
              !requirement.mustHave ? "bg-accent text-white" : "text-text-muted",
            )}
          >
            Nice-to-have
          </button>
        </div>

        <button
          type="button"
          aria-label={`Remove ${requirement.skillName}`}
          onClick={onRemove}
          className="text-text-muted transition-colors hover:text-sev-missing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
