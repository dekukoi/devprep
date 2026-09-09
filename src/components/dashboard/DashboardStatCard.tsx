import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  meta: string;
  icon: LucideIcon;
  href: string;
}

export function DashboardStatCard({ label, value, meta, icon: Icon, href }: DashboardStatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col gap-3.5 rounded-[var(--radius-md)] border border-border-strong bg-bg-surface p-5 transition-colors",
        "hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-soft">
          <Icon className="size-4 text-accent" />
        </span>
      </div>
      <span className="text-[30px] font-bold text-text-primary">{value}</span>
      <span className="text-xs text-text-muted">{meta}</span>
    </Link>
  );
}
