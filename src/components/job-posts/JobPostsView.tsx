"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared";
import { JobPostListPanel } from "./JobPostListPanel";
import { JobPostDetailPanel } from "./JobPostDetailPanel";
import { AddJobPostDialog, type JobPostFormValues } from "./AddJobPostDialog";
import { DeleteJobPostDialog } from "./DeleteJobPostDialog";
import type { JobPostFull, JobPostListItem, JobPostsData, SkillOption } from "@/lib/job-posts-data";
import type { ProficiencyLevel } from "@/types/skill";

interface JobPostsViewProps {
  data: JobPostsData;
  initialSelectedId: string | null;
}

let localIdCounter = 0;
function makeLocalId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-local-${Date.now()}-${localIdCounter}`;
}

export function JobPostsView({ data, initialSelectedId }: JobPostsViewProps) {
  const router = useRouter();
  const [jobsById, setJobsById] = React.useState<Record<string, JobPostFull>>(data.detailsById);
  const [order, setOrder] = React.useState<string[]>(data.items.map((i) => i.id));
  const [selectedId, setSelectedId] = React.useState<string | null>(initialSelectedId);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

  const listItems: JobPostListItem[] = order.map((id) => {
    const job = jobsById[id];
    return { id: job.id, company: job.company ?? job.title, role: job.title, createdAt: job.createdAt, fitScore: job.fitScore };
  });

  const selectedJob = selectedId ? jobsById[selectedId] : null;

  const usedSkillIds = new Set(selectedJob?.requirements.map((r) => r.skillId) ?? []);
  const availableSkills = data.skillOptions.filter((s) => !usedSkillIds.has(s.id));

  const updateJob = (id: string, updater: (job: JobPostFull) => JobPostFull) => {
    setJobsById((prev) => ({ ...prev, [id]: updater(prev[id]) }));
  };

  const handleAdd = (values: JobPostFormValues) => {
    const id = makeLocalId("job");
    const newJob: JobPostFull = {
      id,
      title: values.title,
      company: values.company || null,
      content: values.content,
      seniority: null,
      location: null,
      employmentType: null,
      salaryRange: null,
      createdAt: new Date().toISOString(),
      fitScore: null,
      comparisonId: null,
      requirements: [],
      unresolved: [],
    };
    setJobsById((prev) => ({ ...prev, [id]: newJob }));
    setOrder((prev) => [id, ...prev]);
    setSelectedId(id);
    toast.success("Job post added");
  };

  const handleEdit = (values: JobPostFormValues) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({ ...job, title: values.title, company: values.company || null, content: values.content }));
    toast.success("Job post updated");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const deletedCompany = jobsById[deleteTargetId]?.company ?? jobsById[deleteTargetId]?.title;
    const nextOrder = order.filter((id) => id !== deleteTargetId);

    setOrder(nextOrder);
    setJobsById((prev) => {
      const next = { ...prev };
      delete next[deleteTargetId];
      return next;
    });
    if (selectedId === deleteTargetId) setSelectedId(nextOrder[0] ?? null);
    setDeleteTargetId(null);
    toast.success(`"${deletedCompany}" deleted`);
  };

  const handleRunComparison = () => {
    if (!selectedJob) return;
    if (selectedJob.comparisonId) {
      toast.success("Comparison run completed");
      router.push(`/comparisons/${selectedJob.comparisonId}`);
    } else {
      toast.success(`Comparison run for ${selectedJob.company ?? selectedJob.title}`);
    }
  };

  const handleChangeLevel = (requirementId: string, level: ProficiencyLevel) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({
      ...job,
      requirements: job.requirements.map((r) => (r.id === requirementId ? { ...r, requiredLevel: level } : r)),
    }));
  };

  const handleToggleMustHave = (requirementId: string, mustHave: boolean) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({
      ...job,
      requirements: job.requirements.map((r) => (r.id === requirementId ? { ...r, mustHave } : r)),
    }));
  };

  const handleRemoveRequirement = (requirementId: string) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({ ...job, requirements: job.requirements.filter((r) => r.id !== requirementId) }));
    toast.success("Requirement removed");
  };

  const handleAddRequirement = (skill: SkillOption) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({
      ...job,
      requirements: [
        ...job.requirements,
        { id: makeLocalId("req"), skillId: skill.id, skillName: skill.name, requiredLevel: "INTERMEDIATE", mustHave: false },
      ],
    }));
    toast.success(`${skill.name} added to requirements`);
  };

  const handleAssignUnresolved = (unresolvedId: string, skill: SkillOption) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({
      ...job,
      unresolved: job.unresolved.filter((u) => u.id !== unresolvedId),
      requirements: [
        ...job.requirements,
        { id: makeLocalId("req"), skillId: skill.id, skillName: skill.name, requiredLevel: "INTERMEDIATE", mustHave: false },
      ],
    }));
    toast.success(`Assigned to ${skill.name}`);
  };

  const handleDismissUnresolved = (unresolvedId: string) => {
    if (!selectedId) return;
    updateJob(selectedId, (job) => ({ ...job, unresolved: job.unresolved.filter((u) => u.id !== unresolvedId) }));
  };

  if (order.length === 0) {
    return (
      <>
        <div className="flex h-full w-full items-center justify-center p-6">
          <EmptyState
            icon={ClipboardList}
            heading="No job posts yet"
            body="Paste your first job description to get structured requirements and a fit comparison."
            ctaLabel="Paste your first job post"
            onCtaClick={() => setAddOpen(true)}
          />
        </div>
        <AddJobPostDialog open={addOpen} onOpenChange={setAddOpen} mode="add" onSubmit={handleAdd} />
      </>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col lg:flex-row">
      <JobPostListPanel
        jobPosts={listItems}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddClick={() => setAddOpen(true)}
      />

      {selectedJob && (
        <JobPostDetailPanel
          job={selectedJob}
          availableSkills={availableSkills}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteTargetId(selectedJob.id)}
          onRunComparison={handleRunComparison}
          onChangeLevel={handleChangeLevel}
          onToggleMustHave={handleToggleMustHave}
          onRemoveRequirement={handleRemoveRequirement}
          onAddRequirement={handleAddRequirement}
          onAssignUnresolved={handleAssignUnresolved}
          onDismissUnresolved={handleDismissUnresolved}
        />
      )}

      <AddJobPostDialog open={addOpen} onOpenChange={setAddOpen} mode="add" onSubmit={handleAdd} />

      {selectedJob && (
        <AddJobPostDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          mode="edit"
          initialValues={{ title: selectedJob.title, company: selectedJob.company ?? "", content: selectedJob.content }}
          onSubmit={handleEdit}
        />
      )}

      {deleteTargetId && (
        <DeleteJobPostDialog
          open={deleteTargetId !== null}
          onOpenChange={(open) => !open && setDeleteTargetId(null)}
          company={jobsById[deleteTargetId]?.company ?? jobsById[deleteTargetId]?.title ?? ""}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
