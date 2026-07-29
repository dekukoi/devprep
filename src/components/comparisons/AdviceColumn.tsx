import { ChevronRight, Lightbulb } from "lucide-react";
import { ProLockBadge } from "@/components/shared";
import { buildAdviceItems } from "@/lib/comparison-advice";
import type { ComparisonGap } from "@/types/comparison";

interface AdviceColumnProps {
  gaps: ComparisonGap[];
  onCardClick: (skillId: string) => void;
}

export function AdviceColumn({ gaps, onCardClick }: AdviceColumnProps) {
  const items = buildAdviceItems(gaps);

  return (
    <div className="flex w-full shrink-0 flex-col gap-4 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6 lg:w-[400px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-[18px] text-accent" />
          <h2 className="text-base font-semibold text-text-primary">Rule-based Advice</h2>
        </div>
        <p className="text-[13px] text-text-muted">Prioritized — close highest-impact gaps first</p>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-text-secondary">
          No gaps to address — you&apos;re a strong match for every required skill.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <button
              key={item.skillId}
              type="button"
              onClick={() => onCardClick(item.skillId)}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface-2 p-3.5 text-left transition-colors hover:border-border-strong hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  color: `var(--color-sev-${item.severity})`,
                  backgroundColor: `color-mix(in srgb, var(--color-sev-${item.severity}) 15%, transparent)`,
                }}
              >
                {i + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                <span className="text-xs leading-[18px] text-text-secondary">{item.description}</span>
              </div>
              <ChevronRight className="size-4 shrink-0 text-text-muted" />
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <ProLockBadge />
        <span className="text-[11.5px] text-text-muted">AI-generated rewrite (Pro)</span>
      </div>
    </div>
  );
}
