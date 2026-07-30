import { Skeleton } from "@/components/ui/skeleton";

function RowSkeleton() {
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4">
      <div className="flex items-center gap-3.5">
        <Skeleton className="size-[38px] rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3.5 w-56" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function CertificationsSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-[420px]" />
        </div>
        <Skeleton className="h-10 w-[170px]" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
