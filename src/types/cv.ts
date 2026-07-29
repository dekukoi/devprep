export type CVTemplateName = "Aurora" | "Slate" | "Mono";
export type TemplateVariant = "SINGLE_COLUMN" | "TWO_COLUMN";
export type TemplateFamily = "Modern" | "Classic" | "Minimal";

export interface CVTemplate {
  id: string;
  name: CVTemplateName;
  variant: TemplateVariant;
}

export interface CVContentExperience {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
}

export interface CVContent {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  links: string[];
  summary: string;
  experience: CVContentExperience[];
  skills: string[];
}

export interface CV {
  id: string;
  userId: string;
  templateId: string;
  jobPostId: string | null;
  title: string;
  draftContent: CVContent;
  latestVersionId: string | null;
  /** Field names in `draftContent` that have diverged from the Skill Bank since the CV was last synced. */
  staleFields?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CVVersion {
  id: string;
  cvId: string;
  versionNumber: number;
  content: CVContent;
  contentHash: string;
  renderedFileUrl: string | null;
  createdAt: string;
}
