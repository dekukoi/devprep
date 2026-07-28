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
];
