"use client";

import * as React from "react";
import { Award, CircleAlert, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { CertificationsData, CertificationView } from "@/lib/certifications-data";
import { getCertificationExpiryStatus } from "@/lib/certifications-data";
import { CertificationCard } from "./CertificationCard";
import { CertificationEntryPanel, type CertificationFormValues } from "./CertificationEntryPanel";
import { DeleteCertificationDialog } from "./DeleteCertificationDialog";
import { CertificationsSkeleton } from "./CertificationsSkeleton";

const INITIAL_LOAD_DELAY_MS = 800;

let localIdCounter = 0;
function makeLocalId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-local-${Date.now()}-${localIdCounter}`;
}

interface CertificationsViewProps {
  data: CertificationsData;
}

type PanelState = { mode: "add" | "edit"; entry?: CertificationView } | null;

export function CertificationsView({ data }: CertificationsViewProps) {
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [certifications, setCertifications] = React.useState<CertificationView[]>(data.certifications);
  const [panel, setPanel] = React.useState<PanelState>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CertificationView | null>(null);

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
  const handleEditClick = (entry: CertificationView) => setPanel({ mode: "edit", entry });

  const handleSave = (values: CertificationFormValues) => {
    const linkedSkillNames = values.linkedSkillIds
      .map((id) => skillNameById.get(id))
      .filter((n): n is string => Boolean(n));
    const expiryStatus = getCertificationExpiryStatus(values.expiryDate);

    if (panel?.mode === "edit" && panel.entry) {
      const entryId = panel.entry.id;
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === entryId
            ? {
                ...c,
                name: values.name,
                issuer: values.issuer,
                issueDate: values.issueDate,
                expiryDate: values.expiryDate,
                credentialUrl: values.credentialUrl,
                linkedSkillIds: values.linkedSkillIds,
                linkedSkillNames,
                expiryStatus,
              }
            : c,
        ),
      );
      toast.success("Certification updated");
    } else {
      const newEntry: CertificationView = {
        id: makeLocalId("cert"),
        name: values.name,
        issuer: values.issuer,
        issueDate: values.issueDate,
        expiryDate: values.expiryDate,
        credentialUrl: values.credentialUrl,
        linkedSkillIds: values.linkedSkillIds,
        linkedSkillNames,
        expiryStatus,
      };
      setCertifications((prev) => [newEntry, ...prev]);
      toast.success("Certification added");
    }
    setPanel(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setCertifications((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    if (panel?.mode === "edit" && panel.entry?.id === deleteTarget.id) setPanel(null);
    toast.success("Certification deleted");
  };

  const expiringSoonCount = certifications.filter((c) => c.expiryStatus === "expiring-soon").length;
  const countNote =
    certifications.length === 0
      ? null
      : `${certifications.length} certification${certifications.length === 1 ? "" : "s"}` +
        (expiringSoonCount > 0 ? ` · ${expiringSoonCount} expiring soon` : "");

  const actions = status === "ready" && certifications.length > 0 && (
    <div className="flex flex-col items-end gap-1.5">
      <Button onClick={handleAddClick}>
        <Plus />
        Add certification
      </Button>
      {countNote && <span className="text-[11px] text-text-muted">{countNote}</span>}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader title="Certifications" subtitle="Credentials that back up the skills in your ledger." actions={actions} />

      {status === "loading" && <CertificationsSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load your Certifications</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching your certifications. Check your connection and try again.
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
        (certifications.length === 0 && !panel ? (
          <EmptyState
            icon={Award}
            heading="No certifications yet"
            body="Add credentials that back up the skills in your ledger."
            ctaLabel="Add certification"
            onCtaClick={handleAddClick}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
              {certifications.map((certification) => (
                <CertificationCard
                  key={certification.id}
                  certification={certification}
                  onEdit={() => handleEditClick(certification)}
                  onDelete={() => setDeleteTarget(certification)}
                />
              ))}
            </div>
            {panel && (
              <CertificationEntryPanel
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

      <DeleteCertificationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        certificationName={deleteTarget?.name ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
