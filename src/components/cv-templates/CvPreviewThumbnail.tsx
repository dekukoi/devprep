import { cn } from "@/lib/utils";
import type { CVTemplateName, TemplateVariant } from "@/types/cv";

interface FamilyPalette {
  accent: string;
  nameFont: string;
  nameCentered: boolean;
}

const PALETTE: Record<CVTemplateName, FamilyPalette> = {
  Aurora: { accent: "#4F46E5", nameFont: "font-sans", nameCentered: false },
  Slate: { accent: "#334155", nameFont: "font-serif", nameCentered: true },
  Mono: { accent: "#111827", nameFont: "font-sans", nameCentered: false },
};

function Line({ width = "100%" }: { width?: string }) {
  return <div className="h-1 shrink-0 rounded-[2px] bg-[#E3E6EA]" style={{ width }} />;
}

function SidebarLine({ width = "100%" }: { width?: string }) {
  return <div className="h-1 shrink-0 rounded-[2px] bg-white/35" style={{ width }} />;
}

function Label({ children, color }: { children: string; color: string }) {
  return (
    <span className="text-[6.5px] font-bold tracking-[0.5px]" style={{ color }}>
      {children}
    </span>
  );
}

interface CvPreviewThumbnailProps {
  name: CVTemplateName;
  variant: TemplateVariant;
  className?: string;
}

export function CvPreviewThumbnail({ name, variant, className }: CvPreviewThumbnailProps) {
  const palette = PALETTE[name];

  return (
    <div className={cn("flex h-full w-full overflow-hidden rounded-[3px] bg-white", className)}>
      {variant === "TWO_COLUMN" ? (
        <>
          <div className="flex w-[34%] shrink-0 flex-col gap-2 p-2.5" style={{ backgroundColor: palette.accent }}>
            <div className="size-3.5 shrink-0 rounded-full bg-white/25" />
            <div className="flex flex-col gap-1">
              <Label color="#FFFFFF">CONTACT</Label>
              <SidebarLine />
              <SidebarLine />
              <SidebarLine width="70%" />
            </div>
            <div className="flex flex-col gap-1">
              <Label color="#FFFFFF">SKILLS</Label>
              <SidebarLine />
              <SidebarLine width="80%" />
              <SidebarLine />
            </div>
            <div className="flex flex-col gap-1">
              <Label color="#FFFFFF">LANGUAGES</Label>
              <SidebarLine />
              <SidebarLine width="65%" />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-2.5">
            <span className={cn("text-[9px] font-bold text-[#1F2937]", palette.nameFont)}>Alex Morgan</span>
            <span className="text-[6.5px] font-medium" style={{ color: palette.accent }}>
              Senior Backend Engineer
            </span>
            <div className="h-px w-full bg-[#E5E7EB]" />
            <div className="flex flex-col gap-1">
              <Label color={palette.accent}>EXPERIENCE</Label>
              <Line />
              <Line />
              <Line width="60%" />
            </div>
            <div className="flex flex-col gap-1">
              <Label color={palette.accent}>PROJECTS</Label>
              <Line />
              <Line width="55%" />
            </div>
            <div className="flex flex-col gap-1">
              <Label color={palette.accent}>EDUCATION</Label>
              <Line />
              <Line width="65%" />
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full flex-col gap-2 p-3">
          <div className={cn("flex flex-col gap-0.5", palette.nameCentered && "items-center")}>
            <span className={cn("text-[10px] font-bold text-[#1F2937]", palette.nameFont)}>Alex Morgan</span>
            <span className={cn("text-[6px] text-[#7B828C]", palette.nameCentered && "text-center")}>
              alex.morgan@email.com · San Francisco, CA
            </span>
            {name === "Aurora" && <div className="mt-1 h-[3px] w-8 rounded-[2px]" style={{ backgroundColor: palette.accent }} />}
          </div>
          <div className="h-px w-full bg-[#E5E7EB]" />
          <div className="flex flex-col gap-1">
            <Label color={palette.accent}>EXPERIENCE</Label>
            <Line />
            <Line />
            <Line width="66%" />
            <Line width="56%" />
          </div>
          <div className="flex flex-col gap-1">
            <Label color={palette.accent}>EDUCATION</Label>
            <Line />
            <Line width="50%" />
          </div>
          <div className="flex flex-col gap-1">
            <Label color={palette.accent}>SKILLS</Label>
            <Line />
            <Line width="60%" />
          </div>
        </div>
      )}
    </div>
  );
}
