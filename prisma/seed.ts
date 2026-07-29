import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Matches src/lib/mock-data/skills.ts — keep the two in sync.
const skillTaxonomy: Record<string, string[]> = {
  Languages: ["JavaScript", "TypeScript", "Python", "SQL", "Go", "Rust"],
  Frameworks: ["React", "Next.js", "Node.js", "Django", "Express", "GraphQL"],
  Tools: ["Docker", "Git", "PostgreSQL", "AWS", "Redis", "Terraform", "Celery", "Linux", "Kubernetes"],
  "Soft Skills": ["Communication", "Leadership", "Mentoring", "Collaboration"],
  "Domain Knowledge": ["REST API Design", "Git & CI/CD", "System Design"],
};

const cvTemplates = [
  { name: "Aurora", variant: "SINGLE_COLUMN" },
  { name: "Aurora", variant: "TWO_COLUMN" },
  { name: "Slate", variant: "SINGLE_COLUMN" },
  { name: "Slate", variant: "TWO_COLUMN" },
  { name: "Mono", variant: "SINGLE_COLUMN" },
  { name: "Mono", variant: "TWO_COLUMN" },
] as const;

async function main() {
  console.log("Seeding fixed taxonomy...");

  for (const [categoryName, skillNames] of Object.entries(skillTaxonomy)) {
    const category = await prisma.skillCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    for (const skillName of skillNames) {
      await prisma.skill.upsert({
        where: { categoryId_name: { categoryId: category.id, name: skillName } },
        update: {},
        create: { name: skillName, categoryId: category.id },
      });
    }
  }

  console.log("Seeding CV templates...");

  for (const template of cvTemplates) {
    await prisma.cVTemplate.upsert({
      where: { name_variant: { name: template.name, variant: template.variant } },
      update: {},
      create: template,
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
