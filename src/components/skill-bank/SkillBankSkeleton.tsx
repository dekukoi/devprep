import { Skeleton } from "@/components/ui/skeleton";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border-subtle px-5 py-3.5 last:border-b-0">
      <Skeleton className="h-4 w-32 flex-1" />
      <Skeleton className="h-4 w-[150px] shrink-0" />
      <Skeleton className="h-4 w-12 shrink-0" />
      <Skeleton className="h-4 w-20 shrink-0" />
      <Skeleton className="h-4 w-[100px] shrink-0" />
    </div>
  );
}

export function SkillBankSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-[360px]" />
        </div>
        <Skeleton className="h-10 w-[110px]" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-[130px]" />
        ))}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[var(--radius-md)] border border-border-subtle">
        {Array.from({ length: 6 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
