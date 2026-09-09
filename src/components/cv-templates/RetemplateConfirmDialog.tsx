import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TEMPLATE_VARIANT_LABEL } from "@/lib/constants/cv-templates";
import type { CVTemplate } from "@/types/cv";

interface RetemplateConfirmDialogProps {
  template: CVTemplate | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RetemplateConfirmDialog({ template, onOpenChange, onConfirm }: RetemplateConfirmDialogProps) {
  const variantLabel = template ? TEMPLATE_VARIANT_LABEL[template.variant] : "";

  return (
    <Dialog open={template !== null} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[400px] flex-col gap-4 p-6">
        <span className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-[#78350F33]">
          <TriangleAlert className="size-5 text-sev-below" />
        </span>
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-[15px]">
            {template ? `Switch to ${template.name} — ${variantLabel}?` : ""}
          </DialogTitle>
          <DialogDescription>
            Your content will be re-arranged into this layout. Nothing is deleted — you can switch back or restore
            a previous version anytime.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-2.5">
          <DialogClose asChild>
            <Button variant="secondary" className="border border-border-strong">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
