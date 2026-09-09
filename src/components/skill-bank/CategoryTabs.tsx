import { ICON_REGISTRY } from "@/lib/constants/icons";
import { cn } from "@/lib/utils";
import type { SkillBankCategoryView } from "@/lib/skill-bank-data";

interface CategoryTabsProps {
  categories: SkillBankCategoryView[];
  counts: Record<string, number>;
  activeCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({ categories, counts, activeCategoryId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex w-full flex-wrap gap-2">
      {categories.map((category) => {
        const Icon = ICON_REGISTRY[category.icon];
        const active = category.id === activeCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "border-accent bg-accent-soft font-medium text-text-primary"
                : "border-border-subtle bg-bg-surface font-normal text-text-secondary hover:border-border-strong",
            )}
          >
            <Icon className={cn("size-4", active ? "text-accent" : "text-text-secondary")} />
            {category.name}
            <span
              className={cn(
                "rounded-full px-[7px] py-px text-xs font-medium",
                active ? "bg-accent text-white" : "bg-bg-elevated text-text-muted",
              )}
            >
              {counts[category.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
