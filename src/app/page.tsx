import { AppShell } from "@/components/layout";
import type {
  NotificationItem,
  SearchResultGroup,
  SearchResultItem,
  SidebarLinkItem,
  SidebarSkillCategoryItem,
} from "@/components/layout";
import { SKILL_CATEGORY_ICON_NAMES } from "@/lib/constants/icons";
import { slugify } from "@/lib/utils";
import { comparisons, cvs, jobPosts, mockUser, skillBankEntries, skillCategories, skills } from "@/lib/mock-data";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function titleCase(value: string) {
  return value[0] + value.slice(1).toLowerCase();
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

export default function Home() {
  const sidebarSkillCategories: SidebarSkillCategoryItem[] = skillCategories.map((category) => ({
    id: category.id,
    label: category.name,
    count: skillBankEntries.filter((entry) => skills.find((s) => s.id === entry.skillId)?.categoryId === category.id)
      .length,
  }));

  const sidebarJobPosts: SidebarLinkItem[] = jobPosts.map((job) => ({ id: job.id, label: job.company ?? job.title }));
  const sidebarCvs: SidebarLinkItem[] = cvs.map((cv) => ({ id: cv.id, label: cv.title }));

  const jobSearchItems: SearchResultItem[] = jobPosts.map((job) => {
    const comparison = comparisons.find((c) => c.jobPostId === job.id);
    return {
      id: job.id,
      label: job.title,
      meta: comparison ? `${job.company} · ${comparison.fitScore}% fit` : (job.company ?? undefined),
      icon: "file-text",
      href: `/job-posts/${job.id}`,
    };
  });

  const cvSearchItems: SearchResultItem[] = cvs.map((cv) => ({
    id: cv.id,
    label: cv.title,
    meta: `Updated ${timeAgo(cv.updatedAt)}`,
    icon: "file-user",
    href: `/cvs/${cv.id}/edit`,
  }));

  const skillSearchItems: SearchResultItem[] = skillBankEntries.map((entry) => {
    const skill = skills.find((s) => s.id === entry.skillId)!;
    const category = skillCategories.find((c) => c.id === skill.categoryId)!;
    return {
      id: entry.id,
      label: skill.name,
      meta: `${category.name} · ${titleCase(entry.proficiencyLevel)}`,
      icon: SKILL_CATEGORY_ICON_NAMES[category.name],
      href: `/skill-bank/${slugify(category.name)}`,
    };
  });

  const searchGroups: SearchResultGroup[] = [
    { label: "Job Posts", items: jobSearchItems },
    { label: "CVs", items: cvSearchItems },
    { label: "Skills", items: skillSearchItems },
  ];

  const firstComparison = comparisons[0];

  const notifications: NotificationItem[] = [
    {
      id: "notif-comparison",
      message: `Comparison finished for ${jobPosts[0].company} — ${firstComparison.fitScore}% fit`,
      time: "2m ago",
      icon: "trending-up",
      read: false,
    },
    {
      id: "notif-export",
      message: `CV export ready: ${cvs[0].title}.pdf`,
      time: "15m ago",
      icon: "download",
      read: false,
    },
    {
      id: "notif-stale",
      message: `Stale field detected in ${cvs[1].title}`,
      time: "1h ago",
      icon: "triangle-alert",
      read: true,
    },
    {
      id: "notif-import",
      message: "CV imported and parsed successfully",
      time: "3h ago",
      icon: "file-check",
      read: true,
    },
  ];

  return (
    <AppShell
      skillCategories={sidebarSkillCategories}
      jobPosts={sidebarJobPosts}
      cvs={sidebarCvs}
      searchGroups={searchGroups}
      notifications={notifications}
      userInitials={initials(mockUser.name)}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Main content area — placeholder until the Dashboard screen is built.
        </p>
      </div>
    </AppShell>
  );
}
