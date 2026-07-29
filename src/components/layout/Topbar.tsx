"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  LogOut,
  Menu,
  Search,
  SearchX,
  Settings,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ICON_REGISTRY, type IconName } from "@/lib/constants/icons";

export interface SearchResultItem {
  id: string;
  label: string;
  meta?: string;
  icon: IconName;
  href: string;
}

export interface SearchResultGroup {
  label: string;
  items: SearchResultItem[];
}

export interface NotificationItem {
  id: string;
  message: string;
  time: string;
  icon: IconName;
  read: boolean;
  href?: string;
}

interface TopbarProps {
  userInitials?: string;
  searchGroups: SearchResultGroup[];
  notifications: NotificationItem[];
  onMenuClick?: () => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (id: string) => void;
  onSignOut?: () => void;
  className?: string;
}

function IconButton({
  icon: Icon,
  label,
  className,
  ...props
}: { icon: LucideIcon; label: string } & React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      {...props}
    >
      <Icon className="size-[17px]" />
    </button>
  );
}

function SearchResults({ groups, query }: { groups: SearchResultGroup[]; query: string }) {
  const hasResults = groups.some((g) => g.items.length > 0);

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center gap-2 px-5 py-7 text-center">
        <SearchX className="size-[22px] text-text-muted" />
        <p className="text-[13px] font-medium text-text-secondary">No results for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 py-1.5">
      {groups.map(
        (group, i) =>
          group.items.length > 0 && (
            <React.Fragment key={group.label}>
              {i > 0 && <div className="my-1 h-px bg-border-subtle" />}
              <span className="px-4 pt-2.5 pb-1 text-[10.5px] font-semibold tracking-wider text-text-muted uppercase">
                {group.label}
              </span>
              {group.items.map((item) => {
                const Icon = ICON_REGISTRY[item.icon];
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-sm px-4 py-2 hover:bg-bg-surface-2 focus-visible:bg-bg-surface-2 focus-visible:outline-none"
                  >
                    <Icon className="size-[15px] shrink-0 text-text-muted" />
                    <span className="flex min-w-0 flex-col gap-px">
                      <span className="truncate text-[13px] font-medium text-text-primary">{item.label}</span>
                      {item.meta && <span className="truncate text-[11.5px] text-text-muted">{item.meta}</span>}
                    </span>
                  </Link>
                );
              })}
            </React.Fragment>
          ),
      )}
    </div>
  );
}

function NotificationRow({ item, onClick }: { item: NotificationItem; onClick?: () => void }) {
  const Icon = ICON_REGISTRY[item.icon];
  const content = (
    <div
      className={cn(
        "relative flex items-center gap-2.5 overflow-hidden rounded-sm px-4 py-2.5 hover:bg-bg-surface-2 focus-visible:outline-none",
        item.read ? "bg-transparent" : "bg-accent-soft",
      )}
    >
      {!item.read && <span className="absolute inset-y-0 left-0 w-[3px] bg-accent" />}
      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-bg-elevated">
        <Icon className={cn("size-3.5", item.read ? "text-text-muted" : "text-accent-hover")} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className={cn("text-[12.5px]", item.read ? "font-medium text-text-secondary" : "font-semibold text-text-primary")}>
          {item.message}
        </span>
        <span className="text-[11px] text-text-muted">{item.time}</span>
      </span>
    </div>
  );

  return item.href ? (
    <Link href={item.href} onClick={onClick} className="block">
      {content}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {content}
    </button>
  );
}

export function Topbar({
  userInitials = "JR",
  searchGroups,
  notifications,
  onMenuClick,
  onMarkAllRead,
  onNotificationClick,
  onSignOut,
  className,
}: TopbarProps) {
  const [query, setQuery] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);

  const filteredGroups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchGroups.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.label.toLowerCase().includes(q) || item.meta?.toLowerCase().includes(q),
      ),
    }));
  }, [query, searchGroups]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        "flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-bg-surface px-4 lg:h-[60px] lg:gap-4 lg:pr-6 lg:pl-5",
        className,
      )}
    >
      <div className="flex items-center gap-3 lg:gap-6">
        <IconButton icon={Menu} label="Toggle sidebar" onClick={onMenuClick} />
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent">
            <Terminal className="size-4 text-white" />
          </span>
          <span className="text-base font-bold tracking-tight text-text-primary">DevPrep</span>
        </Link>
      </div>

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverAnchor asChild>
          <div className="hidden w-[420px] items-center gap-2.5 rounded-sm border border-border-subtle bg-bg-base px-3.5 py-2.5 focus-within:border-accent lg:flex">
            <Search className="size-4 shrink-0 text-text-muted" />
            <input
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                setSearchOpen(value.trim().length > 0);
              }}
              onFocus={() => query.trim().length > 0 && setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setSearchOpen(false);
                  e.currentTarget.blur();
                }
              }}
              placeholder="Search postings, CVs, skills…"
              aria-label="Search postings, CVs, skills"
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[420px] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SearchResults groups={filteredGroups} query={query} />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Link
          href="/settings"
          aria-label="Settings"
          className="hidden size-9 shrink-0 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:flex"
        >
          <Settings className="size-[17px]" />
        </Link>

        <NotificationsMenu
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={onMarkAllRead}
          onNotificationClick={onNotificationClick}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
            >
              <Avatar className="border border-border-strong">
                <AvatarFallback className="bg-accent-soft text-[13px] font-semibold text-accent-hover">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="size-[15px] text-text-secondary" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="size-[15px] text-text-secondary" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/upgrade" className="text-accent-hover">
                <Sparkles className="size-[15px] text-accent-hover" />
                Upgrade to Pro
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-sev-missing">
              <LogOut className="size-[15px] text-sev-missing" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function NotificationsMenu({
  notifications,
  unreadCount,
  onMarkAllRead,
  onNotificationClick,
}: {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAllRead?: () => void;
  onNotificationClick?: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setOpen((v) => !v)}
          className="relative flex size-9 shrink-0 items-center justify-center rounded-sm bg-bg-surface-2 text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Bell className="size-[17px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-bg-surface-2" />
          )}
        </button>
      </PopoverAnchor>
      <PopoverContent className="w-[340px] p-0" align="end">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
            <BellOff className="size-6 text-text-muted" />
            <p className="text-[13px] font-medium text-text-secondary">You&rsquo;re all caught up</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <span className="text-[13.5px] font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-[11.5px] font-medium text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="flex flex-col gap-0.5 p-1.5">
              {notifications.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  onClick={() => {
                    onNotificationClick?.(item.id);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
