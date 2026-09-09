"use client";

import * as React from "react";
import { Check, LoaderCircle, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface NewComparisonJobPost {
  id: string;
  company: string;
  role: string;
}

interface NewComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPosts: NewComparisonJobPost[];
  onRun: (jobPost: NewComparisonJobPost) => void;
}

export function NewComparisonModal({ open, onOpenChange, jobPosts, onRun }: NewComparisonModalProps) {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleOpenChange = (next: boolean) => {
    if (loading && !next) return;
    if (next) {
      setQuery("");
      setSelectedId(null);
      setLoading(false);
    }
    onOpenChange(next);
  };

  const filtered = jobPosts.filter((job) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return job.company.toLowerCase().includes(q) || job.role.toLowerCase().includes(q);
  });

  const selected = jobPosts.find((job) => job.id === selectedId) ?? null;

  const handleRun = () => {
    if (!selected) return;
    setLoading(true);
    window.setTimeout(() => {
      onRun(selected);
      // Close without touching `loading`/content mid-transition — swapping the dialog's
      // content in the same tick as closing it confuses Radix's exit-animation detection
      // and leaves the full-screen overlay stuck mounted with pointer-events: auto.
      // `loading` resets on next open instead, in handleOpenChange.
      onOpenChange(false);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("flex flex-col gap-5 p-6", loading && "w-[480px] items-center gap-4 py-10 text-center")}
        onEscapeKeyDown={(e) => loading && e.preventDefault()}
        onPointerDownOutside={(e) => loading && e.preventDefault()}
      >
        {loading ? (
          <>
            <LoaderCircle className="size-8 animate-spin text-accent" />
            <p className="text-[15px] font-semibold text-text-primary">Calculating fit...</p>
            <p className="w-[320px] text-[12.5px] text-text-secondary">
              Comparing your Skill Bank against {selected?.company} — {selected?.role}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">New comparison</DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="size-[18px]" />
                </button>
              </DialogClose>
            </div>

            <p className="text-[13px] text-text-secondary">Pick a job post to compare against your current Skill Bank.</p>

            <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-3 py-2.5">
              <Search className="size-4 shrink-0 text-text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job posts..."
                aria-label="Search job posts"
                className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>

            <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-4 text-center text-[13px] text-text-muted">No job posts match &ldquo;{query}&rdquo;.</p>
              ) : (
                filtered.map((job) => {
                  const isSelected = job.id === selectedId;
                  return (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => setSelectedId(job.id)}
                      className={cn(
                        "flex items-center justify-between rounded-[var(--radius-sm)] border px-3 py-2.5 text-left transition-colors",
                        isSelected ? "border-accent bg-accent-soft" : "border-transparent bg-bg-surface-2 hover:border-border-strong",
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-text-primary">{job.company}</span>
                        <span className="text-xs text-text-secondary">{job.role}</span>
                      </div>
                      <span
                        className={cn(
                          "flex size-[18px] shrink-0 items-center justify-center rounded-full border",
                          isSelected ? "border-accent bg-accent" : "border-border-strong",
                        )}
                      >
                        {isSelected && <Check className="size-[11px] text-white" />}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <button
              type="button"
              disabled={!selected}
              onClick={handleRun}
              className="w-full rounded-[var(--radius-sm)] border-2 border-accent-hover bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Run comparison
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
