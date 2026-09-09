import { History, RotateCcw } from "lucide-react";
import { formatRelativeDate } from "@/lib/format";
import type { CVVersion } from "@/types/cv";

interface VersionHistoryPanelProps {
  versions: CVVersion[];
  onOpenPreview: (version: CVVersion) => void;
}

export function VersionHistoryPanel({ versions, onOpenPreview }: VersionHistoryPanelProps) {
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  const [current, ...past] = sorted;

  return (
    <div className="flex w-full shrink-0 flex-col gap-2.5 border-t border-border-subtle p-4">
      <div className="flex w-full shrink-0 items-center justify-between">
        <div className="flex shrink-0 items-center gap-1.5">
          <History className="size-3.5 text-text-secondary" />
          <span className="text-[13px] font-semibold whitespace-nowrap text-text-primary">Version history</span>
        </div>
        <span className="text-xs font-medium whitespace-nowrap text-accent-hover">View all</span>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-0.5">
        {current && (
          <div className="flex w-full shrink-0 items-center gap-2.5 rounded-[var(--radius-sm)] bg-accent-soft px-2.5 py-2">
            <span className="size-2 shrink-0 rounded-sm bg-accent" />
            <div className="flex flex-1 flex-col gap-px">
              <div className="flex w-full items-center gap-1.5">
                <span className="text-[12.5px] font-semibold whitespace-nowrap text-text-primary">
                  v{current.versionNumber}
                </span>
                <span className="flex-1 text-xs text-text-muted">Current draft</span>
              </div>
              <span className="text-[11px] whitespace-nowrap text-text-muted">Just now</span>
            </div>
          </div>
        )}

        {past.map((version) => (
          <button
            key={version.id}
            type="button"
            onClick={() => onOpenPreview(version)}
            className="flex w-full shrink-0 items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left transition-colors hover:bg-bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="size-2 shrink-0 rounded-sm bg-border-strong" />
            <div className="flex flex-1 flex-col gap-px">
              <div className="flex w-full items-center gap-1.5">
                <span className="text-[12.5px] font-semibold whitespace-nowrap text-text-secondary">
                  v{version.versionNumber}
                </span>
                <span className="flex-1 truncate text-xs text-text-muted">{version.note}</span>
              </div>
              <span className="text-[11px] whitespace-nowrap text-text-muted">{formatRelativeDate(version.createdAt)}</span>
            </div>
            <RotateCcw className="size-3.5 shrink-0 text-text-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}
