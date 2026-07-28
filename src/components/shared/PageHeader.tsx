import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex w-full items-center justify-between gap-4", className)}>
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-[22px] font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
