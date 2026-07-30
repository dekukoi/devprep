"use client";

import * as React from "react";
import { Calendar, Check, Link, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CertificationView } from "@/lib/certifications-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export interface CertificationFormValues {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  linkedSkillIds: string[];
}

interface CertificationEntryPanelProps {
  mode: "add" | "edit";
  editingEntry?: CertificationView | null;
  allSkills: SkillOptionView[];
  onCancel: () => void;
  onSave: (values: CertificationFormValues) => void;
}

function toMonthValue(iso: string | null) {
  return iso ? iso.slice(0, 7) : "";
}

function fromMonthValue(month: string) {
  return month.trim() === "" ? null : `${month}-01T00:00:00.000Z`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-normal text-text-secondary">{children}</span>;
}

export function CertificationEntryPanel({
  mode,
  editingEntry,
  allSkills,
  onCancel,
  onSave,
}: CertificationEntryPanelProps) {
  const [name, setName] = React.useState(editingEntry?.name ?? "");
  const [issuer, setIssuer] = React.useState(editingEntry?.issuer ?? "");
  const [issueDate, setIssueDate] = React.useState(
    toMonthValue(editingEntry?.issueDate ?? new Date().toISOString()),
  );
  const [expiryDate, setExpiryDate] = React.useState(toMonthValue(editingEntry?.expiryDate ?? null));
  const [credentialUrl, setCredentialUrl] = React.useState(editingEntry?.credentialUrl ?? "");
  const [skillIds, setSkillIds] = React.useState<string[]>(editingEntry?.linkedSkillIds ?? []);
  const [skillQuery, setSkillQuery] = React.useState("");
  const [addSkillOpen, setAddSkillOpen] = React.useState(false);

  const issueInputRef = React.useRef<HTMLInputElement>(null);
  const expiryInputRef = React.useRef<HTMLInputElement>(null);

  const skillNameById = React.useMemo(() => new Map(allSkills.map((s) => [s.id, s.name])), [allSkills]);
  const availableSkills = allSkills.filter(
    (s) => !skillIds.includes(s.id) && s.name.toLowerCase().includes(skillQuery.trim().toLowerCase()),
  );

  const handleAddSkill = (skill: SkillOptionView) => {
    setSkillIds((prev) => [...prev, skill.id]);
    setSkillQuery("");
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillIds((prev) => prev.filter((id) => id !== skillId));
  };

  const canSave = name.trim() !== "" && issuer.trim() !== "" && issueDate.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      issuer: issuer.trim(),
      issueDate: `${issueDate}-01T00:00:00.000Z`,
      expiryDate: fromMonthValue(expiryDate),
      credentialUrl: credentialUrl.trim() === "" ? null : credentialUrl.trim(),
      linkedSkillIds: skillIds,
    });
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-[22px] rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-6 lg:w-[340px]">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">
          {mode === "add" ? "New Certification" : "Edit Certification"}
        </h3>
        <p className="text-xs text-text-muted">
          {mode === "add" ? "Log a credential that backs up your skills." : "Update this credential's details."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Name</FieldLabel>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. AWS Certified Cloud Practitioner"
          className="w-full border-b-2 border-accent bg-transparent px-0.5 pb-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Issuer</FieldLabel>
        <input
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          placeholder="e.g. Amazon Web Services"
          className="w-full border-b border-border-strong bg-transparent px-0.5 pb-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Issue date</FieldLabel>
        <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
          <input
            ref={issueInputRef}
            type="month"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full bg-transparent text-sm text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <button
            type="button"
            aria-label="Open issue date picker"
            onClick={() => issueInputRef.current?.showPicker?.()}
            className="shrink-0 text-text-muted"
          >
            <Calendar className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel>Expiry date (optional)</FieldLabel>
          {expiryDate !== "" && (
            <button
              type="button"
              onClick={() => setExpiryDate("")}
              className="text-[11px] font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
          <input
            ref={expiryInputRef}
            type="month"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full bg-transparent text-sm text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <button
            type="button"
            aria-label="Open expiry date picker"
            onClick={() => expiryInputRef.current?.showPicker?.()}
            className="shrink-0 text-text-muted"
          >
            <Calendar className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Credential URL (optional)</FieldLabel>
        <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
          <input
            value={credentialUrl ?? ""}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="e.g. credly.com/badges/…"
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <Link className="size-3.5 shrink-0 text-text-muted" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Skills (optional)</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          {skillIds.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base px-2.5 py-1.5"
            >
              <span className="text-xs text-text-secondary">{skillNameById.get(id) ?? id}</span>
              <button
                type="button"
                aria-label={`Remove ${skillNameById.get(id) ?? "skill"}`}
                onClick={() => handleRemoveSkill(id)}
                className="text-text-muted transition-colors hover:text-text-primary"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <Popover open={addSkillOpen} onOpenChange={setAddSkillOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-border-strong"
              >
                <Plus className="size-3" />
                Add
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[260px] p-0">
              <div className="flex items-center gap-2 border-b border-border-strong px-3 py-2.5">
                <Search className="size-3.5 shrink-0 text-text-muted" />
                <input
                  autoFocus
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Search taxonomy…"
                  className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <div className="max-h-[220px] overflow-y-auto py-1">
                {availableSkills.length === 0 ? (
                  <p className="px-3 py-2.5 text-center text-xs text-text-muted">No matching skills.</p>
                ) : (
                  availableSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="w-full px-3 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-accent-soft hover:text-text-primary"
                    >
                      {skill.name}
                    </button>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          Cancel
        </button>
        <Button onClick={handleSave} disabled={!canSave}>
          <Check />
          Save certification
        </Button>
      </div>
    </div>
  );
}
