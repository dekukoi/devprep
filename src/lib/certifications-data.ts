import { certifications, skills } from "@/lib/mock-data";
import type { SkillOptionView } from "@/lib/skill-bank-data";

export type CertificationExpiryStatus = "none" | "active" | "expiring-soon" | "expired";

const EXPIRING_SOON_WINDOW_DAYS = 60;

export interface CertificationView {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  linkedSkillIds: string[];
  linkedSkillNames: string[];
  expiryStatus: CertificationExpiryStatus;
}

export interface CertificationsData {
  certifications: CertificationView[];
  allSkills: SkillOptionView[];
}

export function getCertificationExpiryStatus(
  expiryDate: string | null,
  now: Date = new Date(),
): CertificationExpiryStatus {
  if (!expiryDate) return "none";
  const daysUntil = Math.floor((new Date(expiryDate).getTime() - now.getTime()) / 86_400_000);
  if (daysUntil < 0) return "expired";
  if (daysUntil <= EXPIRING_SOON_WINDOW_DAYS) return "expiring-soon";
  return "active";
}

export function getCertificationsData(): CertificationsData {
  const allSkills: SkillOptionView[] = skills.map((s) => ({ id: s.id, name: s.name, categoryId: s.categoryId }));
  const skillNameById = new Map(skills.map((s) => [s.id, s.name]));

  const certificationViews: CertificationView[] = certifications.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    issueDate: c.issueDate,
    expiryDate: c.expiryDate,
    credentialUrl: c.credentialUrl,
    linkedSkillIds: c.linkedSkillIds,
    linkedSkillNames: c.linkedSkillIds
      .map((id) => skillNameById.get(id))
      .filter((n): n is string => Boolean(n)),
    expiryStatus: getCertificationExpiryStatus(c.expiryDate),
  }));

  return { certifications: certificationViews, allSkills };
}
