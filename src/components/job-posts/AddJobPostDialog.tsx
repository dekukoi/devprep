"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface JobPostFormValues {
  title: string;
  company: string;
  content: string;
}

interface AddJobPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  initialValues?: JobPostFormValues;
  onSubmit: (values: JobPostFormValues) => void;
}

const EMPTY_VALUES: JobPostFormValues = { title: "", company: "", content: "" };

export function AddJobPostDialog({ open, onOpenChange, mode, initialValues, onSubmit }: AddJobPostDialogProps) {
  const [values, setValues] = React.useState<JobPostFormValues>(initialValues ?? EMPTY_VALUES);

  const isValid = values.title.trim().length > 0 && values.content.trim().length > 0;

  const handleOpenChange = (next: boolean) => {
    if (next) setValues(initialValues ?? EMPTY_VALUES);
    onOpenChange(next);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ title: values.title.trim(), company: values.company.trim(), content: values.content.trim() });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex w-[520px] flex-col gap-4 p-6">
        <DialogTitle>{mode === "edit" ? "Edit Job Post" : "Add Job Post"}</DialogTitle>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="job-title" className="text-xs font-medium text-text-secondary">
            Job title
          </label>
          <Input
            id="job-title"
            value={values.title}
            onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
            placeholder="e.g. Senior Backend Engineer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="job-company" className="text-xs font-medium text-text-secondary">
            Company
          </label>
          <Input
            id="job-company"
            value={values.company}
            onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
            placeholder="e.g. Acme App"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="job-description" className="text-xs font-medium text-text-secondary">
            Job description
          </label>
          <textarea
            id="job-description"
            value={values.content}
            onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
            placeholder="Paste the full job description here..."
            rows={6}
            className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="flex justify-end gap-2.5">
          <DialogClose asChild>
            <Button variant="secondary" className="border border-border-strong">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!isValid} onClick={handleSubmit}>
            {mode === "edit" ? "Save" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
