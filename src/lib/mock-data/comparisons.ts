import type { Comparison } from "@/types/comparison";
import { mockUser } from "./user";

export const comparisons: Comparison[] = [
  {
    id: "cmp-acme",
    userId: mockUser.id,
    jobPostId: "job-acme",
    fitScore: 79,
    gaps: [
      {
        skillId: "skill-kubernetes",
        skillName: "Kubernetes",
        requiredLevel: "INTERMEDIATE",
        currentLevel: null,
        severity: "missing",
      },
      {
        skillId: "skill-graphql",
        skillName: "GraphQL",
        requiredLevel: "INTERMEDIATE",
        currentLevel: null,
        severity: "missing",
      },
      {
        skillId: "skill-postgresql",
        skillName: "PostgreSQL",
        requiredLevel: "ADVANCED",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-aws",
        skillName: "AWS (EC2 / S3 / RDS)",
        requiredLevel: "ADVANCED",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-docker",
        skillName: "Docker",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-nodejs",
        skillName: "Node.js",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-typescript",
        skillName: "TypeScript",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-rest-api-design",
        skillName: "REST API Design",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-git-cicd",
        skillName: "Git & CI/CD",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "ADVANCED",
        severity: "met",
      },
    ],
    advice:
      "1. Learn Kubernetes fundamentals — required for this role and currently unclaimed in your Skill Bank.\n" +
      "2. Add GraphQL to your stack — the posting calls it out explicitly and you have no claimed experience yet.\n" +
      "3. Deepen PostgreSQL — you're claiming Beginner against an Advanced requirement.\n" +
      "4. Strengthen AWS — same gap as PostgreSQL; consider hands-on practice with EC2/S3/RDS.\n" +
      "5. Improve Docker proficiency — you're one level below what's required.",
    createdAt: "2026-07-26T15:45:00.000Z",
  },
  {
    id: "cmp-globex",
    userId: mockUser.id,
    jobPostId: "job-globex",
    fitScore: 64,
    gaps: [
      {
        skillId: "skill-graphql",
        skillName: "GraphQL",
        requiredLevel: "INTERMEDIATE",
        currentLevel: null,
        severity: "missing",
      },
      {
        skillId: "skill-react",
        skillName: "React",
        requiredLevel: "ADVANCED",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-typescript",
        skillName: "TypeScript",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-nextjs",
        skillName: "Next.js",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "INTERMEDIATE",
        severity: "met",
      },
    ],
    advice:
      "1. Add GraphQL — the console's API layer is GraphQL-based and you have no claimed experience yet.\n" +
      "2. Your React and TypeScript proficiency already clears the bar for this role.",
    createdAt: "2026-07-22T14:00:00.000Z",
  },
  {
    id: "cmp-initech",
    userId: mockUser.id,
    jobPostId: "job-initech",
    fitScore: 91,
    gaps: [
      {
        skillId: "skill-terraform",
        skillName: "Terraform",
        requiredLevel: "BEGINNER",
        currentLevel: "BEGINNER",
        severity: "met",
      },
      {
        skillId: "skill-python",
        skillName: "Python",
        requiredLevel: "ADVANCED",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-postgresql",
        skillName: "PostgreSQL",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-aws",
        skillName: "AWS",
        requiredLevel: "INTERMEDIATE",
        currentLevel: "BEGINNER",
        severity: "below",
      },
    ],
    advice:
      "1. Deepen PostgreSQL and AWS slightly — both are one level below what's required, everything else already clears the bar.",
    createdAt: "2026-07-20T09:30:00.000Z",
  },
  {
    id: "cmp-umbrella",
    userId: mockUser.id,
    jobPostId: "job-umbrella",
    fitScore: 43,
    gaps: [
      {
        skillId: "skill-python",
        skillName: "Python",
        requiredLevel: "ADVANCED",
        currentLevel: "ADVANCED",
        severity: "met",
      },
      {
        skillId: "skill-postgresql",
        skillName: "PostgreSQL",
        requiredLevel: "ADVANCED",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-aws",
        skillName: "AWS",
        requiredLevel: "ADVANCED",
        currentLevel: "BEGINNER",
        severity: "below",
      },
      {
        skillId: "skill-kubernetes",
        skillName: "Kubernetes",
        requiredLevel: "INTERMEDIATE",
        currentLevel: null,
        severity: "missing",
      },
      {
        skillId: "skill-system-design",
        skillName: "System Design",
        requiredLevel: "ADVANCED",
        currentLevel: "INTERMEDIATE",
        severity: "below",
      },
    ],
    advice:
      "1. Add Kubernetes — required for this HIPAA-compliant infrastructure and currently unclaimed.\n" +
      "2. Deepen PostgreSQL and AWS — both required at Advanced, currently claimed at Beginner.\n" +
      "3. Strengthen System Design — one level below the required Advanced bar.",
    createdAt: "2026-07-18T11:15:00.000Z",
  },
  {
    id: "cmp-stark",
    userId: mockUser.id,
    jobPostId: "job-stark",
    fitScore: 73,
    gaps: [
      {
        skillId: "skill-kubernetes",
        skillName: "Kubernetes",
        requiredLevel: "ADVANCED",
        currentLevel: null,
        severity: "missing",
      },
      {
        skillId: "skill-terraform",
        skillName: "Terraform",
        requiredLevel: "ADVANCED",
        currentLevel: "BEGINNER",
        severity: "below",
      },
    ],
    advice:
      "1. Add Kubernetes — this platform role requires it and it's currently unclaimed in your Skill Bank.\n" +
      "2. Deepen Terraform — you're claiming Beginner against an Advanced requirement.",
    createdAt: "2026-06-21T09:00:00.000Z",
  },
  {
    id: "cmp-wayne",
    userId: mockUser.id,
    jobPostId: "job-wayne",
    fitScore: 88,
    gaps: [
      {
        skillId: "skill-go",
        skillName: "Go",
        requiredLevel: "ADVANCED",
        currentLevel: "INTERMEDIATE",
        severity: "below",
      },
      {
        skillId: "skill-react",
        skillName: "React",
        requiredLevel: "ADVANCED",
        currentLevel: "ADVANCED",
        severity: "met",
      },
    ],
    advice: "1. Deepen Go — you're one level below the Advanced bar; React already clears it.",
    createdAt: "2026-06-13T10:30:00.000Z",
  },
];
