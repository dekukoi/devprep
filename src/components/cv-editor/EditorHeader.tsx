import Link from "next/link";
import { ArrowLeft, CircleCheck, Download, FileUser, History, Save, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  title: string;
  versionNumber: number;
  jobPostLabel: string | null;
  jobPostHref: string | null;
  saveStatusLabel: string;
  hasUnsavedChanges: boolean;
  staleFieldsVisible: boolean;
  onBack: () => void;
  onSave: () => void;
  onToggleStaleFields: () => void;
  onHistoryClick: () => void;
  onExportPdf: () => void;
}

export function EditorHeader({
  title,
  versionNumber,
  jobPostLabel,
  jobPostHref,
  saveStatusLabel,
  hasUnsavedChanges,
  staleFieldsVisible,
  onBack,
  onSave,
  onToggleStaleFields,
  onHistoryClick,
  onExportPdf,
}: EditorHeaderProps) {
  return (
    <div className="flex h-14 w-full shrink-0 items-center justify-between gap-4 overflow-x-auto border-b border-border-subtle bg-bg-surface py-0 pr-5 pl-4">
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft className="size-4" />
        </button>
        <FileUser className="size-[18px] shrink-0 text-text-muted" />
        <div className="flex shrink-0 flex-col gap-px">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold whitespace-nowrap text-text-primary">{title}</span>
            <span className="flex shrink-0 items-center rounded-[6px] bg-accent-soft px-[7px] py-[3px]">
              <span className="text-[11px] font-semibold whitespace-nowrap text-accent-hover">v{versionNumber}</span>
            </span>
          </div>
          {jobPostLabel &&
            (jobPostHref ? (
              <Link
                href={jobPostHref}
                className="text-[11px] whitespace-nowrap text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {jobPostLabel}
              </Link>
            ) : (
              <span className="text-[11px] whitespace-nowrap text-accent-hover">{jobPostLabel}</span>
            ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <div className="flex shrink-0 items-center gap-1.5 px-1">
          <CircleCheck className="size-3.5 shrink-0 text-sev-met" />
          <span className="text-xs whitespace-nowrap text-text-secondary">{saveStatusLabel}</span>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong bg-bg-surface-2 px-3.5 py-[7px] text-text-secondary transition-colors hover:enabled:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
        >
          <Save className="size-3.5" />
          <span className="text-xs font-semibold whitespace-nowrap">Save</span>
        </button>

        <button
          type="button"
          onClick={onToggleStaleFields}
          aria-pressed={staleFieldsVisible}
          className="flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <TriangleAlert className="size-3.5 text-sev-stale" />
          <span className="text-xs font-medium whitespace-nowrap text-text-secondary">Stale fields</span>
          <span
            className={cn(
              "flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-0.5 transition-colors",
              staleFieldsVisible ? "justify-end bg-sev-stale" : "justify-start bg-border-strong",
            )}
          >
            <span className="size-3.5 shrink-0 rounded-full bg-white" />
          </span>
        </button>

        <div className="h-6 w-px shrink-0 bg-border-strong" />

        <button
          type="button"
          onClick={onHistoryClick}
          className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-3 py-[7px] text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <History className="size-[15px]" />
          <span className="text-xs font-medium whitespace-nowrap">History</span>
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-3.5 py-[7px] text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Download className="size-[15px]" />
          <span className="text-xs font-semibold whitespace-nowrap">Export PDF</span>
        </button>
      </div>
    </div>
  );
}
