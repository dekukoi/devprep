"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FilterPill, PageHeader } from "@/components/shared";
import { FREE_TEMPLATE_ID, TEMPLATE_FAMILY } from "@/lib/constants/cv-templates";
import type { CVTemplate, TemplateFamily } from "@/types/cv";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { RetemplateConfirmDialog } from "./RetemplateConfirmDialog";

const FILTERS: (TemplateFamily | "All")[] = ["All", "Modern", "Classic", "Minimal"];

export interface CvTemplatePickerCv {
  id: string;
  title: string;
  templateId: string;
}

interface CvTemplatePickerViewProps {
  templates: CVTemplate[];
  cv: CvTemplatePickerCv | null;
  /** Present when reached from "Generate CV for this role" — routes straight into the Curate Content step after picking a template. */
  jobPostId?: string;
}

export function CvTemplatePickerView({ templates, cv, jobPostId }: CvTemplatePickerViewProps) {
  const router = useRouter();
  const isRetemplate = cv !== null;
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(cv?.templateId ?? FREE_TEMPLATE_ID);
  const [previewTemplate, setPreviewTemplate] = React.useState<CVTemplate | null>(null);
  const [confirmTemplate, setConfirmTemplate] = React.useState<CVTemplate | null>(null);

  const singleColumn = templates.filter((t) => t.variant === "SINGLE_COLUMN");
  const twoColumn = templates.filter((t) => t.variant === "TWO_COLUMN");

  const matchesFilter = (template: CVTemplate) => filter === "All" || TEMPLATE_FAMILY[template.name] === filter;

  const applyTemplate = (template: CVTemplate) => {
    if (!isRetemplate && jobPostId) {
      router.push(`/cvs/curate?jobPostId=${jobPostId}&templateId=${template.id}`);
      return;
    }
    setSelectedTemplateId(template.id);
    toast.success("Template applied to CV");
  };

  const handleUse = (template: CVTemplate) => {
    if (template.id === selectedTemplateId) return;
    if (isRetemplate) {
      setConfirmTemplate(template);
    } else {
      applyTemplate(template);
    }
  };

  const handleUseFromPreview = (template: CVTemplate) => {
    setPreviewTemplate(null);
    handleUse(template);
  };

  const renderRow = (row: CVTemplate[]) => {
    const visible = row.filter(matchesFilter);
    if (visible.length === 0) return null;
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={template.id === selectedTemplateId}
            locked={template.id !== FREE_TEMPLATE_ID}
            onPreview={() => setPreviewTemplate(template)}
            onUse={() => handleUse(template)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          title="CV Templates"
          subtitle="Choose a layout for your exported CV. Every template renders in print-friendly light styling — clean, professional, and ready to send to employers."
        />
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <FilterPill key={f} selected={filter === f} onClick={() => setFilter(f)}>
              {f}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {renderRow(singleColumn)}
        {renderRow(twoColumn)}
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        onUse={handleUseFromPreview}
      />

      <RetemplateConfirmDialog
        template={confirmTemplate}
        onOpenChange={(open) => !open && setConfirmTemplate(null)}
        onConfirm={() => confirmTemplate && applyTemplate(confirmTemplate)}
      />
    </div>
  );
}
