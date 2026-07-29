"use client";

import * as React from "react";
import { Briefcase, FileText, Layers, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared";
import type { DashboardStats } from "@/lib/mock-data";
import { RecentComparisonsSection } from "./RecentComparisonsSection";
import type { RecentComparisonCardData } from "./RecentComparisonCard";
import { MyCvsSection } from "./MyCvsSection";
import type { CvRowData } from "./CvListRow";
import { DashboardStatCard } from "./DashboardStatCard";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { NewComparisonModal, type NewComparisonJobPost } from "./NewComparisonModal";
import { RenameCvDialog } from "./RenameCvDialog";
import { DeleteCvDialog } from "./DeleteCvDialog";

export interface DashboardCvItem extends CvRowData {
  title: string;
}

interface DashboardViewProps {
  stats: DashboardStats;
  comparisons: RecentComparisonCardData[];
  cvs: DashboardCvItem[];
  jobPosts: NewComparisonJobPost[];
}

interface RenameTarget {
  id: string;
  mode: "rename" | "duplicate";
  initialTitle: string;
}

interface DeleteTarget {
  id: string;
  title: string;
  version: number;
}

export function DashboardView({ stats, comparisons, cvs, jobPosts }: DashboardViewProps) {
  const [cvList, setCvList] = React.useState(cvs);
  const [newComparisonOpen, setNewComparisonOpen] = React.useState(false);
  const [renameTarget, setRenameTarget] = React.useState<RenameTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(null);

  const isEmptyAccount = comparisons.length === 0 && cvList.length === 0;

  const findCv = (id: string) => cvList.find((cv) => cv.id === id) ?? null;

  const handleRename = (id: string) => {
    const cv = findCv(id);
    if (!cv) return;
    setRenameTarget({ id, mode: "rename", initialTitle: cv.title });
  };

  const handleDuplicate = (id: string) => {
    const cv = findCv(id);
    if (!cv) return;
    setRenameTarget({ id, mode: "duplicate", initialTitle: `${cv.title} (Copy)` });
  };

  const handleRenameConfirm = (title: string) => {
    if (!renameTarget) return;
    if (renameTarget.mode === "rename") {
      setCvList((prev) => prev.map((cv) => (cv.id === renameTarget.id ? { ...cv, title, role: title } : cv)));
      toast.success("CV renamed");
    } else {
      const source = findCv(renameTarget.id);
      if (source) {
        const newCv: DashboardCvItem = {
          ...source,
          id: `cv-copy-${Date.now()}`,
          title,
          role: title,
          version: 1,
          editedRelative: "today",
          isStale: false,
        };
        setCvList((prev) => [newCv, ...prev]);
        toast.success(`Duplicated as "${title}"`);
      }
    }
    setRenameTarget(null);
  };

  const handleChangeTemplate = (id: string) => {
    void id;
    toast.info("Change template — coming soon");
  };

  const handleExportPdf = (id: string) => {
    const cv = findCv(id);
    toast.success(cv ? `Export ready: ${cv.title}.pdf` : "Export ready");
  };

  const handleViewVersions = (id: string) => {
    void id;
    toast.info("Version history — coming soon");
  };

  const handleDeleteRequest = (id: string) => {
    const cv = findCv(id);
    if (!cv) return;
    setDeleteTarget({ id, title: cv.title, version: cv.version });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setCvList((prev) => prev.filter((cv) => cv.id !== deleteTarget.id));
    toast.success("CV deleted");
  };

  const handleRunComparison = (job: NewComparisonJobPost) => {
    toast.success(`Comparison run for ${job.company} — ${job.role}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-7 p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Track your fit across postings and keep your CVs sharp."
        actions={
          <button
            type="button"
            onClick={() => setNewComparisonOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-[var(--radius-sm)] border-2 border-accent bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Plus className="size-4" />
            New comparison
          </button>
        }
      />

      {isEmptyAccount ? (
        <OnboardingChecklist />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <DashboardStatCard
              label="Total comparisons"
              value={stats.totalComparisons}
              meta={stats.totalComparisonsDelta}
              icon={Layers}
              href="/comparisons"
            />
            <DashboardStatCard
              label="Average fit"
              value={`${stats.averageFit}%`}
              meta={stats.averageFitMeta}
              icon={Target}
              href="/comparisons"
            />
            <DashboardStatCard
              label="CVs"
              value={stats.cvCount}
              meta={stats.cvCountMeta}
              icon={FileText}
              href="/cvs"
            />
            <DashboardStatCard
              label="Postings tracked"
              value={stats.postingsTracked}
              meta={stats.postingsTrackedMeta}
              icon={Briefcase}
              href="/job-posts"
            />
          </div>

          <RecentComparisonsSection comparisons={comparisons} />

          <MyCvsSection
            cvs={cvList}
            onDuplicate={handleDuplicate}
            onRename={handleRename}
            onChangeTemplate={handleChangeTemplate}
            onExportPdf={handleExportPdf}
            onViewVersions={handleViewVersions}
            onDelete={handleDeleteRequest}
          />
        </>
      )}

      <NewComparisonModal
        open={newComparisonOpen}
        onOpenChange={setNewComparisonOpen}
        jobPosts={jobPosts}
        onRun={handleRunComparison}
      />

      {renameTarget && (
        <RenameCvDialog
          open={renameTarget !== null}
          onOpenChange={(open) => !open && setRenameTarget(null)}
          mode={renameTarget.mode}
          initialTitle={renameTarget.initialTitle}
          onConfirm={handleRenameConfirm}
        />
      )}

      {deleteTarget && (
        <DeleteCvDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title={deleteTarget.title}
          version={deleteTarget.version}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
