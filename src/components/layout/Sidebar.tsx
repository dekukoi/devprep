import { Award, Boxes, BookOpen, Briefcase, Code2, FileText, MessageSquare, Plus, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarSkillCategoryItem {
  id: string;
  label: string;
  count: number;
}

export interface SidebarLinkItem {
  id: string;
  label: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Tools: Wrench,
  "Soft Skills": MessageSquare,
  "Domain Knowledge": BookOpen,
};

const CAREER_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FileText },
  { id: "certifications", label: "Certifications", icon: Award },
];

interface SidebarProps {
  skillCategories: SidebarSkillCategoryItem[];
  jobPosts: SidebarLinkItem[];
  cvs: SidebarLinkItem[];
  activeId?: string;
  className?: string;
}

function SectionHeader({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5">
      <span className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">{children}</span>
      {action}
    </div>
  );
}

function NavItem({
  label,
  icon: Icon,
  active,
  trailing,
}: {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors",
        active ? "bg-accent-soft text-text-primary" : "text-text-secondary hover:bg-bg-surface-2",
      )}
    >
      <span className="flex items-center gap-2.5">
        {Icon && <Icon className="size-4" />}
        {label}
      </span>
      {trailing}
    </div>
  );
}

export function Sidebar({ skillCategories, jobPosts, cvs, activeId, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[264px] flex-col gap-5 border-r border-border-subtle bg-bg-surface p-3",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <SectionHeader>Skill Bank</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {skillCategories.map((cat) => (
            <NavItem
              key={cat.id}
              label={cat.label}
              icon={CATEGORY_ICONS[cat.label]}
              active={activeId === cat.id}
              trailing={
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-xs font-medium",
                    activeId === cat.id ? "bg-accent text-white" : "bg-bg-elevated text-text-muted",
                  )}
                >
                  {cat.count}
                </span>
              }
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex flex-col gap-1">
        <SectionHeader action={<Plus className="size-3.5 text-text-muted" />}>Job Posts</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {jobPosts.map((job) => (
            <NavItem key={job.id} label={job.label} active={activeId === job.id} />
          ))}
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex flex-col gap-1">
        <SectionHeader action={<Plus className="size-3.5 text-text-muted" />}>CVs</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {cvs.map((cv) => (
            <NavItem key={cv.id} label={cv.label} active={activeId === cv.id} />
          ))}
        </div>
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex flex-col gap-1">
        <SectionHeader>Career</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {CAREER_ITEMS.map((item) => (
            <NavItem key={item.id} label={item.label} icon={item.icon} active={activeId === item.id} />
          ))}
        </div>
      </div>
    </aside>
  );
}
