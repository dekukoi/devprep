import type { CVTemplateName, TemplateFamily, TemplateVariant } from "@/types/cv";

export const FREE_TEMPLATE_ID = "tmpl-aurora-single";

export const TEMPLATE_FAMILY: Record<CVTemplateName, TemplateFamily> = {
  Aurora: "Modern",
  Slate: "Classic",
  Mono: "Minimal",
};

export const TEMPLATE_VARIANT_LABEL: Record<TemplateVariant, string> = {
  SINGLE_COLUMN: "Single Column",
  TWO_COLUMN: "Two Column",
};
