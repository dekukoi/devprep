import { RotateCcw, X } from "lucide-react";
import { formatRelativeDate } from "@/lib/format";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { CVVersion } from "@/types/cv";

interface VersionPreviewModalProps {
  version: CVVersion | null;
  jobPostLabel: string | null;
  onOpenChange: (open: boolean) => void;
  onRestore: () => void;
}

export function VersionPreviewModal({ version, jobPostLabel, onOpenChange, onRestore }: VersionPreviewModalProps) {
  return (
    <Dialog open={version !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[600px] flex-col gap-4 p-6">
        {version && (
          <>
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base">Version {version.versionNumber}</DialogTitle>
                  <span className="rounded-[6px] bg-bg-elevated px-2 py-[3px] text-[10.5px] font-semibold whitespace-nowrap text-text-muted">
                    READ-ONLY PREVIEW
                  </span>
                </div>
                <DialogDescription className="whitespace-nowrap">
                  {jobPostLabel ? `${jobPostLabel} · ` : ""}Saved {formatRelativeDate(version.createdAt)}
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="size-[15px]" />
                </button>
              </DialogClose>
            </div>

            <div className="flex h-[300px] w-full shrink-0 flex-col gap-3 overflow-hidden rounded-md bg-white p-7 opacity-[0.92]">
              <span className="text-xl font-bold whitespace-nowrap text-[#111827]">{version.content.name}</span>
              <span className="text-xs font-semibold whitespace-nowrap text-[#4F46E5]">{version.content.role}</span>
              <div className="h-px w-full shrink-0 bg-[#E5E7EB]" />
              <div className="h-1.5 w-[90%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
              <div className="h-1.5 w-[68%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
              <div className="h-1.5 w-[80%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
              <span className="mt-1 text-[10.5px] font-bold tracking-[1px] whitespace-nowrap text-[#9CA3AF]">
                EXPERIENCE
              </span>
              <div className="h-1.5 w-[85%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
              <div className="h-1.5 w-[63%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
              <div className="h-1.5 w-[72%] shrink-0 rounded-[3px] bg-[#E5E7EB]" />
            </div>

            <div className="flex w-full items-center justify-between gap-4">
              <span className="text-xs whitespace-nowrap text-text-muted">
                Restoring creates a new version — this draft is kept safe
              </span>
              <button
                type="button"
                onClick={onRestore}
                className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <RotateCcw className="size-3.5" />
                Restore this version
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
