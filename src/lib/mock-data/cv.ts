import type { CV, CVContent, CVTemplate, CVVersion } from "@/types/cv";
import { mockUser } from "./user";

export const cvTemplates: CVTemplate[] = [
  { id: "tmpl-aurora-single", name: "Aurora", variant: "SINGLE_COLUMN" },
  { id: "tmpl-aurora-two", name: "Aurora", variant: "TWO_COLUMN" },
  { id: "tmpl-slate-single", name: "Slate", variant: "SINGLE_COLUMN" },
  { id: "tmpl-slate-two", name: "Slate", variant: "TWO_COLUMN" },
  { id: "tmpl-mono-single", name: "Mono", variant: "SINGLE_COLUMN" },
  { id: "tmpl-mono-two", name: "Mono", variant: "TWO_COLUMN" },
];

const acmeContent: CVContent = {
  name: mockUser.name,
  role: mockUser.role,
  email: mockUser.email,
  phone: mockUser.phone,
  location: mockUser.location,
  links: mockUser.links,
  summary:
    "Backend engineer with 6+ years building scalable, distributed services in Go and Python. Led migration of a monolith to event-driven microservices handling 40M+ daily requests, cutting p99 latency by 38%.",
  experience: [
    {
      company: "Lumen Systems",
      title: "Senior Backend Engineer",
      dateRange: "Mar 2022 — Present",
      bullets: [
        "Led migration of a monolith to event-driven microservices handling 40M+ daily requests, cutting p99 latency by 38%.",
        "Designed and owned core Go and Python services powering the platform's public API.",
      ],
    },
    {
      company: "Corebit",
      title: "Backend Engineer",
      dateRange: "Jun 2019 — Feb 2022",
      bullets: [
        "Built and maintained RESTful APIs in Django and Node.js serving Corebit's core billing platform.",
        "Optimized slow PostgreSQL queries and data models, improving average response time by 45%.",
      ],
    },
  ],
  skills: ["Go", "Python", "TypeScript", "PostgreSQL", "Docker", "AWS", "REST API Design"],
};

const globexContent: CVContent = {
  ...acmeContent,
  summary:
    "Frontend-leaning full-stack engineer with production React and TypeScript experience, plus a strong backend foundation in Go and Python.",
  skills: ["TypeScript", "React", "Next.js", "Node.js", "REST API Design"],
};

const initechContent: CVContent = {
  ...acmeContent,
  summary:
    "Full-stack engineer comfortable across a Next.js frontend and a Python/Django services backend, with hands-on PostgreSQL and AWS experience.",
  skills: ["Python", "Django", "Next.js", "Node.js", "PostgreSQL", "AWS"],
};

export const cvs: CV[] = [
  {
    id: "cv-acme",
    userId: mockUser.id,
    templateId: "tmpl-aurora-single",
    jobPostId: "job-acme",
    title: "Backend Developer - Acme App",
    draftContent: acmeContent,
    latestVersionId: "cvv-acme-5",
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-07-26T09:00:00.000Z",
  },
  {
    id: "cv-globex",
    userId: mockUser.id,
    templateId: "tmpl-slate-two",
    jobPostId: "job-globex",
    title: "Frontend Engineer - Globex",
    draftContent: globexContent,
    latestVersionId: "cvv-globex-1",
    createdAt: "2026-06-15T10:00:00.000Z",
    updatedAt: "2026-07-23T09:00:00.000Z",
  },
  {
    id: "cv-initech",
    userId: mockUser.id,
    templateId: "tmpl-mono-single",
    jobPostId: "job-initech",
    title: "Full-Stack Developer - Initech",
    draftContent: initechContent,
    latestVersionId: "cvv-initech-1",
    createdAt: "2026-06-20T10:00:00.000Z",
    updatedAt: "2026-07-21T09:00:00.000Z",
  },
];

const acmeVersionNotes = [
  "Initial draft from Skill Bank import",
  "Reordered experience bullets to lead with impact metrics",
  "Added Docker/AWS keywords after first comparison run",
  "Tightened summary, added Kubernetes learning note",
  "Accepted AI-suggested summary rewrite",
];

export const cvVersions: CVVersion[] = [
  ...acmeVersionNotes.map(
    (note, i): CVVersion => ({
      id: `cvv-acme-${i + 1}`,
      cvId: "cv-acme",
      versionNumber: i + 1,
      content: acmeContent,
      contentHash: `hash-acme-v${i + 1}`,
      renderedFileUrl: null,
      createdAt: new Date(Date.UTC(2026, 5, 1 + i * 12, 10)).toISOString(),
    }),
  ),
  {
    id: "cvv-globex-1",
    cvId: "cv-globex",
    versionNumber: 1,
    content: globexContent,
    contentHash: "hash-globex-v1",
    renderedFileUrl: null,
    createdAt: "2026-06-15T10:00:00.000Z",
  },
  {
    id: "cvv-initech-1",
    cvId: "cv-initech",
    versionNumber: 1,
    content: initechContent,
    contentHash: "hash-initech-v1",
    renderedFileUrl: null,
    createdAt: "2026-06-20T10:00:00.000Z",
  },
];
