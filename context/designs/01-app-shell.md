# App Shell — Sidebar + Topbar

Frames: `Sidebar`, `Topbar`

## Goal
Every other screen depends on this shell for navigation, search, and account access. Nothing here should be a dead end.

## End-to-end user flow
1. Click the collapse control to shrink the sidebar to icon-only; click again to expand. Preference persists across sessions.
2. See a live count badge next to each Skill Bank category (Languages, Frameworks, Tools, Soft Skills, Domain) and next to the Job Posts / CVs group headers.
3. Click any sidebar item → navigate there; the active item stays visually highlighted.
4. If Job Posts or CVs is empty, the group shows an inline "+ Add" prompt instead of a blank list.
5. Click a persistent "+" next to the "Job Posts" or "CVs" group header to jump straight into that section's Add flow, without first navigating into the list screen.
6. Below 1024px, tap a hamburger icon in the Topbar (currently missing from the mock) to slide the sidebar in as a drawer; tap outside or an X to close it.
7. Type in the Topbar search field → a dropdown appears with live results grouped by type (Job Posts / CVs / Skills); click a result to go straight to it. Typing something with no matches shows a "No results for '...'" state.
8. Click the bell icon → a dropdown lists recent notifications (comparison finished, CV export ready, stale field detected, CV import parsed), newest first, unread visually distinct; clicking one navigates to its source and marks it read.
9. Click the gear icon → navigate to a new **Settings** screen (not yet designed — needs its own frame: profile, the stale-indicator on/off toggle, billing/Pro status, notification preferences).
10. Click the avatar → a menu opens: Profile, Settings, Upgrade to Pro, Sign out.

## States & edge cases
- Sidebar collapsed state: icons only, tooltips on hover show the label
- Zero notifications: bell shows no badge, dropdown says "You're all caught up"
- Search with zero characters typed: dropdown stays closed

## Pencil Prompt

> On the `Sidebar` and `Topbar` frames, finish these end-to-end: (1) add a collapse/expand control to the sidebar with an icon-only collapsed state and hover tooltips; (2) add count badges next to each Skill Bank category and next to the Job Posts/CVs group headers; (3) design empty states for the Job Posts and CVs sidebar groups with an inline "+ Add" prompt; (4) add a small persistent "+" icon button next to the "Job Posts" and "CVs" group headers; (5) add a hamburger menu icon to the Topbar (left of the DevPrep logo) that would open the sidebar as a drawer on mobile/tablet — design the drawer-open state as a separate frame; (6) make the Topbar search bar functional-looking: add a dropdown result panel below it showing grouped sections "Job Posts", "CVs", "Skills" with 2-3 sample results each, plus a separate "No results found" empty variant; (7) design the notification bell's dropdown panel: a list of 4-5 sample notifications (mixed read/unread styling) with timestamps and an icon per type, plus an empty "You're all caught up" variant; (8) design the avatar's dropdown menu with items: Profile, Settings, Upgrade to Pro, Sign out. Keep the existing dark theme, purple accent, and Lucide icon set consistent throughout.
