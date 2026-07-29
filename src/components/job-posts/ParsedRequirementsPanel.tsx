"use client";

import { Check, Info, Plus, ScanLine, SearchX } from "lucide-react";
import { RequirementChip } from "./RequirementChip";
import { UnresolvedItem } from "./UnresolvedItem";
import { SkillPickerPopover } from "./SkillPickerPopover";
import type { JobPostRequirementItem, JobPostUnresolvedItem, SkillOption } from "@/lib/job-posts-data";
import type { ProficiencyLevel } from "@/types/skill";

interface ParsedRequirementsPanelProps {
  requirements: JobPostRequirementItem[];
  unresolved: JobPostUnresolvedItem[];
  availableSkills: SkillOption[];
  onChangeLevel: (requirementId: string, level: ProficiencyLevel) => void;
  onToggleMustHave: (requirementId: string, mustHave: boolean) => void;
  onRemoveRequirement: (requirementId: string) => void;
  onAddRequirement: (skill: SkillOption) => void;
  onAssignUnresolved: (unresolvedId: string, skill: SkillOption) => void;
  onDismissUnresolved: (unresolvedId: string) => void;
}

export function ParsedRequirementsPanel({
  requirements,
  unresolved,
  availableSkills,
  onChangeLevel,
  onToggleMustHave,
  onRemoveRequirement,
  onAddRequirement,
  onAssignUnresolved,
  onDismissUnresolved,
}: ParsedRequirementsPanelProps) {
  const mustHave = requirements.filter((r) => r.mustHave);
  const niceToHave = requirements.filter((r) => !r.mustHave);
  const isEmpty = requirements.length === 0 && unresolved.length === 0;

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-5 lg:w-[420px] lg:shrink-0">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <ScanLine className="size-4 text-accent-hover" />
          <h3 className="text-sm font-semibold text-text-primary">Parsed Requirements</h3>
        </div>
        {!isEmpty && (
          <p className="text-[11px] text-text-muted">
            Auto-extracted from description · {requirements.length} confirmed · {unresolved.length} unresolved
          </p>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-3.5 px-5 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-bg-surface-2">
            <SearchX className="size-[22px] text-text-muted" />
          </span>
          <p className="text-sm font-semibold text-text-primary">Couldn&rsquo;t detect requirements</p>
          <p className="w-[280px] text-xs leading-[18px] text-text-secondary">
            We couldn&rsquo;t find any requirements in the pasted description. Add them manually to get started.
          </p>
          <SkillPickerPopover
            skills={availableSkills}
            onSelect={onAddRequirement}
            trigger={
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-subtle bg-accent-soft px-3.5 py-2 text-[12.5px] font-semibold text-accent-hover transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Plus className="size-3.5" />
                Add requirement
              </button>
            }
          />
        </div>
      ) : (
        <>
          {requirements.length > 0 && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-1.5">
                <Check className="size-3.5 text-sev-met" />
                <span className="text-xs font-semibold text-text-secondary">Confirmed</span>
                <span className="text-[11px] font-medium text-text-muted">{requirements.length}</span>
              </div>

              {mustHave.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-accent" />
                    <span className="text-xs font-semibold text-text-secondary">Must-have</span>
                    <span className="text-[11px] font-medium text-text-muted">{mustHave.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mustHave.map((req) => (
                      <RequirementChip
                        key={req.id}
                        requirement={req}
                        onChangeLevel={(level) => onChangeLevel(req.id, level)}
                        onToggleMustHave={(v) => onToggleMustHave(req.id, v)}
                        onRemove={() => onRemoveRequirement(req.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {niceToHave.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-text-muted" />
                    <span className="text-xs font-semibold text-text-secondary">Nice-to-have</span>
                    <span className="text-[11px] font-medium text-text-muted">{niceToHave.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {niceToHave.map((req) => (
                      <RequirementChip
                        key={req.id}
                        requirement={req}
                        onChangeLevel={(level) => onChangeLevel(req.id, level)}
                        onToggleMustHave={(v) => onToggleMustHave(req.id, v)}
                        onRemove={() => onRemoveRequirement(req.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <SkillPickerPopover
                skills={availableSkills}
                onSelect={onAddRequirement}
                trigger={
                  <button
                    type="button"
                    className="flex w-fit items-center gap-1.5 text-[11px] font-medium text-accent-hover transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Plus className="size-3" />
                    Add requirement
                  </button>
                }
              />
            </div>
          )}

          {unresolved.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <Info className="size-3.5 text-sev-below" />
                <span className="text-xs font-semibold text-text-secondary">Unresolved</span>
                <span className="text-[11px] font-medium text-text-muted">{unresolved.length}</span>
              </div>
              {unresolved.map((item) => (
                <UnresolvedItem
                  key={item.id}
                  item={item}
                  skills={availableSkills}
                  onAssign={(skill) => onAssignUnresolved(item.id, skill)}
                  onDismiss={() => onDismissUnresolved(item.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
