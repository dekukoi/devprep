"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared";
import type { Comparison } from "@/types/comparison";
import type { JobPost } from "@/types/job-post";
import { ComparisonHero } from "./ComparisonHero";
import { SkillGapPanel } from "./SkillGapPanel";
import { AdviceColumn } from "./AdviceColumn";
import { ComparisonReportSkeleton } from "./ComparisonReportSkeleton";

const INITIAL_LOAD_DELAY_MS = 800;
const RERUN_DELAY_MS = 1200;
const RERUN_SCORE_DELTA = 12;

interface ComparisonReportViewProps {
  job: JobPost;
  /** Oldest to newest; always has at least one entry. */
  history: Comparison[];
}

let rerunCounter = 0;

export function ComparisonReportView({ job, history: initialHistory }: ComparisonReportViewProps) {
  const router = useRouter();
  const [history, setHistory] = React.useState(initialHistory);
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [rerunning, setRerunning] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;
  const trendDelta = previous ? latest.fitScore - previous.fitScore : null;

  const handleRerun = () => {
    if (rerunning) return;
    setRerunning(true);
    window.setTimeout(() => {
      rerunCounter += 1;
      const next: Comparison = {
        ...latest,
        id: `${latest.id}-rerun-${rerunCounter}`,
        fitScore: Math.min(100, latest.fitScore + RERUN_SCORE_DELTA),
        createdAt: new Date().toISOString(),
      };
      setHistory((prev) => [...prev, next]);
      setRerunning(false);
      toast.success("Comparison run completed");
    }, RERUN_DELAY_MS);
  };

  const handleGenerateCv = () => {
    router.push("/cvs/templates");
  };

  const handleSkillBankJump = React.useCallback(() => {
    toast.info("Skill Bank — coming soon");
  }, []);

  const handleAdviceClick = React.useCallback(() => {
    toast.info("Skill Bank — coming soon");
  }, []);

  const companyLabel = job.company ?? job.title;
  const title = `Skill Bank vs ${companyLabel} — ${job.title}`;

  const actions = status === "ready" && (
    <div className="flex shrink-0 items-center gap-2.5">
      <button
        type="button"
        onClick={handleRerun}
        disabled={rerunning}
        className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong bg-bg-surface-2 px-3.5 py-2.5 text-[13px] font-semibold text-text-primary transition-colors hover:border-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RefreshCw className={cn("size-[15px]", rerunning && "animate-spin")} />
        {rerunning ? "Re-running…" : "Re-run comparison"}
      </button>
      <button
        type="button"
        onClick={handleGenerateCv}
        className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Sparkles className="size-[15px]" />
        Generate CV for this role
      </button>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader eyebrow="COMPARISON REPORT" title={title} actions={actions} />

      {status === "loading" && <ComparisonReportSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load this comparison</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching the report. Check your connection and try again.
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

      {status === "ready" && (
        <>
          <ComparisonHero comparison={latest} trendDelta={trendDelta} />
          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
            <SkillGapPanel gaps={latest.gaps} onRowClick={handleSkillBankJump} />
            <AdviceColumn gaps={latest.gaps} onCardClick={handleAdviceClick} />
          </div>
        </>
      )}
    </div>
  );
}
