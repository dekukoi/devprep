"use client";

import { Award, ChevronRight, Trash2 } from "lucide-react";
import { formatMonthYear } from "@/lib/format";
import { StatusBadge } from "@/components/shared";
import type { CertificationView } from "@/lib/certifications-data";

interface CertificationCardProps {
  certification: CertificationView;
  onEdit: () => void;
  onDelete: () => void;
}

export function CertificationCard({ certification, onEdit, onDelete }: CertificationCardProps) {
  const expirySuffix =
    certification.expiryStatus === "none"
      ? "No expiry"
      : certification.expiryStatus === "expired"
        ? `Expired ${formatMonthYear(certification.expiryDate as string)}`
        : `Expires ${formatMonthYear(certification.expiryDate as string)}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-bg-elevated">
          <Award className="size-[17px] text-text-secondary" />
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-medium text-text-primary">{certification.name}</span>
          <span className="truncate text-[12.5px] text-text-secondary">
            {certification.issuer} · Issued {formatMonthYear(certification.issueDate)} · {expirySuffix}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {certification.linkedSkillNames.length > 0 && (
          <div className="hidden items-center gap-1.5 md:flex">
            {certification.linkedSkillNames.map((name) => (
              <span
                key={name}
                className="rounded-[var(--radius-sm)] border border-border-subtle bg-bg-base px-2.5 py-[5px] text-[11.5px] whitespace-nowrap text-text-secondary"
              >
                {name}
              </span>
            ))}
          </div>
        )}
        {certification.expiryStatus === "expiring-soon" && <StatusBadge severity="below" label="Expiring soon" />}
        {certification.expiryStatus === "expired" && <StatusBadge severity="missing" label="Expired" />}
        <button
          type="button"
          aria-label="Delete certification"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex size-6 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-bg-surface-2 hover:text-sev-missing"
        >
          <Trash2 className="size-3.5" />
        </button>
        <ChevronRight className="size-4 text-text-muted" />
      </div>
    </div>
  );
}
