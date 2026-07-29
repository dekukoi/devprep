"use client";

import * as React from "react";
import { Check, Plus, RefreshCw, Sparkles, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CVContent, CVSuggestion } from "@/types/cv";

function Editable({
  value,
  onChange,
  className,
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        const next = (e.currentTarget.textContent ?? "").trim();
        if (next && next !== value) onChange(next);
        else e.currentTarget.textContent = value;
      }}
      className={cn("rounded-[2px] outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50", className)}
    >
      {value}
    </div>
  );
}

function SuggestionActions({
  size,
  onAccept,
  onReject,
}: {
  size: 24 | 26;
  onAccept: () => void;
  onReject: () => void;
}) {
  const dims = size === 26 ? "size-[26px]" : "size-6";
  const icon = size === 26 ? "size-3.5" : "size-3";
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        aria-label="Reject suggestion"
        onClick={onReject}
        className={cn("flex items-center justify-center rounded-md border border-[#FCA5A5] bg-white", dims)}
      >
        <X className={cn(icon, "text-[#DC2626]")} />
      </button>
      <button
        type="button"
        aria-label="Accept suggestion"
        onClick={onAccept}
        className={cn("flex items-center justify-center rounded-md bg-[#10B981]", dims)}
      >
        <Check className={cn(icon, "text-white")} />
      </button>
    </div>
  );
}

interface CvDocumentProps {
  content: CVContent;
  jobPostCompany: string | null;
  onChange: (next: CVContent) => void;
  summarySuggestion: CVSuggestion | null;
  experienceSuggestionsByIndex: Map<number, CVSuggestion>;
  onAcceptSuggestion: (suggestion: CVSuggestion) => void;
  onRejectSuggestion: (suggestion: CVSuggestion) => void;
  staleFieldsVisible: boolean;
  staleSkillName: string | null;
  staleSkillTooltip: string | null;
  onSyncStaleSkill: () => void;
}

export function CvDocument({
  content,
  jobPostCompany,
  onChange,
  summarySuggestion,
  experienceSuggestionsByIndex,
  onAcceptSuggestion,
  onRejectSuggestion,
  staleFieldsVisible,
  staleSkillName,
  staleSkillTooltip,
  onSyncStaleSkill,
}: CvDocumentProps) {
  const setField = <K extends keyof CVContent>(key: K, value: CVContent[K]) => onChange({ ...content, [key]: value });

  const setBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const experience = content.experience.map((entry, i) =>
      i !== expIndex ? entry : { ...entry, bullets: entry.bullets.map((b, j) => (j === bulletIndex ? text : b)) },
    );
    onChange({ ...content, experience });
  };

  return (
    <div className="flex w-[760px] shrink-0 flex-col gap-[22px] rounded-md bg-white p-[48px_56px] shadow-[0px_8px_32px_0px_#00000066]">
      <div className="flex w-full shrink-0 flex-col gap-1.5">
        <Editable
          value={content.name}
          onChange={(v) => setField("name", v)}
          className="text-[30px] font-bold tracking-[-0.5px] text-[#111827]"
        />
        <Editable
          value={content.role}
          onChange={(v) => setField("role", v)}
          className="text-[15px] font-semibold text-[#4F46E5]"
        />
        <div className="w-full text-xs text-[#6B7280]">
          {content.email} · {content.phone} · {content.location}
          {content.links.length > 0 ? ` · ${content.links.join(" · ")}` : ""}
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-[#E5E7EB]" />

      <div className="flex w-full shrink-0 flex-col gap-2">
        <div className="text-xs font-bold tracking-[1px] text-[#9CA3AF]">SUMMARY</div>
        {summarySuggestion ? (
          <div className="flex w-full flex-col gap-2 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] p-3">
            <Editable
              value={content.summary}
              onChange={(v) => setField("summary", v)}
              multiline
              className="w-full text-[13px] leading-5 text-[#1F2937]"
            />
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex shrink-0 items-center gap-1.5">
                <Sparkles className="size-[13px] text-[#059669]" />
                <span className="text-[11px] font-semibold whitespace-nowrap text-[#059669]">
                  Suggested rewrite to match {jobPostCompany ?? "job"} requirements
                </span>
              </div>
              <SuggestionActions
                size={26}
                onAccept={() => onAcceptSuggestion(summarySuggestion)}
                onReject={() => onRejectSuggestion(summarySuggestion)}
              />
            </div>
          </div>
        ) : (
          <Editable
            value={content.summary}
            onChange={(v) => setField("summary", v)}
            multiline
            className="w-full text-[13px] leading-5 text-[#374151]"
          />
        )}
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3.5">
        <div className="text-xs font-bold tracking-[1px] text-[#9CA3AF]">EXPERIENCE</div>
        {content.experience.map((entry, expIndex) => {
          const suggestion = experienceSuggestionsByIndex.get(expIndex);
          return (
            <div key={`${entry.company}-${expIndex}`} className="flex w-full shrink-0 flex-col gap-1.5">
              <div className="flex w-full shrink-0 items-start justify-between">
                <div className="flex shrink-0 flex-col gap-0.5">
                  <Editable
                    value={entry.title}
                    onChange={(v) => {
                      const experience = content.experience.map((e, i) => (i === expIndex ? { ...e, title: v } : e));
                      onChange({ ...content, experience });
                    }}
                    className="text-sm font-semibold text-[#111827]"
                  />
                  <Editable
                    value={entry.company}
                    onChange={(v) => {
                      const experience = content.experience.map((e, i) => (i === expIndex ? { ...e, company: v } : e));
                      onChange({ ...content, experience });
                    }}
                    className="text-[12.5px] font-medium text-[#4F46E5]"
                  />
                </div>
                <span className="shrink-0 text-xs whitespace-nowrap text-[#9CA3AF]">{entry.dateRange}</span>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-1">
                {entry.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex w-full items-start gap-2">
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[#9CA3AF]" />
                    <Editable
                      value={bullet}
                      onChange={(v) => setBullet(expIndex, bulletIndex, v)}
                      multiline
                      className="flex-1 text-[12.5px] leading-[18px] text-[#374151]"
                    />
                  </div>
                ))}
                {suggestion && (
                  <div className="flex w-full items-start gap-2 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] p-[7px_10px]">
                    <div className="flex flex-1 items-center gap-2">
                      <Plus className="size-[13px] shrink-0 text-[#059669]" />
                      <span className="flex-1 text-[12.5px] leading-[18px] text-[#065F46]">{suggestion.bulletText}</span>
                    </div>
                    <SuggestionActions
                      size={24}
                      onAccept={() => onAcceptSuggestion(suggestion)}
                      onReject={() => onRejectSuggestion(suggestion)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative flex w-full shrink-0 flex-col gap-2">
        <div className="text-xs font-bold tracking-[1px] text-[#9CA3AF]">SKILLS</div>
        <div className="flex w-full flex-wrap gap-2">
          {content.skills.map((skill) => {
            const isStale = staleFieldsVisible && skill === staleSkillName;
            const chip = (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[5px] text-xs font-medium",
                  isStale ? "border-[#EAB308] bg-[#FEFCE8] text-[#854D0E]" : "border-[#E5E7EB] bg-[#F3F4F6] text-[#374151]",
                )}
              >
                {skill}
                {isStale && <span className="size-2 shrink-0 rounded-full bg-[#EAB308]" />}
              </span>
            );

            if (!isStale) return <React.Fragment key={skill}>{chip}</React.Fragment>;

            return (
              <Popover key={skill}>
                <PopoverTrigger asChild>
                  <button type="button" aria-label={`${skill} — stale field details`}>
                    {chip}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[320px] border-none bg-[#1F2937] p-3 shadow-[0_12px_32px_#00000080]"
                >
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-[#EAB308]" />
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-xs font-semibold text-white">Stale field</span>
                      <span className="text-[11.5px] leading-4 text-[#D1D5DB]">{staleSkillTooltip}</span>
                      <button
                        type="button"
                        onClick={onSyncStaleSkill}
                        className="mt-1 flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-[#EAB308] px-2.5 py-1.5 text-[11px] font-semibold text-[#1F2937]"
                      >
                        <RefreshCw className="size-3" />
                        Sync to Skill Bank
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    </div>
  );
}
