import { CheckCheck } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TEMPLATE_FAMILY, TEMPLATE_VARIANT_LABEL } from "@/lib/constants/cv-templates";
import type { CVTemplate } from "@/types/cv";

interface TemplatePreviewModalProps {
  template: CVTemplate | null;
  onOpenChange: (open: boolean) => void;
  onUse: (template: CVTemplate) => void;
}

export function TemplatePreviewModal({ template, onOpenChange, onUse }: TemplatePreviewModalProps) {
  const variantLabel = template ? TEMPLATE_VARIANT_LABEL[template.variant] : "";
  const family = template ? TEMPLATE_FAMILY[template.name] : "";

  return (
    <Dialog open={template !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[560px] flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base">
              {template ? `${template.name} — ${variantLabel}` : ""}
            </DialogTitle>
            <span className="text-xs text-text-muted">{family} family</span>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Close"
              className="flex size-[30px] items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </DialogClose>
        </div>

        <div className="flex h-[300px] flex-col gap-3.5 overflow-hidden rounded-[var(--radius-sm)] bg-white px-9 py-8">
          <span className="text-lg font-bold text-[#111827]">Alex Morgan</span>
          <span className="text-[13px] font-semibold text-accent">Backend Engineer</span>
          <div className="h-px w-full bg-[#E5E7EB]" />
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-[85%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[65%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[75%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[55%] rounded-[3px] bg-[#E5E7EB]" />
          </div>
          <span className="mt-2 text-[11px] font-bold tracking-wider text-[#9CA3AF]">EXPERIENCE</span>
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-[80%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[65%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[85%] rounded-[3px] bg-[#E5E7EB]" />
            <div className="h-1.5 w-[50%] rounded-[3px] bg-[#E5E7EB]" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Preview only — content shown is a sample</span>
          <button
            type="button"
            onClick={() => template && onUse(template)}
            className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border-2 border-accent bg-accent px-4.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <CheckCheck className="size-3.5" />
            Use this template
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
