import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PanelShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onCancel?: () => void;
  onSave?: () => void;
  cancelLabel?: string;
  saveLabel?: string;
  className?: string;
}

export function PanelShell({
  title,
  subtitle,
  children,
  onCancel,
  onSave,
  cancelLabel = "Cancel",
  saveLabel = "Save",
  className,
}: PanelShellProps) {
  return (
    <div
      className={cn(
        "flex w-[340px] flex-col gap-5 rounded-md border border-border-subtle bg-bg-surface p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
      <div className="flex justify-end gap-2.5">
        <Button variant="secondary" className="border border-border-strong" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button onClick={onSave}>{saveLabel}</Button>
      </div>
    </div>
  );
}
