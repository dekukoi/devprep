import { cn } from "@/lib/utils";

interface TagChipProps {
  children: React.ReactNode;
  className?: string;
}

export function TagChip({ children, className }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border-subtle bg-bg-elevated px-2.5 py-0.5 text-xs text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}
