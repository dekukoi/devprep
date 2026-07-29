import { Skeleton } from "@/components/ui/skeleton";

export function ComparisonReportSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <Skeleton className="size-[150px] shrink-0 rounded-full" />
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-6 w-[160px]" />
            <Skeleton className="h-3.5 w-[240px]" />
            <Skeleton className="h-3.5 w-[200px]" />
          </div>
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[84px] w-[130px] shrink-0 rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6">
          <Skeleton className="h-5 w-[160px]" />
          <Skeleton className="mb-1 h-3.5 w-[200px]" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[54px] w-full rounded-[var(--radius-md)]" />
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6 lg:w-[400px]">
          <Skeleton className="h-5 w-[160px]" />
          <Skeleton className="mb-1 h-3.5 w-[200px]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[70px] w-full rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>
    </>
  );
}
