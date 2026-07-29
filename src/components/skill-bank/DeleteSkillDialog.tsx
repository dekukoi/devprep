import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface DeleteSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  onConfirm: () => void;
}

export function DeleteSkillDialog({ open, onOpenChange, skillName, onConfirm }: DeleteSkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[380px] flex-col gap-4 p-5">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#7F1D1D33]">
          <TriangleAlert className="size-[18px] text-sev-missing" />
        </span>
        <div className="flex flex-col gap-1.5">
          <DialogTitle className="text-base">Delete this skill entry?</DialogTitle>
          <DialogDescription>
            This will remove &ldquo;{skillName}&rdquo; from your Skill Bank. It will no longer factor into gap
            analysis or CV generation. This can&rsquo;t be undone.
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
