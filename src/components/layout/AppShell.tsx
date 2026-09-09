"use client";

import * as React from "react";
import Link from "next/link";
import { Terminal, X } from "lucide-react";
import { Sidebar, type SidebarLinkItem, type SidebarSkillCategoryItem } from "./Sidebar";
import { Topbar, type NotificationItem, type SearchResultGroup } from "./Topbar";

const COLLAPSE_STORAGE_KEY = "devprep:sidebar-collapsed";
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeToMediaQuery(query: string) {
  return (onStoreChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };
}

const subscribeToDesktopQuery = subscribeToMediaQuery(DESKTOP_QUERY);
const getDesktopSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getDesktopServerSnapshot = () => true;

function useIsDesktop() {
  return React.useSyncExternalStore(subscribeToDesktopQuery, getDesktopSnapshot, getDesktopServerSnapshot);
}

const collapseListeners = new Set<() => void>();
const getCollapsedSnapshot = () => window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "true";
const getCollapsedServerSnapshot = () => false;

function subscribeToCollapsed(onStoreChange: () => void) {
  collapseListeners.add(onStoreChange);
  return () => collapseListeners.delete(onStoreChange);
}

function setCollapsedPreference(value: boolean) {
  window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(value));
  collapseListeners.forEach((listener) => listener());
}

function useSidebarCollapsed() {
  const collapsed = React.useSyncExternalStore(subscribeToCollapsed, getCollapsedSnapshot, getCollapsedServerSnapshot);
  const setCollapsed = React.useCallback((value: boolean | ((current: boolean) => boolean)) => {
    const next = typeof value === "function" ? (value as (current: boolean) => boolean)(getCollapsedSnapshot()) : value;
    setCollapsedPreference(next);
  }, []);
  return [collapsed, setCollapsed] as const;
}

interface AppShellProps {
  skillCategories: SidebarSkillCategoryItem[];
  jobPosts: SidebarLinkItem[];
  cvs: SidebarLinkItem[];
  searchGroups: SearchResultGroup[];
  notifications: NotificationItem[];
  userInitials?: string;
  children: React.ReactNode;
}

export function AppShell({
  skillCategories,
  jobPosts,
  cvs,
  searchGroups,
  notifications: initialNotifications,
  userInitials,
  children,
}: AppShellProps) {
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(initialNotifications);

  const drawerVisible = drawerOpen && !isDesktop;

  React.useEffect(() => {
    if (!drawerVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerVisible]);

  const handleMenuClick = () => setDrawerOpen((v) => !v);

  const handleMarkAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleNotificationClick = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="flex h-dvh flex-col">
      <Topbar
        userInitials={userInitials}
        searchGroups={searchGroups}
        notifications={notifications}
        onMenuClick={handleMenuClick}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />

      <div className="flex min-h-0 flex-1">
        <Sidebar
          className="hidden lg:flex"
          skillCategories={skillCategories}
          jobPosts={jobPosts}
          cvs={cvs}
          collapsed={collapsed}
          onExpand={() => setCollapsed(false)}
          onCollapse={() => setCollapsed(true)}
        />

        {drawerVisible && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/70 animate-in fade-in-0 duration-200"
            />
            <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col overflow-hidden shadow-[4px_0_24px_#00000080] animate-in slide-in-from-left duration-300 ease-out">
              <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border-subtle bg-bg-surface px-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
                  <span className="flex size-6 items-center justify-center rounded-md bg-accent">
                    <Terminal className="size-3.5 text-white" />
                  </span>
                  <span className="text-sm font-bold tracking-tight text-text-primary">DevPrep</span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="flex size-7 items-center justify-center rounded-sm border-2 border-accent bg-bg-surface-2 text-text-secondary focus-visible:outline-none"
                >
                  <X className="size-[15px]" />
                </button>
              </div>
              <Sidebar
                className="min-h-0 flex-1"
                skillCategories={skillCategories}
                jobPosts={jobPosts}
                cvs={cvs}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-y-auto bg-bg-base">{children}</main>
      </div>
    </div>
  );
}
