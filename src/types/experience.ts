export interface Experience {
  id: string;
  userId: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  bullets: string[];
  linkedSkillIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  experienceId: string | null;
  title: string;
  description: string | null;
  bullets: string[];
  startDate: string | null;
  endDate: string | null;
  linkedSkillIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  userId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialUrl: string | null;
  linkedSkillIds: string[];
}
