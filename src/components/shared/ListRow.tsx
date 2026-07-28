import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, type BadgeSeverity } from "./StatusBadge";

interface ListRowProps {
  title: string;
  meta?: string;
  severity: BadgeSeverity;
  onClick?: () => void;
  className?: string;
}

export function ListRow({ title, meta, severity, onClick, className }: ListRowProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-md border border-border-subtle bg-bg-surface-2 px-3.5 py-2.5 text-left",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="h-[30px] w-[3px] rounded-sm"
          style={{ backgroundColor: `var(--color-sev-${severity})` }}
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-text-primary">{title}</span>
          {meta && <span className="text-xs text-text-muted">{meta}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge severity={severity} />
        <ChevronRight className="size-4 text-text-muted" />
      </div>
    </Comp>
  );
}
