"use client";

import { Briefcase, FolderKanban, Package, Trash2 } from "lucide-react";
import { formatDateRange } from "@/lib/format";
import type { ProjectView } from "@/lib/projects-data";

interface ProjectCardProps {
  project: ProjectView;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
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
      className="flex w-full flex-col gap-2.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2">
            <FolderKanban className="size-4 shrink-0 text-accent" />
            <span className="text-[15px] font-semibold text-text-primary">{project.title}</span>
          </span>
          <span className="flex w-fit items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base px-2.5 py-1">
            {project.experienceLabel ? (
              <Briefcase className="size-2.5 shrink-0 text-text-muted" />
            ) : (
              <Package className="size-2.5 shrink-0 text-text-muted" />
            )}
            <span className="text-[11.5px] font-medium text-text-secondary whitespace-nowrap">
              {project.experienceLabel ?? "Standalone"}
            </span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          {project.startDate && (
            <span className="text-[11.5px] whitespace-nowrap text-text-muted">
              {formatDateRange(project.startDate, project.endDate)}
            </span>
          )}
          <button
            type="button"
            aria-label="Delete project"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex size-6 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-bg-surface-2 hover:text-sev-missing"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {project.description && <p className="text-[12.5px] leading-[18px] text-text-secondary">{project.description}</p>}

      {project.linkedSkillNames.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {project.linkedSkillNames.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-accent-soft px-2.5 py-[5px]"
            >
              <span className="size-[5px] shrink-0 rounded-full bg-accent" />
              <span className="text-[11.5px] font-medium text-text-primary">{name}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
