import { Check, CheckCheck, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProLockBadge } from "@/components/shared";
import { TEMPLATE_FAMILY, TEMPLATE_VARIANT_LABEL } from "@/lib/constants/cv-templates";
import type { CVTemplate } from "@/types/cv";
import { CvPreviewThumbnail } from "./CvPreviewThumbnail";

interface TemplateCardProps {
  template: CVTemplate;
  selected: boolean;
  locked: boolean;
  onPreview: () => void;
  onUse: () => void;
}

export function TemplateCard({ template, selected, locked, onPreview, onUse }: TemplateCardProps) {
  const variantLabel = TEMPLATE_VARIANT_LABEL[template.variant];
  const family = TEMPLATE_FAMILY[template.name];

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-md)] bg-bg-surface",
        selected ? "border-2 border-accent" : "border border-border-subtle",
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview ${template.name} — ${variantLabel}`}
        className="relative flex h-[200px] items-center justify-center bg-bg-base p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        <CvPreviewThumbnail name={template.name} variant={template.variant} />

        {selected && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-white">
            <Check className="size-3" />
            Selected
          </span>
        )}
      </button>

      <div className="h-px w-full bg-border-subtle" />

      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-text-primary">{template.name}</span>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>{variantLabel}</span>
            <span className="size-[3px] rounded-full bg-text-muted" />
            <span>{family}</span>
          </div>
          {locked && <ProLockBadge className="mt-1 self-start" />}
        </div>

        <button
          type="button"
          onClick={onUse}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-3.5 py-2.5 text-[13px] font-semibold transition-colors",
            selected
              ? "border-2 border-accent bg-accent text-white"
              : "border border-border-strong bg-bg-elevated text-text-primary hover:border-border-strong/80",
          )}
        >
          {selected ? <CheckCheck className="size-3.5" /> : <FilePlus className="size-3.5 text-text-secondary" />}
          {selected ? "Selected" : "Use template"}
        </button>
      </div>
    </div>
  );
}
