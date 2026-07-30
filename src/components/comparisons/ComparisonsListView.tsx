"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, GitCompareArrows, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EmptyState, PageHeader } from "@/components/shared";
import { NewComparisonModal, type NewComparisonJobPost } from "@/components/dashboard/NewComparisonModal";
import { ComparisonListRow } from "./ComparisonListRow";
import { ComparisonsListSkeleton } from "./ComparisonsListSkeleton";
import type { ComparisonListItem } from "@/lib/comparisons-list-data";

const INITIAL_LOAD_DELAY_MS = 800;

type SortMode = "date" | "fit" | "company";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "date", label: "Date added" },
  { value: "fit", label: "Fit %" },
  { value: "company", label: "Company" },
];

interface ComparisonsListViewProps {
  comparisons: ComparisonListItem[];
  jobPosts: NewComparisonJobPost[];
  comparisonIdByJobId: Record<string, string>;
}

export function ComparisonsListView({ comparisons, jobPosts, comparisonIdByJobId }: ComparisonsListViewProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortMode>("date");
  const [newComparisonOpen, setNewComparisonOpen] = React.useState(false);
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const filtered = comparisons.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.company.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "fit") return b.fitScore - a.fitScore;
    if (sort === "company") return a.company.localeCompare(b.company);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleRunComparison = (job: NewComparisonJobPost) => {
    const comparisonId = comparisonIdByJobId[job.id];
    if (comparisonId) {
      toast.success("Comparison run completed");
      router.push(`/comparisons/${comparisonId}`);
    } else {
      toast.success(`Comparison run for ${job.company} — ${job.role}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Comparisons"
        subtitle="Every fit comparison you've run against a job post."
        actions={
          status === "ready" && (
            <button
              type="button"
              onClick={() => setNewComparisonOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] border-2 border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Plus className="size-4" />
              New comparison
            </button>
          )
        }
      />

      {status === "loading" && <ComparisonsListSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load your comparisons</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching your comparison history. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-1 rounded-[var(--radius-sm)] border-2 border-accent-hover bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      )}

      {status === "ready" &&
        (comparisons.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={GitCompareArrows}
              heading="No comparisons yet"
              body="Run your first comparison from a job post to see how your Skill Bank stacks up."
              ctaLabel="Run a comparison"
              onCtaClick={() => setNewComparisonOpen(true)}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-2 sm:w-[280px]">
                <Search className="size-[15px] shrink-0 text-text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search comparisons"
                  aria-label="Search comparisons"
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

            {sorted.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-text-muted">No comparisons match &ldquo;{search}&rdquo;.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {sorted.map((c) => (
                  <ComparisonListRow key={c.id} {...c} />
                ))}
              </div>
            )}
          </>
        ))}

      <NewComparisonModal
        open={newComparisonOpen}
        onOpenChange={setNewComparisonOpen}
        jobPosts={jobPosts}
        onRun={handleRunComparison}
      />
    </div>
  );
}
