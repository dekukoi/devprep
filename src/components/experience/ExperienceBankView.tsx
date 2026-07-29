"use client";

import * as React from "react";
import { Briefcase, CircleAlert, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { ExperienceData, ExperienceView } from "@/lib/experience-data";
import { ExperienceCard } from "./ExperienceCard";
import { ExperienceEntryPanel, type ExperienceFormValues } from "./ExperienceEntryPanel";
import { DeleteExperienceDialog } from "./DeleteExperienceDialog";
import { ExperienceBankSkeleton } from "./ExperienceBankSkeleton";

const INITIAL_LOAD_DELAY_MS = 800;

let localIdCounter = 0;
function makeLocalId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-local-${Date.now()}-${localIdCounter}`;
}

interface ExperienceBankViewProps {
  data: ExperienceData;
}

type PanelState = { mode: "add" | "edit"; entry?: ExperienceView } | null;

export function ExperienceBankView({ data }: ExperienceBankViewProps) {
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [experiences, setExperiences] = React.useState<ExperienceView[]>(data.experiences);
  const [panel, setPanel] = React.useState<PanelState>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ExperienceView | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const skillNameById = React.useMemo(() => new Map(data.allSkills.map((s) => [s.id, s.name])), [data.allSkills]);

  const handleAddClick = () => setPanel({ mode: "add" });
  const handleEditClick = (entry: ExperienceView) => setPanel({ mode: "edit", entry });
  const handleAddProject = () => toast.info("Projects Bank — coming soon");

  const handleSave = (values: ExperienceFormValues) => {
    const linkedSkillNames = values.linkedSkillIds
      .map((id) => skillNameById.get(id))
      .filter((n): n is string => Boolean(n));

    if (panel?.mode === "edit" && panel.entry) {
      const entryId = panel.entry.id;
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === entryId
            ? {
                ...exp,
                company: values.company,
                title: values.title,
                startDate: values.startDate,
                endDate: values.endDate,
                bullets: values.bullets,
                linkedSkillIds: values.linkedSkillIds,
                linkedSkillNames,
              }
            : exp,
        ),
      );
      toast.success("Experience updated");
    } else {
      const newEntry: ExperienceView = {
        id: makeLocalId("exp"),
        company: values.company,
        title: values.title,
        startDate: values.startDate,
        endDate: values.endDate,
        bullets: values.bullets,
        linkedSkillIds: values.linkedSkillIds,
        linkedSkillNames,
        projects: [],
      };
      setExperiences((prev) => [newEntry, ...prev]);
      toast.success("Experience added");
    }
    setPanel(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setExperiences((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
    if (panel?.mode === "edit" && panel.entry?.id === deleteTarget.id) setPanel(null);
    toast.success("Experience deleted");
  };

  const actions = status === "ready" && experiences.length > 0 && (
    <div className="flex flex-col items-end gap-1.5">
      <Button onClick={handleAddClick}>
        <Plus />
        Add experience
      </Button>
      <span className="text-[11px] text-text-muted">
        {experiences.length} role{experiences.length === 1 ? "" : "s"} logged
      </span>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Experience"
        subtitle="Track roles, responsibilities, and impact — this is what your CVs are built from."
        actions={actions}
      />

      {status === "loading" && <ExperienceBankSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load your Experience Bank</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching your work history. Check your connection and try again.
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
        (experiences.length === 0 && !panel ? (
          <EmptyState
            icon={Briefcase}
            heading="No work history yet"
            body="Add your first role — every CV starts with an Experience or Project entry."
            ctaLabel="Add your first role"
            onCtaClick={handleAddClick}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-4">
              {experiences.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onEdit={() => handleEditClick(exp)}
                  onDelete={() => setDeleteTarget(exp)}
                  onAddProject={handleAddProject}
                />
              ))}
              {experiences.length === 0 && (
                <EmptyState
                  icon={Briefcase}
                  heading="No work history yet"
                  body="Add your first role — every CV starts with an Experience or Project entry."
                  ctaLabel="Add your first role"
                  onCtaClick={handleAddClick}
                />
              )}
            </div>
            {panel && (
              <ExperienceEntryPanel
                key={panel.entry?.id ?? "add"}
                mode={panel.mode}
                editingEntry={panel.entry}
                allSkills={data.allSkills}
                onCancel={() => setPanel(null)}
                onSave={handleSave}
              />
            )}
          </div>
        ))}

      <DeleteExperienceDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        roleLabel={deleteTarget ? `${deleteTarget.title} — ${deleteTarget.company}` : ""}
        linkedProjectCount={deleteTarget?.projects.length ?? 0}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
