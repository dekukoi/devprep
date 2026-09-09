import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  onConfirm: () => void;
}

export function DeleteProjectDialog({ open, onOpenChange, projectTitle, onConfirm }: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[420px] flex-col gap-4 p-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#7F1D1D33]">
          <TriangleAlert className="size-[18px] text-sev-missing" />
        </span>
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-base">Delete this project?</DialogTitle>
          <DialogDescription>
            This will remove &ldquo;{projectTitle}&rdquo; from your Projects. It will no longer be available to
            include in a CV. This can&rsquo;t be undone.
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
