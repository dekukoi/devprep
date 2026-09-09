import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GapSeverity } from "@/types/comparison";

interface ScoreRingProps {
  score: number;
  severity: GapSeverity;
  size?: number;
  /** Caption shown under the score. Defaults to "fit". */
  caption?: string;
  /** Percentage-point change vs. the previous run. Omit/null to hide the trend pill (e.g. first-ever run). */
  trendDelta?: number | null;
  className?: string;
}

export function ScoreRing({ score, severity, size = 104, caption = "fit", trendDelta, className }: ScoreRingProps) {
  const color = `var(--color-sev-${severity})`;
  const inset = Math.round(size * 0.09);
  const large = size >= 140;
  const scoreFontSize = large ? 40 : 28;
  const captionFontSize = large ? 12 : 11;
  const trendSeverity: GapSeverity = trendDelta != null && trendDelta < 0 ? "missing" : "met";
  const TrendIcon = trendDelta != null && trendDelta < 0 ? TrendingDown : TrendingUp;

  return (
    <div
      className={cn("relative shrink-0 rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${score * 3.6}deg, var(--color-bg-surface-2) 0deg)`,
      }}
    >
      <div
        className="absolute flex flex-col items-center justify-center gap-1.5 rounded-full bg-bg-surface"
        style={{ inset }}
      >
        <span className="font-bold" style={{ color, fontSize: scoreFontSize }}>
          {score}%
        </span>
        <span className="font-medium text-text-muted" style={{ fontSize: captionFontSize }}>
          {caption}
        </span>
        {trendDelta != null && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[11px] font-bold"
            style={{
              color: `var(--color-sev-${trendSeverity})`,
              backgroundColor: `color-mix(in srgb, var(--color-sev-${trendSeverity}) 15%, transparent)`,
            }}
          >
            <TrendIcon className="size-3" />
            {trendDelta >= 0 ? "+" : ""}
            {trendDelta}%
          </span>
        )}
      </div>
    </div>
  );
}
