"use client";

import * as React from "react";
import { CircleAlert, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ProLockBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import type { SkillBankData, SkillBankEntryView } from "@/lib/skill-bank-data";
import { CategoryTabs } from "./CategoryTabs";
import { SkillTable } from "./SkillTable";
import { SkillEntryPanel, type SkillEntryFormValues } from "./SkillEntryPanel";
import { DeleteSkillDialog } from "./DeleteSkillDialog";
import { SkillBankSkeleton } from "./SkillBankSkeleton";
import { SkillBankEmptyAccountState } from "./SkillBankEmptyAccountState";

const INITIAL_LOAD_DELAY_MS = 800;

let localIdCounter = 0;
function makeLocalId(prefix: string) {
  localIdCounter += 1;
  return `${prefix}-local-${Date.now()}-${localIdCounter}`;
}

interface SkillBankViewProps {
  data: SkillBankData;
  initialCategorySlug: string;
  isPro: boolean;
}

type PanelState = { mode: "add" | "edit"; entry?: SkillBankEntryView } | null;

export function SkillBankView({ data, initialCategorySlug, isPro }: SkillBankViewProps) {
  const initialCategory = data.categories.find((c) => c.slug === initialCategorySlug) ?? data.categories[0];

  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [entries, setEntries] = React.useState<SkillBankEntryView[]>(data.entries);
  const [activeCategoryId, setActiveCategoryId] = React.useState(initialCategory.id);
  const [panel, setPanel] = React.useState<PanelState>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<SkillBankEntryView | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setStatus("loading");
    window.setTimeout(() => setStatus("ready"), INITIAL_LOAD_DELAY_MS);
  };

  const counts = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const category of data.categories) map[category.id] = 0;
    for (const entry of entries) map[entry.categoryId] = (map[entry.categoryId] ?? 0) + 1;
    return map;
  }, [entries, data.categories]);

  const claimedSkillIds = React.useMemo(() => new Set(entries.map((e) => e.skillId)), [entries]);
  const totalClaimed = entries.length;
  const atCap = totalClaimed >= data.cap;
  const categoryEntries = entries.filter((e) => e.categoryId === activeCategoryId);

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setPanel(null);
  };

  const handleAddClick = () => {
    if (atCap) return;
    setPanel({ mode: "add" });
  };

  const handleRowClick = (entry: SkillBankEntryView) => {
    setPanel({ mode: "edit", entry });
  };

  const handleSave = (values: SkillEntryFormValues) => {
    if (panel?.mode === "edit" && panel.entry) {
      const entryId = panel.entry.id;
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? { ...e, proficiencyLevel: values.proficiencyLevel, yearsOfExperience: values.yearsOfExperience }
            : e,
        ),
      );
      toast.success("Skill entry updated");
    } else {
      const skill = data.skillsByCategory[values.categoryId]?.find((s) => s.id === values.skillId);
      const category = data.categories.find((c) => c.id === values.categoryId);
      if (!skill || !category) return;
      const newEntry: SkillBankEntryView = {
        id: makeLocalId("sbe"),
        skillId: skill.id,
        skillName: skill.name,
        categoryId: category.id,
        categorySlug: category.slug,
        proficiencyLevel: values.proficiencyLevel,
        yearsOfExperience: values.yearsOfExperience,
        lastUsedAt: new Date().toISOString(),
        tags: [],
      };
      setEntries((prev) => [...prev, newEntry]);
      setActiveCategoryId(category.id);
      toast.success("Skill added");
    }
    setPanel(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    if (panel?.mode === "edit" && panel.entry?.id === deleteTarget.id) setPanel(null);
    toast.success("Skill entry deleted");
  };

  const handleImportClick = () => {
    toast.info("Import from existing CV — coming soon");
  };

  const activeCategory = data.categories.find((c) => c.id === activeCategoryId)!;

  const addSkillArea = status === "ready" && totalClaimed > 0 && (
    <div className="flex flex-col items-end gap-2">
      {atCap ? (
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10.5px] font-medium text-text-muted">
            At cap ({totalClaimed}/{data.cap}):
          </span>
          <ProLockBadge />
        </div>
      ) : (
        <>
          <Button onClick={handleAddClick}>
            <Plus />
            Add skill
          </Button>
          <span className="text-[11px] text-text-muted">
            {totalClaimed}/{data.cap} skills used
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <PageHeader
        title="Skill Bank"
        subtitle="Manage your skills, proficiency levels, and experience across categories."
        actions={addSkillArea}
      />

      {status === "loading" && <SkillBankSkeleton />}

      {status === "error" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-sev-missing bg-bg-surface p-10 text-center">
          <CircleAlert className="size-6 text-sev-missing" />
          <p className="text-sm font-semibold text-text-primary">Couldn&apos;t load your Skill Bank</p>
          <p className="max-w-[320px] text-[12.5px] text-text-secondary">
            Something went wrong fetching your skills. Check your connection and try again.
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
        (totalClaimed === 0 && !panel ? (
          <SkillBankEmptyAccountState
            onImportClick={handleImportClick}
            onAddManuallyClick={() => setPanel({ mode: "add" })}
          />
        ) : (
          <>
            <CategoryTabs
              categories={data.categories}
              counts={counts}
              activeCategoryId={activeCategoryId}
              onSelect={handleSelectCategory}
            />
            <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
              <SkillTable
                entries={categoryEntries}
                showProUpsell={!isPro}
                onRowClick={handleRowClick}
                onDeleteClick={setDeleteTarget}
                onAddClick={handleAddClick}
              />
              {panel && (
                <SkillEntryPanel
                  key={panel.entry?.id ?? "add"}
                  mode={panel.mode}
                  categories={data.categories}
                  skillsByCategory={data.skillsByCategory}
                  claimedSkillIds={claimedSkillIds}
                  usedInBySkillId={data.usedInBySkillId}
                  initialCategoryId={activeCategory.id}
                  editingEntry={panel.entry}
                  onCancel={() => setPanel(null)}
                  onSave={handleSave}
                />
              )}
            </div>
          </>
        ))}

      <DeleteSkillDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        skillName={deleteTarget?.skillName ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
