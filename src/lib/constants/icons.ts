import {
  BookOpen,
  Boxes,
  Code2,
  Download,
  FileCheck,
  FileText,
  FileUser,
  MessageSquare,
  TrendingUp,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_REGISTRY = {
  "file-text": FileText,
  "file-user": FileUser,
  code: Code2,
  boxes: Boxes,
  wrench: Wrench,
  "message-square": MessageSquare,
  "book-open": BookOpen,
  "trending-up": TrendingUp,
  download: Download,
  "triangle-alert": TriangleAlert,
  "file-check": FileCheck,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_REGISTRY;

export const SKILL_CATEGORY_ICON_NAMES: Record<string, IconName> = {
  Languages: "code",
  Frameworks: "boxes",
  Tools: "wrench",
  "Soft Skills": "message-square",
  "Domain Knowledge": "book-open",
};
