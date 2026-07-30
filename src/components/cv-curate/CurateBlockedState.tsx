"use client";

import { useRouter } from "next/navigation";
import { Briefcase, FolderKanban, Inbox } from "lucide-react";

export function CurateBlockedState() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center gap-2.5 rounded-[var(--radius-md)] border border-border-strong bg-bg-surface-2 p-6 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-bg-elevated">
        <Inbox className="size-[19px] text-text-muted" />
      </div>
      <p className="text-sm font-semibold text-text-primary">Nothing to curate yet</p>
      <p className="w-[420px] text-[12.5px] text-text-secondary">
        Add at least one Experience or Project entry before generating a tailored CV draft.
      </p>
      <div className="mt-1 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.push("/experience")}
          className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3.5 py-2 text-[13px] font-medium text-text-primary transition-colors hover:border-text-muted"
        >
          <Briefcase className="size-3.5" />
          Go to Experience Bank
        </button>
        <button
          type="button"
          onClick={() => router.push("/projects")}
          className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3.5 py-2 text-[13px] font-medium text-text-primary transition-colors hover:border-text-muted"
        >
          <FolderKanban className="size-3.5" />
          Go to Projects Bank
        </button>
      </div>
    </div>
  );
}
