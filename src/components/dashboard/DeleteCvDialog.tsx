import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface DeleteCvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  version: number;
  onConfirm: () => void;
}

export function DeleteCvDialog({ open, onOpenChange, title, version, onConfirm }: DeleteCvDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[340px] flex-col gap-4 p-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#7F1D1D33]">
          <TriangleAlert className="size-[18px] text-sev-missing" />
        </span>
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-base">Delete this CV?</DialogTitle>
          <DialogDescription>
            This will permanently delete &ldquo;{title}&rdquo; (v{version}). This can&rsquo;t be undone.
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
