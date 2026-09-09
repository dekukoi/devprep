"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRelativeDate } from "@/lib/format";
import type { CVContent, CVSuggestion, CVVersion } from "@/types/cv";
import { EditorHeader } from "./EditorHeader";
import { CvDocument } from "./CvDocument";
import { SuggestionsPanel } from "./SuggestionsPanel";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import { VersionPreviewModal } from "./VersionPreviewModal";

interface CvEditorCv {
  id: string;
  title: string;
  draftContent: CVContent;
}

interface CvEditorViewProps {
  cv: CvEditorCv;
  jobPostLabel: string | null;
  jobPostHref: string | null;
  jobPostCompany: string | null;
  versions: CVVersion[];
  suggestions: CVSuggestion[];
  staleSkillName: string | null;
  staleSkillTooltip: string | null;
  lastSavedAt: string;
}

function createVersion(cvId: string, versionNumber: number, content: CVContent, note: string): CVVersion {
  return {
    id: `cvv-${cvId}-${versionNumber}`,
    cvId,
    versionNumber,
    content,
    contentHash: `hash-${cvId}-v${versionNumber}`,
    renderedFileUrl: null,
    note,
    createdAt: new Date().toISOString(),
  };
}

export function CvEditorView({
  cv,
  jobPostLabel,
  jobPostHref,
  jobPostCompany,
  versions: initialVersions,
  suggestions: initialSuggestions,
  staleSkillName: initialStaleSkillName,
  staleSkillTooltip,
  lastSavedAt: initialLastSavedAt,
}: CvEditorViewProps) {
  const router = useRouter();
  const historyRef = React.useRef<HTMLDivElement>(null);

  const [draftContent, setDraftContent] = React.useState(cv.draftContent);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState(initialLastSavedAt);
  const [versions, setVersions] = React.useState(initialVersions);
  const [pendingSuggestions, setPendingSuggestions] = React.useState(initialSuggestions);
  const [staleFieldsVisible, setStaleFieldsVisible] = React.useState(true);
  const [staleSkillName, setStaleSkillName] = React.useState(initialStaleSkillName);
  const [previewVersion, setPreviewVersion] = React.useState<CVVersion | null>(null);

  const summarySuggestion = pendingSuggestions.find((s) => s.target === "summary") ?? null;
  const experienceSuggestionsByIndex = new Map(
    pendingSuggestions.filter((s) => s.target === "experience" && s.experienceIndex !== undefined).map((s) => [s.experienceIndex!, s]),
  );

  const handleAccept = (suggestion: CVSuggestion) => {
    setDraftContent((prev) => {
      if (suggestion.target === "experience" && suggestion.experienceIndex !== undefined && suggestion.bulletText) {
        const experience = prev.experience.map((entry, i) =>
          i === suggestion.experienceIndex ? { ...entry, bullets: [...entry.bullets, suggestion.bulletText!] } : entry,
        );
        return { ...prev, experience };
      }
      if (suggestion.target === "skills" && suggestion.reorderSkillsFirst) {
        const first = suggestion.reorderSkillsFirst.filter((name) => prev.skills.includes(name));
        const rest = prev.skills.filter((name) => !first.includes(name));
        return { ...prev, skills: [...first, ...rest] };
      }
      return prev;
    });
    setPendingSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    setHasUnsavedChanges(true);
    toast.success("Suggestion applied");
  };

  const handleReject = (suggestion: CVSuggestion) => {
    setPendingSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    toast.info("Suggestion dismissed");
  };

  const handleContentChange = (next: CVContent) => {
    setDraftContent(next);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!hasUnsavedChanges) return;
    const nextVersionNumber = Math.max(...versions.map((v) => v.versionNumber)) + 1;
    const newVersion = createVersion(cv.id, nextVersionNumber, draftContent, "Manual edits saved");
    setVersions((prev) => [...prev, newVersion]);
    setHasUnsavedChanges(false);
    setLastSavedAt(newVersion.createdAt);
    toast.success("CV saved");
  };

  const handleExportPdf = () => {
    if (hasUnsavedChanges) {
      const nextVersionNumber = Math.max(...versions.map((v) => v.versionNumber)) + 1;
      const newVersion = createVersion(cv.id, nextVersionNumber, draftContent, "Manual edits saved");
      setVersions((prev) => [...prev, newVersion]);
      setHasUnsavedChanges(false);
      setLastSavedAt(newVersion.createdAt);
    }
    toast.success(`Export ready: ${cv.title}.pdf`);
  };

  const handleRestore = () => {
    if (!previewVersion) return;
    const nextVersionNumber = Math.max(...versions.map((v) => v.versionNumber)) + 1;
    const newVersion = createVersion(cv.id, nextVersionNumber, previewVersion.content, `Restored from v${previewVersion.versionNumber}`);
    setDraftContent(previewVersion.content);
    setVersions((prev) => [...prev, newVersion]);
    setHasUnsavedChanges(false);
    setLastSavedAt(newVersion.createdAt);
    toast.success(`Restored v${previewVersion.versionNumber} as v${nextVersionNumber}`);
    setPreviewVersion(null);
  };

  const handleSyncStaleSkill = () => {
    toast.success(`Synced ${staleSkillName} from Skill Bank`);
    setStaleSkillName(null);
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-bg-base">
      <EditorHeader
        title={cv.title}
        versionNumber={Math.max(...versions.map((v) => v.versionNumber))}
        jobPostLabel={jobPostLabel}
        jobPostHref={jobPostHref}
        saveStatusLabel={hasUnsavedChanges ? "Unsaved changes" : `Saved ${formatRelativeDate(lastSavedAt)}`}
        hasUnsavedChanges={hasUnsavedChanges}
        staleFieldsVisible={staleFieldsVisible}
        onBack={() => router.back()}
        onSave={handleSave}
        onToggleStaleFields={() => setStaleFieldsVisible((v) => !v)}
        onHistoryClick={() => historyRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
        onExportPdf={handleExportPdf}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex flex-1 items-start justify-center overflow-x-auto bg-bg-base p-6 lg:overflow-y-auto lg:p-10">
          <CvDocument
            content={draftContent}
            jobPostCompany={jobPostCompany}
            onChange={handleContentChange}
            summarySuggestion={summarySuggestion}
            experienceSuggestionsByIndex={experienceSuggestionsByIndex}
            onAcceptSuggestion={handleAccept}
            onRejectSuggestion={handleReject}
            staleFieldsVisible={staleFieldsVisible}
            staleSkillName={staleSkillName}
            staleSkillTooltip={staleSkillTooltip}
            onSyncStaleSkill={handleSyncStaleSkill}
          />
        </div>

        <div className="flex w-full shrink-0 flex-col border-t border-border-subtle bg-bg-surface lg:w-[340px] lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <SuggestionsPanel suggestions={pendingSuggestions} onAccept={handleAccept} onReject={handleReject} />
          <div ref={historyRef}>
            <VersionHistoryPanel versions={versions} onOpenPreview={setPreviewVersion} />
          </div>
        </div>
      </div>

      <VersionPreviewModal
        version={previewVersion}
        jobPostLabel={jobPostLabel}
        onOpenChange={(open) => !open && setPreviewVersion(null)}
        onRestore={handleRestore}
      />
    </div>
  );
}
