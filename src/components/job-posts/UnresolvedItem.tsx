"use client";

import { Link } from "lucide-react";
import { SkillPickerPopover } from "./SkillPickerPopover";
import type { JobPostUnresolvedItem, SkillOption } from "@/lib/job-posts-data";

interface UnresolvedItemProps {
  item: JobPostUnresolvedItem;
  skills: SkillOption[];
  onAssign: (skill: SkillOption) => void;
  onDismiss: () => void;
}

export function UnresolvedItem({ item, skills, onAssign, onDismiss }: UnresolvedItemProps) {
  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-2">
      <span className="text-xs font-medium text-text-primary">{item.phrase}</span>
      <div className="flex shrink-0 items-center gap-2.5">
        <SkillPickerPopover
          skills={skills}
          onSelect={onAssign}
          trigger={
            <button
              type="button"
              className="flex items-center gap-1 text-[11px] font-medium text-accent-hover transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Link className="size-2.5" />
              Assign to skill
            </button>
          }
        />
        <button
          type="button"
          onClick={onDismiss}
          className="text-[11px] font-medium text-text-muted transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
