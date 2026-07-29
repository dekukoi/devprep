"use client";

import * as React from "react";
import { Briefcase, Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SegmentedControl } from "@/components/shared";
import type { ProficiencyLevel } from "@/types/skill";
import type {
  SkillBankCategoryView,
  SkillBankEntryView,
  SkillBankUsedIn,
  SkillOptionView,
} from "@/lib/skill-bank-data";

export interface SkillEntryFormValues {
  skillId: string;
  categoryId: string;
  proficiencyLevel: ProficiencyLevel;
  yearsOfExperience: number | null;
}

interface SkillEntryPanelProps {
  mode: "add" | "edit";
  categories: SkillBankCategoryView[];
  skillsByCategory: Record<string, SkillOptionView[]>;
  claimedSkillIds: Set<string>;
  usedInBySkillId: Record<string, SkillBankUsedIn[]>;
  initialCategoryId: string;
  editingEntry?: SkillBankEntryView | null;
  onCancel: () => void;
  onSave: (values: SkillEntryFormValues) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-text-secondary">{children}</label>;
}

export function SkillEntryPanel({
  mode,
  categories,
  skillsByCategory,
  claimedSkillIds,
  usedInBySkillId,
  initialCategoryId,
  editingEntry,
  onCancel,
  onSave,
}: SkillEntryPanelProps) {
  const [categoryId, setCategoryId] = React.useState(editingEntry?.categoryId ?? initialCategoryId);
  const [skillId, setSkillId] = React.useState(editingEntry?.skillId ?? "");
  const [query, setQuery] = React.useState(editingEntry?.skillName ?? "");
  const [comboOpen, setComboOpen] = React.useState(false);
  const [proficiencyLevel, setProficiencyLevel] = React.useState<ProficiencyLevel>(
    editingEntry?.proficiencyLevel ?? "INTERMEDIATE",
  );
  const [years, setYears] = React.useState(editingEntry?.yearsOfExperience?.toString() ?? "");

  const isEdit = mode === "edit";

  const categorySkills = skillsByCategory[categoryId] ?? [];
  const options = categorySkills.filter((s) => !claimedSkillIds.has(s.id) || s.id === skillId);
  const filteredOptions = options.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase()));

  const usedIn = skillId ? (usedInBySkillId[skillId] ?? []) : [];

  const handleSelectSkill = (skill: SkillOptionView) => {
    setSkillId(skill.id);
    setQuery(skill.name);
    setComboOpen(false);
  };

  const handleCategorySelect = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    setSkillId("");
    setQuery("");
  };

  const handleSave = () => {
    if (!skillId) return;
    onSave({
      skillId,
      categoryId,
      proficiencyLevel,
      yearsOfExperience: years.trim() === "" ? null : Number(years),
    });
  };

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-text-primary">Add / Edit Entry</h3>
        <p className="text-[13px] text-text-muted">Add a new skill or update an existing one.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Skill name</FieldLabel>
        <div className="relative">
          <div
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-sm)] border-2 bg-bg-base px-3.5 py-2.5",
              isEdit ? "border-border-strong opacity-60" : "border-accent",
            )}
          >
            <Search className="size-[15px] shrink-0 text-text-muted" />
            <input
              value={query}
              disabled={isEdit}
              onChange={(e) => {
                setQuery(e.target.value);
                setSkillId("");
                setComboOpen(true);
              }}
              onFocus={() => !isEdit && setComboOpen(true)}
              onKeyDown={(e) => e.key === "Escape" && setComboOpen(false)}
              placeholder="Search skills..."
              aria-label="Skill name"
              className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none disabled:cursor-not-allowed"
            />
          </div>
          {!isEdit && comboOpen && (
            <div className="absolute top-[calc(100%+6px)] z-10 flex max-h-[220px] w-full flex-col overflow-y-auto rounded-[var(--radius-sm)] border border-border-subtle bg-bg-elevated py-1 shadow-[0_8px_24px_#00000080]">
              {filteredOptions.length === 0 ? (
                <p className="px-3.5 py-2.5 text-center text-xs text-text-muted">No matching skills.</p>
              ) : (
                filteredOptions.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => handleSelectSkill(skill)}
                    className={cn(
                      "px-3.5 py-2.5 text-left text-[13px] transition-colors hover:bg-accent-soft",
                      skill.id === skillId ? "bg-accent-soft font-medium text-text-primary" : "text-text-secondary",
                    )}
                  >
                    {skill.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Category</FieldLabel>
        {isEdit ? (
          <div className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border-strong bg-bg-base px-3.5 py-2.5 opacity-60">
            <span className="text-[13px] text-text-primary">{activeCategory?.name}</span>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border-strong bg-bg-base px-3.5 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span className="text-[13px] text-text-primary">{activeCategory?.name}</span>
                <ChevronDown className="size-4 text-text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[292px]">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} onClick={() => handleCategorySelect(category.id)}>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Proficiency</FieldLabel>
        <SegmentedControl value={proficiencyLevel} onChange={setProficiencyLevel} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Years of experience</FieldLabel>
        <Input
          type="number"
          min={0}
          value={years}
          onChange={(e) => setYears(e.target.value)}
          className="h-auto rounded-[var(--radius-sm)] border-border-strong bg-bg-base px-3.5 py-2.5 text-[13px]"
        />
      </div>

      {usedIn.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Used in</FieldLabel>
          <div className="flex flex-col gap-1.5">
            {usedIn.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base px-2.5 py-2"
              >
                <Briefcase className="size-3.5 shrink-0 text-text-muted" />
                <span className="text-[12.5px] text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" className="border border-border-strong" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!skillId}>
          <Check />
          Save entry
        </Button>
      </div>
    </div>
  );
}
