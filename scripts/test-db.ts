import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { getCertificationExpiryStatus, type CertificationExpiryStatus } from "../src/lib/certifications-data";

const DEMO_USER_EMAIL = "demo@devprep.io";
const DEMO_USER_PASSWORD = "12345678";

interface CheckResult {
  name: string;
  passed: boolean;
  detail?: string;
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const checks: CheckResult[] = [];

  const record = (name: string, passed: boolean, detail?: string) => {
    checks.push({ name, passed, detail });
    console.log(`${passed ? "PASS" : "FAIL"} — ${name}${detail ? ` (${detail})` : ""}`);
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connected to the database successfully.\n");

    console.log("Row counts:");
    const [
      userCount,
      skillCategoryCount,
      skillCount,
      cvTemplateCount,
      skillBankEntryCount,
      experienceCount,
      projectCount,
      certificationCount,
      jobPostCount,
      jobPostRequirementCount,
      unresolvedRequirementCount,
      comparisonCount,
      cvCount,
      cvVersionCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.skillCategory.count(),
      prisma.skill.count(),
      prisma.cVTemplate.count(),
      prisma.skillBankEntry.count(),
      prisma.experience.count(),
      prisma.project.count(),
      prisma.certification.count(),
      prisma.jobPost.count(),
      prisma.jobPostRequirement.count(),
      prisma.unresolvedRequirement.count(),
      prisma.comparison.count(),
      prisma.cV.count(),
      prisma.cVVersion.count(),
    ]);
    console.log({
      userCount,
      skillCategoryCount,
      skillCount,
      cvTemplateCount,
      skillBankEntryCount,
      experienceCount,
      projectCount,
      certificationCount,
      jobPostCount,
      jobPostRequirementCount,
      unresolvedRequirementCount,
      comparisonCount,
      cvCount,
      cvVersionCount,
    });
    console.log("\nDemo data checks:");

    // ---- Demo user ----
    const demoUser = await prisma.user.findUnique({ where: { email: DEMO_USER_EMAIL } });
    record(
      "Demo user exists",
      Boolean(demoUser),
      demoUser ? `${demoUser.name} <${demoUser.email}>` : "no row found — run `npm run db:seed` first",
    );

    if (!demoUser) {
      console.log(`\nSeed verification: ${checks.filter((c) => c.passed).length}/${checks.length} checks passed`);
      process.exitCode = 1;
      return;
    }

    const passwordMatches = demoUser.password ? bcrypt.compareSync(DEMO_USER_PASSWORD, demoUser.password) : false;
    record("Demo user password hash round-trips", passwordMatches);

    // ---- Skill Bank ----
    const sampleSkillBankEntries = await prisma.skillBankEntry.findMany({
      where: { userId: demoUser.id },
      take: 3,
      orderBy: { skillId: "asc" },
      include: { skill: { include: { category: true } } },
    });
    record(
      "Skill Bank entries resolve skill + category via FKs",
      sampleSkillBankEntries.length > 0,
      sampleSkillBankEntries.map((e) => `${e.skill.name} (${e.skill.category.name})`).join(", "),
    );

    // ---- Career history ----
    const demoExperiences = await prisma.experience.findMany({
      where: { userId: demoUser.id },
      include: { linkedSkills: true, projects: true },
    });
    record(
      "Experience rows resolve linked skills + nested projects",
      demoExperiences.length > 0 && demoExperiences.some((e) => e.linkedSkills.length > 0),
      demoExperiences.map((e) => `${e.company}: ${e.linkedSkills.length} skills, ${e.projects.length} project(s)`).join(" | "),
    );

    const standaloneProject = await prisma.project.findFirst({
      where: { userId: demoUser.id, experienceId: null },
    });
    record("A standalone project exists (experienceId: null)", Boolean(standaloneProject), standaloneProject?.title);

    const demoCertifications = await prisma.certification.findMany({ where: { userId: demoUser.id } });
    const expiryStatuses = new Set(
      demoCertifications.map((c) => getCertificationExpiryStatus(c.expiryDate ? c.expiryDate.toISOString() : null)),
    );
    record(
      "All 4 certification expiry states are present",
      (["active", "expiring-soon", "expired", "none"] satisfies CertificationExpiryStatus[]).every((status) =>
        expiryStatuses.has(status),
      ),
      [...expiryStatuses].join(", "),
    );

    // ---- Job posts ----
    const acmeJobPost = await prisma.jobPost.findFirst({
      where: { userId: demoUser.id, company: "Acme App" },
      include: { requirements: true, unresolvedRequirements: true },
    });
    record(
      "Acme job post has confirmed + unresolved requirements",
      Boolean(acmeJobPost && acmeJobPost.requirements.length > 0 && acmeJobPost.unresolvedRequirements.length > 0),
      acmeJobPost
        ? `${acmeJobPost.requirements.length} requirements (${acmeJobPost.requirements.filter((r) => r.mustHave).length} must-have), ${acmeJobPost.unresolvedRequirements.length} unresolved`
        : undefined,
    );

    const noRequirementsJobPost = await prisma.jobPost.findFirst({
      where: { userId: demoUser.id, requirements: { none: {} } },
    });
    record(
      "At least one job post has zero requirements (empty state reachable)",
      Boolean(noRequirementsJobPost),
      noRequirementsJobPost?.title,
    );

    // ---- Comparisons ----
    const demoComparisons = await prisma.comparison.findMany({ where: { userId: demoUser.id } });
    const severityCounts = { met: 0, below: 0, missing: 0 };
    for (const comparison of demoComparisons) {
      const gaps = comparison.gaps as { severity: "met" | "below" | "missing" }[];
      for (const gap of gaps) severityCounts[gap.severity]++;
    }
    record(
      "Comparisons produced gaps in every severity bucket",
      severityCounts.met > 0 && severityCounts.below > 0 && severityCounts.missing > 0,
      `met=${severityCounts.met} below=${severityCounts.below} missing=${severityCounts.missing}`,
    );

    // ---- CVs ----
    const demoCvs = await prisma.cV.findMany({
      where: { userId: demoUser.id },
      include: { template: true, versions: { orderBy: { versionNumber: "desc" } } },
    });
    record(
      "Every CV's latestVersionId matches its highest versionNumber",
      demoCvs.length > 0 && demoCvs.every((cv) => cv.versions[0]?.id === cv.latestVersionId),
      demoCvs.map((cv) => `${cv.title} (${cv.template.name} ${cv.template.variant}) v${cv.versions[0]?.versionNumber}`).join(" | "),
    );

    const passedCount = checks.filter((c) => c.passed).length;
    console.log(`\nSeed verification: ${passedCount}/${checks.length} checks passed`);
    if (passedCount !== checks.length) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Database test failed:", error);
  process.exit(1);
});
