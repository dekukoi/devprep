"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { JobPostListRow } from "./JobPostListRow";
import type { JobPostListItem } from "@/lib/job-posts-data";

type SortMode = "fit" | "date" | "company";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "fit", label: "Fit %" },
  { value: "date", label: "Date added" },
  { value: "company", label: "Company" },
];

interface JobPostListPanelProps {
  jobPosts: JobPostListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
}

export function JobPostListPanel({ jobPosts, selectedId, onSelect, onAddClick }: JobPostListPanelProps) {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortMode>("fit");

  const filtered = jobPosts.filter((job) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return job.company.toLowerCase().includes(q) || job.role.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "fit") return (b.fitScore ?? -1) - (a.fitScore ?? -1);
    if (sort === "company") return a.company.localeCompare(b.company);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-b border-border-subtle bg-bg-surface lg:w-[360px] lg:border-r lg:border-b-0">
      <div className="flex shrink-0 flex-col gap-3.5 p-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">Job Posts</h2>
            <span className="rounded-full bg-bg-surface-2 px-2 py-0.5 text-xs font-medium text-text-secondary">
              {jobPosts.length}
            </span>
          </div>
          <button
            type="button"
            aria-label="Add job post"
            onClick={onAddClick}
            className="flex items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft p-1.5 text-accent-hover transition-colors hover:bg-accent-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base px-2.5 py-2">
          <Search className="size-[15px] shrink-0 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search postings"
            aria-label="Search postings"
            className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-text-muted">Sort:</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                sort === option.value
                  ? "border-accent bg-accent-soft text-accent-hover"
                  : "border-border-subtle bg-bg-surface-2 text-text-secondary",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto p-3 pt-1">
        {sorted.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-text-muted">No postings match &ldquo;{search}&rdquo;.</p>
        ) : (
          sorted.map((job) => (
            <JobPostListRow
              key={job.id}
              company={job.company}
              role={job.role}
              fitScore={job.fitScore}
              createdAt={job.createdAt}
              selected={job.id === selectedId}
              onClick={() => onSelect(job.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
