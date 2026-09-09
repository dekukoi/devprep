import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-2.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-5 w-40 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-24" />
      </div>
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </div>
  );
}

export function ProjectsBankSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-[420px]" />
        </div>
        <Skeleton className="h-10 w-[140px]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
