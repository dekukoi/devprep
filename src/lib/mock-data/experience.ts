import type { Certification, Experience, Project } from "@/types/experience";
import { mockUser } from "./user";

export const experiences: Experience[] = [
  {
    id: "exp-lumen",
    userId: mockUser.id,
    company: "Lumen Systems",
    title: "Senior Backend Engineer",
    startDate: "2022-03-01T00:00:00.000Z",
    endDate: null,
    bullets: [
      "Led migration of a monolith to event-driven microservices handling 40M+ daily requests, cutting p99 latency by 38%.",
      "Designed and owned core Go and Python services powering the platform's public API.",
      "Introduced CI/CD pipelines and containerized deployments to AWS, reducing release time from days to hours.",
    ],
    linkedSkillIds: [
      "skill-go",
      "skill-python",
      "skill-aws",
      "skill-docker",
      "skill-postgresql",
      "skill-git-cicd",
    ],
    createdAt: "2025-11-05T10:00:00.000Z",
    updatedAt: "2026-07-18T09:15:00.000Z",
  },
  {
    id: "exp-corebit",
    userId: mockUser.id,
    company: "Corebit",
    title: "Backend Engineer",
    startDate: "2019-06-01T00:00:00.000Z",
    endDate: "2022-02-15T00:00:00.000Z",
    bullets: [
      "Built and maintained RESTful APIs in Django and Node.js serving Corebit's core billing platform.",
      "Optimized slow PostgreSQL queries and data models, improving average response time by 45%.",
      "Mentored two junior engineers and led weekly code review sessions.",
    ],
    linkedSkillIds: [
      "skill-django",
      "skill-nodejs",
      "skill-postgresql",
      "skill-rest-api-design",
      "skill-mentoring",
    ],
    createdAt: "2025-11-05T10:00:00.000Z",
    updatedAt: "2026-06-02T16:40:00.000Z",
  },
];

export const projects: Project[] = [
  {
    id: "proj-status-page",
    userId: mockUser.id,
    experienceId: "exp-lumen",
    title: "Internal Status Page",
    description: "Self-hosted incident and uptime status page used by Lumen's engineering org.",
    bullets: [
      "Built a Next.js + Node.js status page with real-time incident updates via websockets.",
      "Integrated with the on-call rotation to auto-post degraded/down states from alert webhooks.",
    ],
    startDate: "2023-05-01T00:00:00.000Z",
    endDate: "2023-08-01T00:00:00.000Z",
    linkedSkillIds: ["skill-nextjs", "skill-nodejs", "skill-typescript"],
    createdAt: "2025-11-06T10:00:00.000Z",
    updatedAt: "2025-11-06T10:00:00.000Z",
  },
  {
    id: "proj-oss-cli",
    userId: mockUser.id,
    experienceId: null,
    title: "sqlfmt-go (open source)",
    description: "A small Go CLI that formats SQL files, published on GitHub.",
    bullets: [
      "Wrote a recursive-descent SQL parser in Go to support consistent formatting across dialects.",
      "Reached 300+ GitHub stars and accepted contributions from 6 outside contributors.",
    ],
    startDate: "2024-01-15T00:00:00.000Z",
    endDate: null,
    linkedSkillIds: ["skill-go", "skill-sql"],
    createdAt: "2025-11-06T10:05:00.000Z",
    updatedAt: "2026-05-10T12:00:00.000Z",
  },
];

export const certifications: Certification[] = [
  {
    id: "cert-aws-saa",
    userId: mockUser.id,
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issueDate: "2023-09-01T00:00:00.000Z",
    expiryDate: "2026-09-01T00:00:00.000Z",
    credentialUrl: "https://www.credly.com/badges/example",
    linkedSkillIds: ["skill-aws"],
  },
];
