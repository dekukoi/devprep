"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkillOption } from "@/lib/job-posts-data";

interface SkillPickerPopoverProps {
  trigger: React.ReactNode;
  skills: SkillOption[];
  onSelect: (skill: SkillOption) => void;
}

export function SkillPickerPopover({ trigger, skills, onSelect }: SkillPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filtered = skills.filter((skill) => skill.name.toLowerCase().includes(query.trim().toLowerCase()));

  const handleSelect = (skill: SkillOption) => {
    onSelect(skill);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="flex w-[240px] flex-col gap-2 p-2.5">
        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-1.5">
          <Search className="size-3.5 shrink-0 text-text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills..."
            aria-label="Search skills"
            className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <div className="flex max-h-[220px] flex-col gap-0.5 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-[11px] text-text-muted">No matching skills.</p>
          ) : (
            filtered.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => handleSelect(skill)}
                className="flex items-center justify-between rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left transition-colors hover:bg-bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-xs font-medium text-text-primary">{skill.name}</span>
                <span className="text-[10px] text-text-muted">{skill.categoryName}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
