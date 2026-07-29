"use client";

import { Briefcase, ChevronRight, Folder, Layers, Plus, Trash2 } from "lucide-react";
import { formatDateRange } from "@/lib/format";
import type { ExperienceView } from "@/lib/experience-data";

const BULLET_PREVIEW_COUNT = 2;

interface ExperienceCardProps {
  experience: ExperienceView;
  onEdit: () => void;
  onDelete: () => void;
  onAddProject: () => void;
}

export function ExperienceCard({ experience, onEdit, onDelete, onAddProject }: ExperienceCardProps) {
  const previewBullets = experience.bullets.slice(0, BULLET_PREVIEW_COUNT);
  const remainingBullets = experience.bullets.length - previewBullets.length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className="flex w-full flex-col gap-3.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-5 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-text-primary">{experience.title}</span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="size-3.5 shrink-0 text-text-muted" />
            <span className="text-[13px] text-text-secondary">{experience.company}</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="text-[11.5px] font-medium text-accent whitespace-nowrap">
              {formatDateRange(experience.startDate, experience.endDate)}
            </span>
          </span>
          <button
            type="button"
            aria-label="Delete experience"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex size-6 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-bg-surface-2 hover:text-sev-missing"
          >
            <Trash2 className="size-3.5" />
          </button>
          <ChevronRight className="size-4 text-text-muted" />
        </div>
      </div>

      {experience.bullets.length > 0 && (
        <div className="flex w-full flex-col gap-1.5">
          {previewBullets.map((bullet, i) => (
            <div key={i} className="flex w-full items-start gap-2">
              <span className="mt-[7px] size-[5px] shrink-0 rounded-full bg-text-muted" />
              <span className="flex-1 text-[13px] text-text-secondary">{bullet}</span>
            </div>
          ))}
          {remainingBullets > 0 && (
            <span className="pl-[13px] text-[12px] text-text-muted">
              +{remainingBullets} more bullet{remainingBullets === 1 ? "" : "s"}
            </span>
          )}
        </div>
      )}

      {experience.linkedSkillNames.length > 0 && (
        <div className="flex w-full flex-wrap gap-2">
          {experience.linkedSkillNames.map((name) => (
            <span
              key={name}
              className="rounded-full border border-border-subtle bg-bg-base px-2.5 py-[5px] text-[12px] text-text-secondary"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="h-px w-full bg-border-subtle" />

      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Layers className="size-3.5 shrink-0 text-text-muted" />
          <span className="text-[12px] text-text-muted">Projects:</span>
          {experience.projects.length === 0 ? (
            <span className="text-[12px] text-text-muted">None linked yet</span>
          ) : (
            experience.projects.map((project) => (
              <span
                key={project.id}
                className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-surface-2 px-2.5 py-[5px] text-[12px] text-text-secondary"
              >
                <Folder className="size-3 shrink-0 text-text-muted" />
                {project.title}
              </span>
            ))
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddProject();
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-surface-2 px-2.5 py-[5px] text-[12px] font-medium text-accent transition-colors hover:border-border-strong"
        >
          <Plus className="size-3" />
          Add project
        </button>
      </div>
    </div>
  );
}
