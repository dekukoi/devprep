"use client";

import * as React from "react";
import { Calendar, Check, GripVertical, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ExperienceView } from "@/lib/experience-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export interface ExperienceFormValues {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  linkedSkillIds: string[];
}

interface ExperienceEntryPanelProps {
  mode: "add" | "edit";
  editingEntry?: ExperienceView | null;
  allSkills: SkillOptionView[];
  onCancel: () => void;
  onSave: (values: ExperienceFormValues) => void;
}

function toMonthValue(iso: string) {
  return iso.slice(0, 7);
}

function fromMonthValue(month: string) {
  return `${month}-01T00:00:00.000Z`;
}

function FieldLabel({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className={cn("text-xs font-normal", muted ? "text-text-muted" : "text-text-secondary")}>{children}</span>
  );
}

export function ExperienceEntryPanel({ mode, editingEntry, allSkills, onCancel, onSave }: ExperienceEntryPanelProps) {
  const [company, setCompany] = React.useState(editingEntry?.company ?? "");
  const [title, setTitle] = React.useState(editingEntry?.title ?? "");
  const [startDate, setStartDate] = React.useState(
    editingEntry ? toMonthValue(editingEntry.startDate) : toMonthValue(new Date().toISOString()),
  );
  const [currentlyWorking, setCurrentlyWorking] = React.useState(editingEntry ? editingEntry.endDate === null : true);
  const [endDate, setEndDate] = React.useState(
    editingEntry?.endDate ? toMonthValue(editingEntry.endDate) : toMonthValue(new Date().toISOString()),
  );
  const [bullets, setBullets] = React.useState<string[]>(editingEntry?.bullets ?? []);
  const [skillIds, setSkillIds] = React.useState<string[]>(editingEntry?.linkedSkillIds ?? []);
  const [skillQuery, setSkillQuery] = React.useState("");
  const [addSkillOpen, setAddSkillOpen] = React.useState(false);
  const dragIndex = React.useRef<number | null>(null);

  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  const skillNameById = React.useMemo(() => new Map(allSkills.map((s) => [s.id, s.name])), [allSkills]);
  const availableSkills = allSkills.filter(
    (s) => !skillIds.includes(s.id) && s.name.toLowerCase().includes(skillQuery.trim().toLowerCase()),
  );

  const handleBulletChange = (index: number, value: string) => {
    setBullets((prev) => prev.map((b, i) => (i === index ? value : b)));
  };

  const handleRemoveBullet = (index: number) => {
    setBullets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBullet = () => {
    setBullets((prev) => [...prev, ""]);
  };

  const handleDrop = (dropIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === dropIndex) return;
    setBullets((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
  };

  const handleAddSkill = (skill: SkillOptionView) => {
    setSkillIds((prev) => [...prev, skill.id]);
    setSkillQuery("");
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillIds((prev) => prev.filter((id) => id !== skillId));
  };

  const canSave = company.trim() !== "" && title.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      company: company.trim(),
      title: title.trim(),
      startDate: fromMonthValue(startDate),
      endDate: currentlyWorking ? null : fromMonthValue(endDate),
      bullets: bullets.map((b) => b.trim()).filter((b) => b !== ""),
      linkedSkillIds: skillIds,
    });
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-[22px] rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-6 lg:w-[340px]">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">
          {mode === "add" ? "Add experience" : "Edit experience"}
        </h3>
        <p className="text-xs text-text-muted">
          {mode === "add" ? "Log a new role, its impact, and linked skills." : "Update role details, bullets, and linked skills."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Company</FieldLabel>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Lumen Systems"
          className="w-full border-b-2 border-border-strong bg-transparent px-0.5 pb-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Title</FieldLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Backend Engineer"
          className="w-full border-b-2 border-border-strong bg-transparent px-0.5 pb-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex w-full items-start gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <FieldLabel>Start date</FieldLabel>
          <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
            <input
              ref={startInputRef}
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-sm text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <button
              type="button"
              aria-label="Open start date picker"
              onClick={() => startInputRef.current?.showPicker?.()}
              className="text-text-muted"
            >
              <Calendar className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <FieldLabel muted={currentlyWorking}>End date</FieldLabel>
          <div
            className={cn(
              "flex items-center justify-between gap-2 border-b px-0.5 pb-2.5",
              currentlyWorking ? "border-border-subtle" : "border-border-strong",
            )}
          >
            {currentlyWorking ? (
              <span className="text-sm text-text-muted">—</span>
            ) : (
              <input
                ref={endInputRef}
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            )}
            <button
              type="button"
              aria-label="Open end date picker"
              disabled={currentlyWorking}
              onClick={() => endInputRef.current?.showPicker?.()}
              className="text-text-muted disabled:opacity-40"
            >
              <Calendar className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">I currently work here</span>
        <button
          type="button"
          role="switch"
          aria-checked={currentlyWorking}
          onClick={() => setCurrentlyWorking((v) => !v)}
          className={cn(
            "flex h-[22px] w-10 shrink-0 items-center rounded-full p-0.5 transition-colors",
            currentlyWorking ? "justify-end bg-accent" : "justify-start bg-bg-elevated",
          )}
        >
          <span className="size-[18px] rounded-full bg-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldLabel>Accomplishment bullets</FieldLabel>
        {bullets.map((bullet, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base p-2.5"
          >
            <GripVertical className="size-3.5 shrink-0 cursor-grab text-text-muted" />
            <input
              value={bullet}
              onChange={(e) => handleBulletChange(index, e.target.value)}
              placeholder="Describe the impact…"
              className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label="Remove bullet"
              onClick={() => handleRemoveBullet(index)}
              className="shrink-0 text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {bullets.length === 0 && (
          <p className="text-[11.5px] text-sev-below">Add at least one bullet to use this in a CV.</p>
        )}
        <button
          type="button"
          onClick={handleAddBullet}
          className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 p-2.5 text-[13px] font-medium text-accent transition-colors hover:border-border-strong"
        >
          <Plus className="size-3.5" />
          Add bullet
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Skills used in this role</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          {skillIds.map((id) => (
            <span
              key={id}
              className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-base px-2.5 py-1.5 text-[12.5px] text-text-secondary"
            >
              {skillNameById.get(id) ?? id}
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
                className="flex items-center gap-1.5 rounded-full border border-border-strong bg-bg-surface-2 px-2.5 py-1.5 text-[12.5px] font-medium text-accent transition-colors hover:border-accent"
              >
                <Plus className="size-3" />
                Add skill
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
        <button type="button" onClick={onCancel} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
          Cancel
        </button>
        <Button onClick={handleSave} disabled={!canSave}>
          <Check />
          Save experience
        </Button>
      </div>
    </div>
  );
}
