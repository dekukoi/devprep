import Link from "next/link";
import { FileUser } from "lucide-react";
import { EmptyState } from "@/components/shared";
import { CvListRow, type CvRowData } from "./CvListRow";

interface MyCvsSectionProps {
  cvs: CvRowData[];
  onDuplicate: (id: string) => void;
  onRename: (id: string) => void;
  onChangeTemplate: (id: string) => void;
  onExportPdf: (id: string) => void;
  onViewVersions: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MyCvsSection({ cvs, onDuplicate, onRename, onChangeTemplate, onExportPdf, onViewVersions, onDelete }: MyCvsSectionProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-text-primary">My CVs</h2>
        <Link href="/cvs" className="text-[13px] font-medium text-accent hover:underline">
          View all
        </Link>
      </div>

      {cvs.length === 0 ? (
        <EmptyState
          icon={FileUser}
          heading="No CVs yet"
          body="Generate a tailored CV from your Skill Bank to get started."
        />
      ) : (
        <div className="w-full divide-y divide-border-subtle rounded-[var(--radius-md)] border border-border-subtle bg-bg-surface">
          {cvs.map((cv) => (
            <CvListRow
              key={cv.id}
              {...cv}
              onDuplicate={() => onDuplicate(cv.id)}
              onRename={() => onRename(cv.id)}
              onChangeTemplate={() => onChangeTemplate(cv.id)}
              onExportPdf={() => onExportPdf(cv.id)}
              onViewVersions={() => onViewVersions(cv.id)}
              onDelete={() => onDelete(cv.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
