import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  body: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, heading, body, ctaLabel, onCtaClick, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex w-[400px] flex-col items-center gap-2.5 rounded-md border border-border-strong bg-bg-surface-2 p-6 text-center",
        className,
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-bg-elevated">
        <Icon className="size-[19px] text-text-muted" />
      </div>
      <p className="text-sm font-semibold text-text-primary">{heading}</p>
      <p className="w-[320px] text-[12.5px] text-text-secondary">{body}</p>
      {ctaLabel && (
        <Button onClick={onCtaClick} className="mt-1">
          <Plus />
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
