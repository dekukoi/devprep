import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma, type ProficiencyLevel } from "../src/generated/prisma/client";
import {
  mockUser,
  skillCategories,
  skills,
  skillBankEntries,
  experiences,
  projects,
  certifications,
  jobPosts,
  jobPostRequirements,
  unresolvedRequirements,
  comparisons,
  cvTemplates,
  cvs,
  cvVersions,
} from "../src/lib/mock-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fixed, known dev-login credentials for the demo user — see context/features/seed-spec.md.
const DEMO_USER_EMAIL = "demo@devprep.io";
const DEMO_USER_PASSWORD = "12345678";
const DEMO_USER_BCRYPT_ROUNDS = 12;

const LEVEL_RANK: Record<ProficiencyLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

// Prisma's Json input types require an index signature our concrete mock-data
// interfaces (CVContent, ComparisonGap[]) don't declare — bridge via `unknown`.
function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function computeSeverity(
  requiredLevel: ProficiencyLevel,
  currentLevel: ProficiencyLevel | null,
): "met" | "below" | "missing" {
  if (!currentLevel) return "missing";
  return LEVEL_RANK[currentLevel] >= LEVEL_RANK[requiredLevel] ? "met" : "below";
}

async function main() {
  // ============================================
  // Fixed / system data
  // ============================================
  console.log("Seeding fixed taxonomy...");

  const skillCategoryIdByMockId = new Map<string, string>();
  for (const category of skillCategories) {
    const created = await prisma.skillCategory.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
    skillCategoryIdByMockId.set(category.id, created.id);
  }

  const skillIdByMockId = new Map<string, string>();
  for (const skill of skills) {
    const categoryId = skillCategoryIdByMockId.get(skill.categoryId);
    if (!categoryId) throw new Error(`Unknown skill category for skill "${skill.name}"`);
    const created = await prisma.skill.upsert({
      where: { categoryId_name: { categoryId, name: skill.name } },
      update: {},
      create: { name: skill.name, categoryId },
    });
    skillIdByMockId.set(skill.id, created.id);
  }

  console.log("Seeding CV templates...");

  const cvTemplateIdByMockId = new Map<string, string>();
  for (const template of cvTemplates) {
    const created = await prisma.cVTemplate.upsert({
      where: { name_variant: { name: template.name, variant: template.variant } },
      update: {},
      create: { name: template.name, variant: template.variant },
    });
    cvTemplateIdByMockId.set(template.id, created.id);
  }

  // ============================================
  // Demo user
  // ============================================
  console.log("Seeding demo user...");

  const passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, DEMO_USER_BCRYPT_ROUNDS);
  const demoUser = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {
      name: "Demo User",
      isPro: false,
      role: mockUser.role,
      location: mockUser.location,
      phone: mockUser.phone,
      links: mockUser.links,
    },
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
      role: mockUser.role,
      location: mockUser.location,
      phone: mockUser.phone,
      links: mockUser.links,
    },
  });

  // ============================================
  // Skill Bank
  // ============================================
  console.log("Seeding Skill Bank entries...");

  for (const bankEntry of skillBankEntries) {
    const skillId = skillIdByMockId.get(bankEntry.skillId);
    if (!skillId) throw new Error(`Unknown skill for Skill Bank entry "${bankEntry.id}"`);
    await prisma.skillBankEntry.upsert({
      where: { userId_skillId: { userId: demoUser.id, skillId } },
      update: {
        proficiencyLevel: bankEntry.proficiencyLevel,
        yearsOfExperience: bankEntry.yearsOfExperience,
        lastUsedAt: new Date(bankEntry.lastUsedAt),
        tags: bankEntry.tags ?? [],
      },
      create: {
        id: bankEntry.id,
        userId: demoUser.id,
        skillId,
        proficiencyLevel: bankEntry.proficiencyLevel,
        yearsOfExperience: bankEntry.yearsOfExperience,
        lastUsedAt: new Date(bankEntry.lastUsedAt),
        tags: bankEntry.tags ?? [],
      },
    });
  }

  // ============================================
  // Career history: Experience, Project, Certification
  // ============================================
  console.log("Seeding career history...");

  for (const exp of experiences) {
    const linkedSkillIds = exp.linkedSkillIds.map((mockId) => {
      const id = skillIdByMockId.get(mockId);
      if (!id) throw new Error(`Unknown linked skill "${mockId}" for experience "${exp.id}"`);
      return id;
    });
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {
        company: exp.company,
        title: exp.title,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        bullets: exp.bullets,
        userId: demoUser.id,
        linkedSkills: { set: linkedSkillIds.map((id) => ({ id })) },
      },
      create: {
        id: exp.id,
        company: exp.company,
        title: exp.title,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate ? new Date(exp.endDate) : null,
        bullets: exp.bullets,
        userId: demoUser.id,
        linkedSkills: { connect: linkedSkillIds.map((id) => ({ id })) },
      },
    });
  }

  for (const project of projects) {
    const linkedSkillIds = project.linkedSkillIds.map((mockId) => {
      const id = skillIdByMockId.get(mockId);
      if (!id) throw new Error(`Unknown linked skill "${mockId}" for project "${project.id}"`);
      return id;
    });
    await prisma.project.upsert({
      where: { id: project.id },
      update: {
        title: project.title,
        description: project.description,
        bullets: project.bullets,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        userId: demoUser.id,
        experienceId: project.experienceId,
        linkedSkills: { set: linkedSkillIds.map((id) => ({ id })) },
      },
      create: {
        id: project.id,
        title: project.title,
        description: project.description,
        bullets: project.bullets,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        userId: demoUser.id,
        experienceId: project.experienceId,
        linkedSkills: { connect: linkedSkillIds.map((id) => ({ id })) },
      },
    });
  }

  for (const cert of certifications) {
    const linkedSkillIds = cert.linkedSkillIds.map((mockId) => {
      const id = skillIdByMockId.get(mockId);
      if (!id) throw new Error(`Unknown linked skill "${mockId}" for certification "${cert.id}"`);
      return id;
    });
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: {
        name: cert.name,
        issuer: cert.issuer,
        issueDate: new Date(cert.issueDate),
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
        credentialUrl: cert.credentialUrl,
        userId: demoUser.id,
        linkedSkills: { set: linkedSkillIds.map((id) => ({ id })) },
      },
      create: {
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        issueDate: new Date(cert.issueDate),
        expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
        credentialUrl: cert.credentialUrl,
        userId: demoUser.id,
        linkedSkills: { connect: linkedSkillIds.map((id) => ({ id })) },
      },
    });
  }

  // ============================================
  // Job posts
  // ============================================
  console.log("Seeding job posts...");

  for (const post of jobPosts) {
    await prisma.jobPost.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        company: post.company,
        content: post.content,
        seniority: post.seniority,
        location: post.location,
        employmentType: post.employmentType,
        salaryRange: post.salaryRange,
        userId: demoUser.id,
      },
      create: {
        id: post.id,
        title: post.title,
        company: post.company,
        content: post.content,
        seniority: post.seniority,
        location: post.location,
        employmentType: post.employmentType,
        salaryRange: post.salaryRange,
        userId: demoUser.id,
      },
    });
  }

  // All 9 mock requirements are attached to job-acme only — the other 5 job posts
  // intentionally get zero requirement rows, preserving the "couldn't detect
  // requirements" empty state as a reachable condition (see seed-spec.md).
  for (const req of jobPostRequirements) {
    const skillId = skillIdByMockId.get(req.skillId);
    if (!skillId) throw new Error(`Unknown skill for job post requirement "${req.id}"`);
    await prisma.jobPostRequirement.upsert({
      where: { jobPostId_skillId: { jobPostId: req.jobPostId, skillId } },
      update: { requiredLevel: req.requiredLevel, mustHave: req.mustHave, weight: req.weight },
      create: {
        id: req.id,
        jobPostId: req.jobPostId,
        skillId,
        requiredLevel: req.requiredLevel,
        mustHave: req.mustHave,
        weight: req.weight,
      },
    });
  }

  for (const unresolved of unresolvedRequirements) {
    await prisma.unresolvedRequirement.upsert({
      where: { id: unresolved.id },
      update: { phrase: unresolved.phrase, jobPostId: unresolved.jobPostId },
      create: { id: unresolved.id, phrase: unresolved.phrase, jobPostId: unresolved.jobPostId },
    });
  }

  // ============================================
  // Comparisons
  // ============================================
  // `gaps` is recomputed fresh (currentLevel/severity/skillName) against whichever
  // SkillBankEntry rows actually got seeded above, rather than copied verbatim from
  // the mock's frozen JSON. Each gap's required skill/level still comes from the mock
  // comparison itself rather than solely from JobPostRequirement rows, since only
  // job-acme has real requirement rows seeded (see above) — this keeps every seeded
  // comparison's gap list meaningful without needing every job post to have
  // structured requirements.
  console.log("Seeding comparisons...");

  const skillNameByMockId = new Map(skills.map((s) => [s.id, s.name]));
  const proficiencyByMockSkillId = new Map(skillBankEntries.map((e) => [e.skillId, e.proficiencyLevel]));

  for (const comparison of comparisons) {
    const gaps = comparison.gaps.map((gap) => {
      const currentLevel = proficiencyByMockSkillId.get(gap.skillId) ?? null;
      return {
        skillId: skillIdByMockId.get(gap.skillId) ?? gap.skillId,
        skillName: skillNameByMockId.get(gap.skillId) ?? gap.skillName,
        requiredLevel: gap.requiredLevel,
        currentLevel,
        severity: computeSeverity(gap.requiredLevel, currentLevel),
      };
    });

    await prisma.comparison.upsert({
      where: { id: comparison.id },
      update: {
        fitScore: comparison.fitScore,
        gaps: toJsonInput(gaps),
        advice: comparison.advice,
        userId: demoUser.id,
        jobPostId: comparison.jobPostId,
      },
      create: {
        id: comparison.id,
        fitScore: comparison.fitScore,
        gaps: toJsonInput(gaps),
        advice: comparison.advice,
        userId: demoUser.id,
        jobPostId: comparison.jobPostId,
      },
    });
  }

  // ============================================
  // CVs
  // ============================================
  console.log("Seeding CVs...");

  for (const cv of cvs) {
    const templateId = cvTemplateIdByMockId.get(cv.templateId);
    if (!templateId) throw new Error(`Unknown CV template for CV "${cv.id}"`);
    await prisma.cV.upsert({
      where: { id: cv.id },
      update: {
        title: cv.title,
        draftContent: toJsonInput(cv.draftContent),
        latestVersionId: cv.latestVersionId,
        staleFields: cv.staleFields ?? [],
        userId: demoUser.id,
        templateId,
        jobPostId: cv.jobPostId,
      },
      create: {
        id: cv.id,
        title: cv.title,
        draftContent: toJsonInput(cv.draftContent),
        latestVersionId: cv.latestVersionId,
        staleFields: cv.staleFields ?? [],
        userId: demoUser.id,
        templateId,
        jobPostId: cv.jobPostId,
      },
    });
  }

  // renderedFileUrl is never seeded non-null — it's populated lazily on first export
  // only (see architecture-notes.md), so no seeded version should fake one.
  for (const version of cvVersions) {
    const contentHash = crypto.createHash("sha256").update(JSON.stringify(version.content)).digest("hex");
    await prisma.cVVersion.upsert({
      where: { id: version.id },
      update: {
        versionNumber: version.versionNumber,
        content: toJsonInput(version.content),
        contentHash,
        renderedFileUrl: null,
        note: version.note,
        cvId: version.cvId,
        createdAt: new Date(version.createdAt),
      },
      create: {
        id: version.id,
        versionNumber: version.versionNumber,
        content: toJsonInput(version.content),
        contentHash,
        renderedFileUrl: null,
        note: version.note,
        cvId: version.cvId,
        createdAt: new Date(version.createdAt),
      },
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
