"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import type { ComparisonGap } from "@/types/comparison";
import type { ProficiencyLevel } from "@/types/skill";

interface SkillGapPanelProps {
  gaps: ComparisonGap[];
  onRowClick: (gap: ComparisonGap) => void;
}

function levelLabel(level: ProficiencyLevel | null) {
  if (!level) return "None";
  return level[0] + level.slice(1).toLowerCase();
}

export function SkillGapPanel({ gaps, onRowClick }: SkillGapPanelProps) {
  const [showMet, setShowMet] = React.useState(false);
  const needsAttention = gaps.filter((g) => g.severity !== "met");
  const met = gaps.filter((g) => g.severity === "met");

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">Skill Gap Analysis</h2>
        <p className="text-[13px] text-text-muted">
          {gaps.length} required skill{gaps.length === 1 ? "" : "s"} · sorted by severity
        </p>
      </div>

      {gaps.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <Inbox className="size-6 text-text-muted" />
          <p className="text-sm font-semibold text-text-primary">No skills to compare</p>
          <p className="max-w-[280px] text-[12.5px] text-text-secondary">
            This job post has no parsed requirements yet — add some from the Job Posts screen.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {needsAttention.length > 0 && (
            <span className="text-[11px] font-semibold tracking-[0.5px] text-text-muted uppercase">Needs attention</span>
          )}
          {needsAttention.map((gap) => (
            <GapRow key={gap.skillId} gap={gap} onClick={() => onRowClick(gap)} />
          ))}

          {met.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowMet((v) => !v)}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-2 px-3.5 py-3 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="flex items-center gap-2 text-[13px] font-medium text-text-secondary">
                  {showMet ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  {met.length} skill{met.length === 1 ? "" : "s"} met — {showMet ? "Hide" : "Show all"}
                </span>
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: "var(--color-sev-met)" }} />
              </button>
              {showMet && met.map((gap) => <GapRow key={gap.skillId} gap={gap} onClick={() => onRowClick(gap)} />)}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GapRow({ gap, onClick }: { gap: ComparisonGap; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-2 px-3.5 py-2.5 text-left transition-colors hover:border-border-strong hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-[30px] w-[3px] shrink-0 rounded-full" style={{ backgroundColor: `var(--color-sev-${gap.severity})` }} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-text-primary">{gap.skillName}</span>
          <span className="text-xs text-text-secondary">
            You: {levelLabel(gap.currentLevel)} · Required: {levelLabel(gap.requiredLevel)}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <StatusBadge severity={gap.severity} />
        <ChevronRight className="size-4 text-text-muted" />
      </div>
    </button>
  );
}
