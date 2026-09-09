"use client";

import * as React from "react";
import { CircleAlert, PackageOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { ProjectsData, ProjectView } from "@/lib/projects-data";
import { ProjectCard } from "./ProjectCard";
import { ProjectEntryPanel, type ProjectFormValues } from "./ProjectEntryPanel";
import { DeleteProjectDialog } from "./DeleteProjectDialog";
import { ProjectsBankSkeleton } from "./ProjectsBankSkeleton";

const INITIAL_LOAD_DELAY_MS = 800;

let localIdCounter = 0;
function makeLocalId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-local-${Date.now()}-${localIdCounter}`;
}

type FilterMode = "all" | "standalone" | "linked";
type SortMode = "recent" | "title";

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: "all", label: "All" },
  { value: "standalone", label: "Standalone" },
  { value: "linked", label: "Linked" },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "title", label: "Title A–Z" },
];

interface ProjectsBankViewProps {
  data: ProjectsData;
  initialExperienceId?: string | null;
}

type PanelState = { mode: "add" | "edit"; entry?: ProjectView } | null;

export function ProjectsBankView({ data, initialExperienceId = null }: ProjectsBankViewProps) {
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [projects, setProjects] = React.useState<ProjectView[]>(data.projects);
  const [filter, setFilter] = React.useState<FilterMode>("all");
  const [sort, setSort] = React.useState<SortMode>("recent");
  const [panel, setPanel] = React.useState<PanelState>(initialExperienceId ? { mode: "add" } : null);
  const [deleteTarget, setDeleteTarget] = React.useState<ProjectView | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const skillNameById = React.useMemo(() => new Map(data.allSkills.map((s) => [s.id, s.name])), [data.allSkills]);
  const experienceLabelById = React.useMemo(
    () => new Map(data.experienceOptions.map((e) => [e.id, e.label])),
    [data.experienceOptions],
  );

  const handleAddClick = () => setPanel({ mode: "add" });
  const handleEditClick = (entry: ProjectView) => setPanel({ mode: "edit", entry });

  const handleSave = (values: ProjectFormValues) => {
    const linkedSkillNames = values.linkedSkillIds
      .map((id) => skillNameById.get(id))
      .filter((n): n is string => Boolean(n));
    const experienceLabel = values.experienceId ? (experienceLabelById.get(values.experienceId) ?? null) : null;

    if (panel?.mode === "edit" && panel.entry) {
      const entryId = panel.entry.id;
      setProjects((prev) =>
        prev.map((p) =>
          p.id === entryId
            ? {
                ...p,
                title: values.title,
                description: values.description,
                bullets: values.bullets,
                startDate: values.startDate,
                endDate: values.endDate,
                experienceId: values.experienceId,
                experienceLabel,
                linkedSkillIds: values.linkedSkillIds,
                linkedSkillNames,
                updatedAt: new Date().toISOString(),
              }
            : p,
        ),
      );
      toast.success("Project updated");
    } else {
      const now = new Date().toISOString();
      const newEntry: ProjectView = {
        id: makeLocalId("proj"),
        title: values.title,
        description: values.description,
        bullets: values.bullets,
        startDate: values.startDate,
        endDate: values.endDate,
        experienceId: values.experienceId,
        experienceLabel,
        linkedSkillIds: values.linkedSkillIds,
        linkedSkillNames,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [newEntry, ...prev]);
      toast.success("Project added");
    }
    setPanel(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    if (panel?.mode === "edit" && panel.entry?.id === deleteTarget.id) setPanel(null);
    toast.success("Project deleted");
  };

  const filteredProjects = projects.filter((p) => {
    if (filter === "standalone") return p.experienceId === null;
    if (filter === "linked") return p.experienceId !== null;
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const defaultExperienceForPanel =
    panel?.mode === "add" && !panel.entry ? initialExperienceId : null;

  const actions = status === "ready" && projects.length > 0 && (
    <Button onClick={handleAddClick}>
      <Plus />
      Add project
    </Button>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Projects"
        subtitle="Side projects, open-source work, and freelance builds that back up your CV."
        actions={actions}
      />

      {status === "loading" && <ProjectsBankSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load your Projects</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching your projects. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-1 rounded-[var(--radius-sm)] border-2 border-accent-hover bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      )}

      {status === "ready" &&
        (projects.length === 0 && !panel ? (
          <EmptyState
            icon={PackageOpen}
            heading="No projects yet"
            body="Log a side project, open-source contribution, or anything that doesn't fit under one role."
            ctaLabel="Add project"
            onCtaClick={handleAddClick}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      className={cn(
                        "rounded-[var(--radius-sm)] border px-3.5 py-2 text-[13px] font-medium transition-colors",
                        filter === option.value
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-border-subtle bg-bg-surface text-text-secondary",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-text-muted">Sort:</span>
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSort(option.value)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                        sort === option.value
                          ? "border-accent bg-accent-soft text-accent"
                          : "border-border-subtle bg-bg-surface-2 text-text-secondary",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                {sortedProjects.length === 0 ? (
                  <p className="py-8 text-center text-xs text-text-muted">
                    No {filter === "all" ? "" : `${filter} `}projects to show.
                  </p>
                ) : (
                  sortedProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onEdit={() => handleEditClick(project)}
                      onDelete={() => setDeleteTarget(project)}
                    />
                  ))
                )}
              </div>
            </div>
            {panel && (
              <ProjectEntryPanel
                key={panel.entry?.id ?? "add"}
                mode={panel.mode}
                editingEntry={panel.entry}
                defaultExperienceId={defaultExperienceForPanel}
                allSkills={data.allSkills}
                experienceOptions={data.experienceOptions}
                onCancel={() => setPanel(null)}
                onSave={handleSave}
              />
            )}
          </div>
        ))}

      <DeleteProjectDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        projectTitle={deleteTarget?.title ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
