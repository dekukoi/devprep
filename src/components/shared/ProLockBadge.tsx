import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProLockBadgeProps {
  className?: string;
}

export function ProLockBadge({ className }: ProLockBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
        className,
      )}
      style={{
        color: "var(--color-sev-below)",
        borderColor: "var(--color-sev-below)",
        backgroundColor: "color-mix(in srgb, var(--color-sev-below) 20%, transparent)",
      }}
    >
      <Lock className="size-2.5" />
      Upgrade to Pro
    </span>
  );
}
