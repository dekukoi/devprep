import Link from "next/link";
import { GitCompareArrows } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { RecentComparisonCard, type RecentComparisonCardData } from "./RecentComparisonCard";

interface RecentComparisonsSectionProps {
  comparisons: RecentComparisonCardData[];
}

export function RecentComparisonsSection({ comparisons }: RecentComparisonsSectionProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-text-primary">Recent Comparisons</h2>
        <Link href="/comparisons" className="text-[13px] font-medium text-accent hover:underline">
          View all
        </Link>
      </div>

      {comparisons.length === 0 ? (
        <EmptyState
          icon={GitCompareArrows}
          heading="No comparisons yet"
          body="Run your first comparison to see how your Skill Bank stacks up against a posting."
        />
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          {comparisons.map((comparison) => (
            <RecentComparisonCard key={comparison.id} {...comparison} />
          ))}
        </div>
      )}
    </section>
  );
}
