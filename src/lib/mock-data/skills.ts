import type { Skill, SkillBankEntry, SkillCategory } from "@/types/skill";
import { mockUser } from "./user";

export const skillCategories: SkillCategory[] = [
  { id: "cat-languages", name: "Languages" },
  { id: "cat-frameworks", name: "Frameworks" },
  { id: "cat-tools", name: "Tools" },
  { id: "cat-soft-skills", name: "Soft Skills" },
  { id: "cat-domain-knowledge", name: "Domain Knowledge" },
];

export const skills: Skill[] = [
  // Languages (6 claimed)
  { id: "skill-javascript", name: "JavaScript", categoryId: "cat-languages" },
  { id: "skill-typescript", name: "TypeScript", categoryId: "cat-languages" },
  { id: "skill-python", name: "Python", categoryId: "cat-languages" },
  { id: "skill-sql", name: "SQL", categoryId: "cat-languages" },
  { id: "skill-go", name: "Go", categoryId: "cat-languages" },
  { id: "skill-rust", name: "Rust", categoryId: "cat-languages" },

  // Frameworks (5 claimed + GraphQL unclaimed)
  { id: "skill-react", name: "React", categoryId: "cat-frameworks" },
  { id: "skill-nextjs", name: "Next.js", categoryId: "cat-frameworks" },
  { id: "skill-nodejs", name: "Node.js", categoryId: "cat-frameworks" },
  { id: "skill-django", name: "Django", categoryId: "cat-frameworks" },
  { id: "skill-express", name: "Express", categoryId: "cat-frameworks" },
  { id: "skill-graphql", name: "GraphQL", categoryId: "cat-frameworks" },

  // Tools (8 claimed + Kubernetes unclaimed)
  { id: "skill-docker", name: "Docker", categoryId: "cat-tools" },
  { id: "skill-git", name: "Git", categoryId: "cat-tools" },
  { id: "skill-postgresql", name: "PostgreSQL", categoryId: "cat-tools" },
  { id: "skill-aws", name: "AWS", categoryId: "cat-tools" },
  { id: "skill-redis", name: "Redis", categoryId: "cat-tools" },
  { id: "skill-terraform", name: "Terraform", categoryId: "cat-tools" },
  { id: "skill-celery", name: "Celery", categoryId: "cat-tools" },
  { id: "skill-linux", name: "Linux", categoryId: "cat-tools" },
  { id: "skill-kubernetes", name: "Kubernetes", categoryId: "cat-tools" },

  // Soft Skills (4 claimed)
  { id: "skill-communication", name: "Communication", categoryId: "cat-soft-skills" },
  { id: "skill-leadership", name: "Leadership", categoryId: "cat-soft-skills" },
  { id: "skill-mentoring", name: "Mentoring", categoryId: "cat-soft-skills" },
  { id: "skill-collaboration", name: "Collaboration", categoryId: "cat-soft-skills" },

  // Domain Knowledge (3 claimed)
  { id: "skill-rest-api-design", name: "REST API Design", categoryId: "cat-domain-knowledge" },
  { id: "skill-git-cicd", name: "Git & CI/CD", categoryId: "cat-domain-knowledge" },
  { id: "skill-system-design", name: "System Design", categoryId: "cat-domain-knowledge" },
];

const entry = (
  id: string,
  skillId: string,
  proficiencyLevel: SkillBankEntry["proficiencyLevel"],
  yearsOfExperience: number | null,
): SkillBankEntry => ({
  id,
  userId: mockUser.id,
  skillId,
  proficiencyLevel,
  yearsOfExperience,
  createdAt: "2025-11-05T10:00:00.000Z",
  updatedAt: "2026-07-20T11:30:00.000Z",
});

export const skillBankEntries: SkillBankEntry[] = [
  // Languages
  entry("sbe-javascript", "skill-javascript", "EXPERT", 6),
  entry("sbe-typescript", "skill-typescript", "ADVANCED", 4),
  entry("sbe-python", "skill-python", "ADVANCED", 5),
  entry("sbe-sql", "skill-sql", "ADVANCED", 5),
  entry("sbe-go", "skill-go", "INTERMEDIATE", 2),
  entry("sbe-rust", "skill-rust", "BEGINNER", 1),

  // Frameworks (GraphQL intentionally not claimed)
  entry("sbe-react", "skill-react", "ADVANCED", 5),
  entry("sbe-nextjs", "skill-nextjs", "INTERMEDIATE", 2),
  entry("sbe-nodejs", "skill-nodejs", "ADVANCED", 4),
  entry("sbe-django", "skill-django", "INTERMEDIATE", 3),
  entry("sbe-express", "skill-express", "INTERMEDIATE", 3),

  // Tools (Kubernetes intentionally not claimed)
  entry("sbe-docker", "skill-docker", "BEGINNER", 1),
  entry("sbe-git", "skill-git", "ADVANCED", 6),
  entry("sbe-postgresql", "skill-postgresql", "BEGINNER", 1),
  entry("sbe-aws", "skill-aws", "BEGINNER", 1),
  entry("sbe-redis", "skill-redis", "INTERMEDIATE", 2),
  entry("sbe-terraform", "skill-terraform", "BEGINNER", 1),
  entry("sbe-celery", "skill-celery", "INTERMEDIATE", 2),
  entry("sbe-linux", "skill-linux", "ADVANCED", 5),

  // Soft Skills
  entry("sbe-communication", "skill-communication", "ADVANCED", null),
  entry("sbe-leadership", "skill-leadership", "INTERMEDIATE", null),
  entry("sbe-mentoring", "skill-mentoring", "INTERMEDIATE", null),
  entry("sbe-collaboration", "skill-collaboration", "ADVANCED", null),

  // Domain Knowledge
  entry("sbe-rest-api-design", "skill-rest-api-design", "ADVANCED", 5),
  entry("sbe-git-cicd", "skill-git-cicd", "ADVANCED", 4),
  entry("sbe-system-design", "skill-system-design", "INTERMEDIATE", 2),
];
