"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TopbarProps {
  userInitials?: string;
  onMenuClick?: () => void;
  className?: string;
}

export function Topbar({ userInitials = "JR", onMenuClick, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "flex h-[60px] w-full items-center justify-between gap-4 border-b border-border-subtle bg-bg-surface py-0 pr-6 pl-5",
        className,
      )}
    >
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-9 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary"
        >
          <Menu className="size-[18px]" />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-lg bg-accent" />
          <span className="text-base font-bold tracking-tight text-text-primary">DevPrep</span>
        </div>
      </div>

      <div className="flex w-[420px] items-center gap-2.5 rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5">
        <Search className="size-4 text-text-muted" />
        <span className="text-sm text-text-muted">Search postings, CVs, skills…</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary"
        >
          <Settings className="size-4" />
        </button>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary"
        >
          <Bell className="size-4" />
        </button>
        <Avatar className="border border-border-strong">
          <AvatarFallback className="bg-accent-soft text-xs text-accent">{userInitials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
