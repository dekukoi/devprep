import { ScoreRing } from "@/components/shared";
import { getFitSeverity } from "@/lib/fit-score";
import type { Comparison, GapSeverity } from "@/types/comparison";

interface ComparisonHeroProps {
  comparison: Comparison;
  trendDelta: number | null;
}

const MATCH_COPY: Record<GapSeverity, { label: string; blurb: string }> = {
  met: {
    label: "Strong match",
    blurb:
      "Your profile aligns well with this role. A few gaps remain — review the prioritized recommendations to push toward a full match.",
  },
  below: {
    label: "Partial match",
    blurb:
      "Your profile covers some of what's required, but there are meaningful gaps to close before you're a strong fit. Focus on the highest-priority items below.",
  },
  missing: {
    label: "Needs work",
    blurb:
      "There's a significant gap between your Skill Bank and this role's requirements. Use the prioritized recommendations below as a roadmap.",
  },
};

export function ComparisonHero({ comparison, trendDelta }: ComparisonHeroProps) {
  const severity = getFitSeverity(comparison.fitScore);
  const copy = MATCH_COPY[severity];
  const metCount = comparison.gaps.filter((g) => g.severity === "met").length;
  const belowCount = comparison.gaps.filter((g) => g.severity === "below").length;
  const missingCount = comparison.gaps.filter((g) => g.severity === "missing").length;

  return (
    <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <ScoreRing score={comparison.fitScore} severity={severity} size={150} caption="Fit score" trendDelta={trendDelta} />
        <div className="flex max-w-[280px] flex-col gap-2">
          <span className="text-[22px] font-semibold" style={{ color: `var(--color-sev-${severity})` }}>
            {copy.label}
          </span>
          <p className="text-[13px] leading-5 text-text-secondary">{copy.blurb}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <SummaryTile label="Met" count={metCount} severity="met" />
        <SummaryTile label="Below required" count={belowCount} severity="below" />
        <SummaryTile label="Missing" count={missingCount} severity="missing" />
      </div>
    </div>
  );
}

function SummaryTile({ label, count, severity }: { label: string; count: number; severity: GapSeverity }) {
  return (
    <div className="flex w-[130px] shrink-0 flex-col gap-2 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-2 p-4">
      <div className="flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: `var(--color-sev-${severity})` }} />
        <span className="text-[26px] font-bold text-text-primary">{count}</span>
      </div>
      <span className="text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}
