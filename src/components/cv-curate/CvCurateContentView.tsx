"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ChevronLeft, CircleAlert, FolderKanban, LayoutTemplate, ListChecks, Sparkles } from "lucide-react";
import type { CurateCandidate } from "@/lib/cv-curate-data";
import { EntryColumn } from "./EntryColumn";
import { CurateBlockedState } from "./CurateBlockedState";
import { CvCurateContentSkeleton } from "./CvCurateContentSkeleton";

const INITIAL_LOAD_DELAY_MS = 800;

interface CvCurateContentViewProps {
  job: { id: string; title: string; company: string | null };
  comparisonId: string | null;
  templateId: string;
  templateFamilyLabel: string;
  experience: CurateCandidate[];
  projectCandidates: CurateCandidate[];
  totalCareerEntries: number;
}

export function CvCurateContentView({
  job,
  comparisonId,
  templateId,
  templateFamilyLabel,
  experience,
  projectCandidates,
  totalCareerEntries,
}: CvCurateContentViewProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [checked, setChecked] = React.useState<Set<string>>(
    () => new Set([...experience, ...projectCandidates].filter((c) => c.precheck).map((c) => c.id)),
  );

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const handleToggle = (id: string, isChecked: boolean) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (isChecked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectedExperienceIds = experience.filter((c) => checked.has(c.id)).map((c) => c.id);
  const selectedProjectIds = projectCandidates.filter((c) => checked.has(c.id)).map((c) => c.id);
  const canGenerate = selectedExperienceIds.length + selectedProjectIds.length > 0;
  const blocked = totalCareerEntries === 0;

  const handleGenerateDraft = () => {
    if (!canGenerate) return;
    const params = new URLSearchParams({ jobPostId: job.id, templateId });
    if (selectedExperienceIds.length) params.set("exp", selectedExperienceIds.join(","));
    if (selectedProjectIds.length) params.set("proj", selectedProjectIds.join(","));
    router.push(`/cvs/draft/edit?${params.toString()}`);
  };

  const backHref = comparisonId ? `/comparisons/${comparisonId}` : `/job-posts/${job.id}`;
  const backLabel = comparisonId ? "Back to Comparison Report" : "Back to Job Post";

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <button
        type="button"
        onClick={() => router.push(backHref)}
        className="flex w-fit items-center gap-1.5 text-[12.5px] font-medium text-text-muted transition-colors hover:text-text-secondary"
      >
        <ChevronLeft className="size-3.5" />
        {backLabel}
      </button>

      {status === "loading" && <CvCurateContentSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load this step</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong loading your Experience and Projects. Check your connection and try again.
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
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">Curate CV content</span>
              <h1 className="text-[22px] font-semibold text-text-primary">
                Curating content for: {job.title}
                {job.company ? ` — ${job.company}` : ""}
              </h1>
              <p className="max-w-[640px] text-[13px] text-text-secondary">
                Select the experience and projects most relevant to this role. Top matches are pre-selected for you.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border-subtle bg-bg-surface-2 px-3 py-1.5">
              <LayoutTemplate className="size-[13px] text-text-secondary" />
              <span className="text-xs font-medium text-text-secondary">Template: {templateFamilyLabel}</span>
            </div>
          </div>

          {blocked ? (
            <CurateBlockedState />
          ) : (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
                <EntryColumn
                  icon={Briefcase}
                  heading="Experience"
                  candidates={experience}
                  checkedIds={checked}
                  onToggle={handleToggle}
                />
                <EntryColumn
                  icon={FolderKanban}
                  heading="Projects"
                  candidates={projectCandidates}
                  checkedIds={checked}
                  onToggle={handleToggle}
                />
              </div>

              <div className="flex w-full flex-col items-stretch gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-text-primary">
                  <ListChecks className="size-4 text-text-secondary" />
                  {selectedExperienceIds.length} {selectedExperienceIds.length === 1 ? "experience" : "experiences"},{" "}
                  {selectedProjectIds.length} {selectedProjectIds.length === 1 ? "project" : "projects"} selected
                </div>
                <button
                  type="button"
                  disabled={!canGenerate}
                  onClick={handleGenerateDraft}
                  className="flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="size-4" />
                  Generate draft
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
