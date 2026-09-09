import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function StatTileSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-[100px]" />
        <Skeleton className="size-[30px]" />
      </div>
      <Skeleton className="h-[30px] w-[60px]" />
      <Skeleton className="h-3 w-[90px]" />
    </div>
  );
}

function RecentComparisonCardSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface p-5">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex justify-center py-1">
        <Skeleton className="size-[104px] rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-[50px]" />
        <Skeleton className="h-5 w-[70px] rounded-full" />
      </div>
    </div>
  );
}

function CvRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center gap-4 px-5 py-4", className)}>
      <Skeleton className="size-[38px] shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-[15px] w-40" />
        <Skeleton className="h-3 w-[110px]" />
      </div>
      <Skeleton className="h-[23px] w-[35px] shrink-0" />
      <Skeleton className="hidden h-[15px] w-[90px] shrink-0 sm:block" />
      <div className="flex shrink-0 items-center gap-1">
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
        <Skeleton className="size-8" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-text-primary">Recent Comparisons</h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          {Array.from({ length: 4 }).map((_, i) => (
            <RecentComparisonCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <h2 className="text-[17px] font-semibold text-text-primary">My CVs</h2>
        <div className="w-full divide-y divide-border-subtle rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface">
          {Array.from({ length: 3 }).map((_, i) => (
            <CvRowSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
