import { Skeleton } from "@/components/ui/skeleton";

export function CvCurateContentSkeleton() {
  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-[140px]" />
          <Skeleton className="h-6 w-[420px]" />
          <Skeleton className="h-3.5 w-[520px]" />
        </div>
        <Skeleton className="h-8 w-[130px] rounded-full" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="flex flex-1 flex-col gap-3.5 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-6">
            <Skeleton className="h-5 w-[140px]" />
            <Skeleton className="h-3.5 w-[220px]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[54px] w-full rounded-[var(--radius-md)]" />
            ))}
          </div>
        ))}
      </div>
      <Skeleton className="h-[60px] w-full rounded-[var(--radius-md)]" />
    </>
  );
}
