import { Skeleton } from "@/components/ui/skeleton";

function ComparisonRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
      <Skeleton className="hidden h-5 w-[90px] shrink-0 rounded-[var(--radius-sm)] sm:block" />
      <Skeleton className="hidden h-3 w-[60px] shrink-0 sm:block" />
    </div>
  );
}

export function ComparisonsListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <ComparisonRowSkeleton key={i} />
      ))}
    </div>
  );
}
