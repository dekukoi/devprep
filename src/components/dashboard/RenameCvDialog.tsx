"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface RenameCvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "rename" | "duplicate";
  initialTitle: string;
  onConfirm: (title: string) => void;
}

export function RenameCvDialog({ open, onOpenChange, mode, initialTitle, onConfirm }: RenameCvDialogProps) {
  const [title, setTitle] = React.useState(initialTitle);
  const isDuplicate = mode === "duplicate";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[380px] flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <DialogTitle>{isDuplicate ? "Duplicate CV" : "Rename CV"}</DialogTitle>
          <DialogDescription>
            {isDuplicate ? "Give the duplicate a new title." : "Choose a new title for this CV."}
          </DialogDescription>
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="CV title"
          autoFocus
        />
        <div className="flex justify-end gap-2.5">
          <DialogClose asChild>
            <Button variant="secondary" className="border border-border-strong">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={title.trim().length === 0}
            onClick={() => {
              onConfirm(title.trim());
              onOpenChange(false);
            }}
          >
            {isDuplicate ? "Duplicate" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
