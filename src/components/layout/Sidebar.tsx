"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  FileText,
  FileUser,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { SKILL_CATEGORY_ICONS } from "@/lib/constants/skill-categories";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface SidebarSkillCategoryItem {
  id: string;
  label: string;
  count: number;
}

export interface SidebarLinkItem {
  id: string;
  label: string;
}

interface SidebarProps {
  skillCategories: SidebarSkillCategoryItem[];
  jobPosts: SidebarLinkItem[];
  cvs: SidebarLinkItem[];
  collapsed?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onAddJobPost?: () => void;
  onAddCv?: () => void;
  onNavigate?: () => void;
  className?: string;
}

const CAREER_ITEMS: { id: string; label: string; href: string; icon: LucideIcon }[] = [
  { id: "experience", label: "Experience", href: "/experience", icon: Briefcase },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
  { id: "certifications", label: "Certifications", href: "/certifications", icon: Award },
];

function SectionHeader({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5">
      <span className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">{children}</span>
      {action}
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-bg-elevated px-[7px] py-px text-[11px] font-semibold text-text-muted">
      {count}
    </span>
  );
}

function AddButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[18px] shrink-0 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary transition-colors hover:bg-border-subtle hover:text-text-primary"
    >
      <Plus className="size-3" />
    </button>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  trailing,
  onClick,
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2.5 rounded-sm px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        active ? "bg-accent-soft font-semibold text-text-primary" : "font-medium text-text-secondary hover:bg-bg-surface-2",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {Icon && <Icon className={cn("size-4 shrink-0", active ? "text-accent" : "text-text-secondary")} />}
        <span className="truncate">{label}</span>
      </span>
      {trailing}
    </Link>
  );
}

function EmptyAddPrompt({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-sm border border-border-subtle px-2.5 py-2 text-[13px] font-medium text-text-muted transition-colors hover:border-border-strong hover:text-text-secondary"
    >
      <Plus className="size-3.5" />
      {label}
    </button>
  );
}

function CollapsedIconButton({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          onClick={onClick}
          aria-label={label}
          className={cn(
            "flex h-9 w-full items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            active ? "bg-accent-soft text-accent" : "text-text-secondary hover:bg-bg-surface-2",
          )}
        >
          <Icon className="size-4" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar({
  skillCategories,
  jobPosts,
  cvs,
  collapsed = false,
  onExpand,
  onCollapse,
  onAddJobPost,
  onAddCv,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden border-r border-border-subtle bg-bg-surface p-3 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-[264px]",
        className,
      )}
    >
      {collapsed ? (
        <div key="collapsed" className="flex h-full flex-col gap-5 animate-in fade-in-0 duration-200">
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent">
            <Terminal className="size-4 text-white" />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onExpand}
                aria-label="Expand sidebar"
                className="flex h-8 w-full items-center justify-center rounded-sm border-2 border-accent bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary"
              >
                <PanelLeftOpen className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>

          <div className="flex flex-col gap-0.5">
            {skillCategories.map((cat) => {
              const href = `/skill-bank/${slugify(cat.label)}`;
              const Icon = SKILL_CATEGORY_ICONS[cat.label];
              return (
                <CollapsedIconButton
                  key={cat.id}
                  href={href}
                  label={cat.label}
                  icon={Icon}
                  active={isActive(href)}
                  onClick={onNavigate}
                />
              );
            })}
          </div>

          <div className="h-px bg-border-subtle" />

          <div className="flex flex-col gap-0.5">
            <CollapsedIconButton href="/job-posts" label="Job Posts" icon={FileText} active={isActive("/job-posts")} onClick={onNavigate} />
            <CollapsedIconButton href="/cvs" label="CVs" icon={FileUser} active={isActive("/cvs")} onClick={onNavigate} />
          </div>

          <div className="h-px bg-border-subtle" />

          <div className="flex flex-col gap-0.5">
            {CAREER_ITEMS.map((item) => (
              <CollapsedIconButton
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(item.href)}
                onClick={onNavigate}
              />
            ))}
          </div>
        </div>
      ) : (
        <div key="expanded" className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto animate-in fade-in-0 duration-200">
          {onCollapse && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onCollapse}
                  aria-label="Collapse sidebar"
                  className="flex size-8 shrink-0 items-center justify-center rounded-sm border-2 border-accent bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary"
                >
                  <PanelLeftClose className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Collapse sidebar</TooltipContent>
            </Tooltip>
          )}

          <div className="flex flex-col gap-1">
            <SectionHeader>Skill Bank</SectionHeader>
            <div className="flex flex-col gap-0.5">
              {skillCategories.map((cat) => {
                const href = `/skill-bank/${slugify(cat.label)}`;
                return (
                  <NavItem
                    key={cat.id}
                    href={href}
                    label={cat.label}
                    icon={SKILL_CATEGORY_ICONS[cat.label]}
                    active={isActive(href)}
                    onClick={onNavigate}
                    trailing={<CountBadge count={cat.count} />}
                  />
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border-subtle" />

          <div className="flex flex-col gap-2">
            <SectionHeader
              action={
                <div className="flex items-center gap-1.5">
                  <CountBadge count={jobPosts.length} />
                  <AddButton label="Add job post" onClick={onAddJobPost} />
                </div>
              }
            >
              Job Posts
            </SectionHeader>
            {jobPosts.length === 0 ? (
              <EmptyAddPrompt label="Add Job Post" onClick={onAddJobPost} />
            ) : (
              <div className="flex flex-col gap-0.5">
                {jobPosts.map((job) => (
                  <NavItem key={job.id} href={`/job-posts/${job.id}`} label={job.label} icon={FileText} active={isActive(`/job-posts/${job.id}`)} onClick={onNavigate} />
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border-subtle" />

          <div className="flex flex-col gap-2">
            <SectionHeader
              action={
                <div className="flex items-center gap-1.5">
                  <CountBadge count={cvs.length} />
                  <AddButton label="Add CV" onClick={onAddCv} />
                </div>
              }
            >
              CVs
            </SectionHeader>
            {cvs.length === 0 ? (
              <EmptyAddPrompt label="Add CV" onClick={onAddCv} />
            ) : (
              <div className="flex flex-col gap-0.5">
                {cvs.map((cv) => (
                  <NavItem key={cv.id} href={`/cvs/${cv.id}/edit`} label={cv.label} icon={FileUser} active={isActive(`/cvs/${cv.id}`)} onClick={onNavigate} />
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-border-subtle" />

          <div className="flex flex-col gap-1">
            <SectionHeader>Career</SectionHeader>
            <div className="flex flex-col gap-0.5">
              {CAREER_ITEMS.map((item) => (
                <NavItem key={item.id} href={item.href} label={item.label} icon={item.icon} active={isActive(item.href)} onClick={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
