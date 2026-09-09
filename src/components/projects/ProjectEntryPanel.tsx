"use client";

import * as React from "react";
import { Calendar, Check, ChevronDown, GripVertical, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ProjectExperienceOption, ProjectView } from "@/lib/projects-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export interface ProjectFormValues {
  title: string;
  description: string | null;
  bullets: string[];
  startDate: string | null;
  endDate: string | null;
  experienceId: string | null;
  linkedSkillIds: string[];
}

interface ProjectEntryPanelProps {
  mode: "add" | "edit";
  editingEntry?: ProjectView | null;
  defaultExperienceId?: string | null;
  allSkills: SkillOptionView[];
  experienceOptions: ProjectExperienceOption[];
  onCancel: () => void;
  onSave: (values: ProjectFormValues) => void;
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

export function ProjectEntryPanel({
  mode,
  editingEntry,
  defaultExperienceId,
  allSkills,
  experienceOptions,
  onCancel,
  onSave,
}: ProjectEntryPanelProps) {
  const [title, setTitle] = React.useState(editingEntry?.title ?? "");
  const [description, setDescription] = React.useState(editingEntry?.description ?? "");
  const [bullets, setBullets] = React.useState<string[]>(editingEntry?.bullets ?? []);
  const [startDate, setStartDate] = React.useState(toMonthValue(editingEntry?.startDate ?? null));
  const [endDate, setEndDate] = React.useState(toMonthValue(editingEntry?.endDate ?? null));
  const [experienceId, setExperienceId] = React.useState<string | null>(
    editingEntry ? editingEntry.experienceId : (defaultExperienceId ?? null),
  );
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [linkQuery, setLinkQuery] = React.useState("");
  const [skillIds, setSkillIds] = React.useState<string[]>(editingEntry?.linkedSkillIds ?? []);
  const [skillQuery, setSkillQuery] = React.useState("");
  const [skillComboOpen, setSkillComboOpen] = React.useState(false);
  const dragIndex = React.useRef<number | null>(null);

  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  const skillNameById = React.useMemo(() => new Map(allSkills.map((s) => [s.id, s.name])), [allSkills]);
  const availableSkills = allSkills.filter(
    (s) => !skillIds.includes(s.id) && s.name.toLowerCase().includes(skillQuery.trim().toLowerCase()),
  );
  const filteredExperiences = experienceOptions.filter((e) =>
    e.label.toLowerCase().includes(linkQuery.trim().toLowerCase()),
  );
  const selectedExperienceLabel = experienceId
    ? (experienceOptions.find((e) => e.id === experienceId)?.label ?? "None — standalone")
    : "None — standalone";

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
    setSkillComboOpen(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    setSkillIds((prev) => prev.filter((id) => id !== skillId));
  };

  const canSave = title.trim() !== "";

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      description: description.trim() === "" ? null : description.trim(),
      bullets: bullets.map((b) => b.trim()).filter((b) => b !== ""),
      startDate: fromMonthValue(startDate),
      endDate: fromMonthValue(endDate),
      experienceId,
      linkedSkillIds: skillIds,
    });
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-6 lg:w-[340px]">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text-primary">{mode === "add" ? "Add Project" : "Edit Project"}</h3>
        <p className="text-xs text-text-muted">
          {mode === "add" ? "Log a new project entry." : "Update the details for this project entry."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Title</FieldLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. API Gateway Rate Limiter"
          className="w-full border-b-2 border-accent bg-transparent px-0.5 pb-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you build, and why?"
          rows={3}
          className="w-full resize-none rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base p-2.5 text-[12.5px] leading-[18px] text-text-primary placeholder:text-text-muted focus:border-border-strong focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldLabel>Bullets</FieldLabel>
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
              className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-muted focus:outline-none"
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
        <button
          type="button"
          onClick={handleAddBullet}
          className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle p-2.5 text-[12px] font-medium text-accent transition-colors hover:border-border-strong"
        >
          <Plus className="size-3.5" />
          Add bullet
        </button>
      </div>

      <div className="flex w-full items-start gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <FieldLabel>Start date</FieldLabel>
          <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
            <input
              ref={startInputRef}
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent text-[13px] text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <button
              type="button"
              aria-label="Open start date picker"
              onClick={() => startInputRef.current?.showPicker?.()}
              className="shrink-0 text-text-muted"
            >
              <Calendar className="size-3.5" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <FieldLabel>End date</FieldLabel>
          <div className="flex items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5">
            <input
              ref={endInputRef}
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent text-[13px] text-text-primary [color-scheme:dark] focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <button
              type="button"
              aria-label="Open end date picker"
              onClick={() => endInputRef.current?.showPicker?.()}
              className="shrink-0 text-text-muted"
            >
              <Calendar className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Link to an Experience</FieldLabel>
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 border-b border-border-strong px-0.5 pb-2.5 text-left"
            >
              <span className="text-[13px] text-text-primary">{selectedExperienceLabel}</span>
              <ChevronDown className="size-3.5 shrink-0 text-text-muted" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[292px] p-0">
            <div className="flex items-center gap-2 border-b border-border-strong px-3 py-2.5">
              <Search className="size-3.5 shrink-0 text-text-muted" />
              <input
                autoFocus
                value={linkQuery}
                onChange={(e) => setLinkQuery(e.target.value)}
                placeholder="Search experiences…"
                className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div className="max-h-[220px] overflow-y-auto py-1">
              <button
                type="button"
                onClick={() => {
                  setExperienceId(null);
                  setLinkOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-accent-soft",
                  experienceId === null ? "bg-accent-soft font-medium text-text-primary" : "text-text-secondary",
                )}
              >
                None — standalone
              </button>
              {filteredExperiences.map((exp) => (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => {
                    setExperienceId(exp.id);
                    setLinkOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-accent-soft",
                    experienceId === exp.id ? "bg-accent-soft font-medium text-text-primary" : "text-text-secondary",
                  )}
                >
                  {exp.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Skills used</FieldLabel>
        {skillIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {skillIds.map((id) => (
              <span
                key={id}
                className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-accent bg-accent-soft px-2.5 py-1.5"
              >
                <span className="text-xs font-medium text-text-primary">{skillNameById.get(id) ?? id}</span>
                <button
                  type="button"
                  aria-label={`Remove ${skillNameById.get(id) ?? "skill"}`}
                  onClick={() => handleRemoveSkill(id)}
                  className="text-text-muted transition-colors hover:text-text-primary"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <div className="flex items-center gap-2 border-b border-border-strong px-0.5 pb-2.5">
            <Search className="size-3.5 shrink-0 text-text-muted" />
            <input
              value={skillQuery}
              onChange={(e) => {
                setSkillQuery(e.target.value);
                setSkillComboOpen(true);
              }}
              onFocus={() => setSkillComboOpen(true)}
              onBlur={() => window.setTimeout(() => setSkillComboOpen(false), 150)}
              onKeyDown={(e) => e.key === "Escape" && setSkillComboOpen(false)}
              placeholder="Search skill taxonomy…"
              aria-label="Search skill taxonomy"
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          {skillComboOpen && (
            <div className="absolute top-[calc(100%+6px)] z-10 flex max-h-[220px] w-full flex-col overflow-y-auto rounded-[var(--radius-sm)] border border-border-subtle bg-bg-elevated py-1 shadow-[0_8px_24px_#00000080]">
              {availableSkills.length === 0 ? (
                <p className="px-3.5 py-2.5 text-center text-xs text-text-muted">No matching skills.</p>
              ) : (
                availableSkills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="px-3.5 py-2.5 text-left text-[13px] text-text-secondary transition-colors hover:bg-accent-soft hover:text-text-primary"
                  >
                    {skill.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <button type="button" onClick={onCancel} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
          Cancel
        </button>
        <Button onClick={handleSave} disabled={!canSave}>
          <Check />
          Save project
        </Button>
      </div>
    </div>
  );
}
