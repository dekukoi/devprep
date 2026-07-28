import { cn } from "@/lib/utils";

interface FilterPillProps extends React.ComponentProps<"button"> {
  selected?: boolean;
}

export function FilterPill({ selected, className, children, ...props }: FilterPillProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        selected
          ? "border-accent bg-accent-soft text-accent"
          : "border-border-subtle bg-bg-surface-2 text-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
