"use client";

import { Banknote, Briefcase, CalendarClock, Clipboard, Ellipsis, FileText, GitCompare, MapPin, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ParsedRequirementsPanel } from "./ParsedRequirementsPanel";
import type { JobPostFull, SkillOption } from "@/lib/job-posts-data";
import type { ProficiencyLevel } from "@/types/skill";

interface JobPostDetailPanelProps {
  job: JobPostFull;
  availableSkills: SkillOption[];
  onEdit: () => void;
  onDelete: () => void;
  onRunComparison: () => void;
  onChangeLevel: (requirementId: string, level: ProficiencyLevel) => void;
  onToggleMustHave: (requirementId: string, mustHave: boolean) => void;
  onRemoveRequirement: (requirementId: string) => void;
  onAddRequirement: (skill: SkillOption) => void;
  onAssignUnresolved: (unresolvedId: string, skill: SkillOption) => void;
  onDismissUnresolved: (unresolvedId: string) => void;
}

function splitDescription(content: string) {
  const parts = content.split("\n\n").filter(Boolean);
  if (parts.length > 1 && parts.length % 2 === 0) {
    const sections: { heading: string; body: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      sections.push({ heading: parts[i], body: parts[i + 1] });
    }
    return sections;
  }
  return parts.map((body) => ({ heading: null as unknown as string, body }));
}

export function JobPostDetailPanel({
  job,
  availableSkills,
  onEdit,
  onDelete,
  onRunComparison,
  onChangeLevel,
  onToggleMustHave,
  onRemoveRequirement,
  onAddRequirement,
  onAssignUnresolved,
  onDismissUnresolved,
}: JobPostDetailPanelProps) {
  const metaTiles = [
    { icon: Briefcase, label: "Seniority", value: job.seniority },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: CalendarClock, label: "Employment", value: job.employmentType },
    { icon: Banknote, label: "Salary", value: job.salaryRange },
  ].filter((tile) => tile.value);

  const sections = splitDescription(job.content);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col gap-6 overflow-y-auto p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft text-sm font-bold text-accent-hover">
              {(job.company ?? job.title)[0]}
            </span>
            <span className="text-sm font-medium text-text-secondary">{job.company ?? job.title}</span>
          </div>
          <h1 className="text-[26px] font-bold text-text-primary">{job.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong bg-bg-surface-2 px-3.5 py-2.5 text-[13px] font-medium text-text-primary transition-colors hover:border-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Pencil className="size-[15px]" />
            Edit
          </button>
          <button
            type="button"
            onClick={onRunComparison}
            className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <GitCompare className="size-[15px]" />
            Run comparison
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More actions"
                className="flex size-9 items-center justify-center rounded-[var(--radius-sm)] border border-border-strong bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Ellipsis className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[190px]">
              <DropdownMenuItem onClick={onDelete} className="text-sev-missing">
                <Trash2 className="size-3.5 text-sev-missing" />
                Delete job post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {metaTiles.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {metaTiles.map((tile) => (
            <div
              key={tile.label}
              className="flex flex-1 basis-[180px] items-center gap-2.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-surface-2">
                <tile.icon className="size-4 text-text-secondary" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-text-muted">{tile.label}</span>
                <span className="text-[13px] font-semibold text-text-primary">{tile.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-y-auto rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">Job Description</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-bg-surface-2 px-2 py-1 text-[11px] text-text-muted">
              <Clipboard className="size-2.5" />
              Pasted text
            </span>
          </div>
          {sections.map((section, i) => (
            <p key={i} className="text-[13px] leading-5 text-text-secondary">
              {section.heading && (
                <>
                  {section.heading}
                  <br />
                </>
              )}
              {section.body}
            </p>
          ))}
        </div>

        <ParsedRequirementsPanel
          requirements={job.requirements}
          unresolved={job.unresolved}
          availableSkills={availableSkills}
          onChangeLevel={onChangeLevel}
          onToggleMustHave={onToggleMustHave}
          onRemoveRequirement={onRemoveRequirement}
          onAddRequirement={onAddRequirement}
          onAssignUnresolved={onAssignUnresolved}
          onDismissUnresolved={onDismissUnresolved}
        />
      </div>
    </div>
  );
}
