import Link from "next/link";
import { Copy, FileText, Pencil, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CvActionsMenu } from "./CvActionsMenu";

export interface CvRowData {
  id: string;
  role: string;
  targetCompany: string | null;
  version: number;
  editedRelative: string;
  isStale: boolean;
}

interface CvListRowProps extends CvRowData {
  className?: string;
  onDuplicate: () => void;
  onRename: () => void;
  onChangeTemplate: () => void;
  onExportPdf: () => void;
  onViewVersions: () => void;
  onDelete: () => void;
}

export function CvListRow({
  id,
  role,
  targetCompany,
  version,
  editedRelative,
  isStale,
  className,
  onDuplicate,
  onRename,
  onChangeTemplate,
  onExportPdf,
  onViewVersions,
  onDelete,
}: CvListRowProps) {
  return (
    <div className={cn("flex w-full items-center gap-4 px-5 py-4", className)}>
      <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2">
        <FileText className="size-[18px] text-text-secondary" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-text-primary">{role}</span>
          {isStale && (
            <span className="flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] border border-sev-stale bg-[#3A3410] px-1.5 py-0.5 text-[10px] font-semibold text-sev-stale">
              <TriangleAlert className="size-[11px]" />
              Stale field
            </span>
          )}
        </div>
        {targetCompany && <span className="truncate text-xs text-text-secondary">Target: {targetCompany}</span>}
      </div>

      <span className="shrink-0 rounded-[var(--radius-sm)] bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
        v{version}
      </span>

      <span className="hidden w-[120px] shrink-0 text-right text-xs text-text-muted sm:block">
        Edited {editedRelative}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/cvs/${id}/edit`}
          aria-label="Edit CV"
          className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Pencil className="size-4" />
        </Link>
        <button
          type="button"
          aria-label="Duplicate CV"
          onClick={onDuplicate}
          className="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Copy className="size-4" />
        </button>
        <CvActionsMenu
          onRename={onRename}
          onChangeTemplate={onChangeTemplate}
          onExportPdf={onExportPdf}
          onViewVersions={onViewVersions}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
