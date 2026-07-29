import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface DeleteJobPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: string;
  onConfirm: () => void;
}

export function DeleteJobPostDialog({ open, onOpenChange, company, onConfirm }: DeleteJobPostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[380px] flex-col gap-4 p-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#7F1D1D33]">
          <TriangleAlert className="size-[18px] text-sev-missing" />
        </span>
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-base">Delete this job post?</DialogTitle>
          <DialogDescription>
            This will permanently delete &ldquo;{company}&rdquo;. Any comparisons run against it and CVs tailored to it
            will also be affected. This can&rsquo;t be undone.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-2.5">
          <DialogClose asChild>
            <Button variant="secondary" className="border border-border-strong">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-sev-missing text-white hover:bg-sev-missing/90"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
