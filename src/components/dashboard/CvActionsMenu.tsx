import { Ellipsis, FileDown, History, LayoutTemplate, PencilLine, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CvActionsMenuProps {
  onRename: () => void;
  onChangeTemplate: () => void;
  onExportPdf: () => void;
  onViewVersions: () => void;
  onDelete: () => void;
}

export function CvActionsMenu({ onRename, onChangeTemplate, onExportPdf, onViewVersions, onDelete }: CvActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Ellipsis className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[190px]">
        <DropdownMenuItem onClick={onRename}>
          <PencilLine className="size-3.5 text-text-secondary" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onChangeTemplate}>
          <LayoutTemplate className="size-3.5 text-text-secondary" />
          Change template
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportPdf}>
          <FileDown className="size-3.5 text-text-secondary" />
          Export PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onViewVersions}>
          <History className="size-3.5 text-text-secondary" />
          View versions
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-sev-missing">
          <Trash2 className="size-3.5 text-sev-missing" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
