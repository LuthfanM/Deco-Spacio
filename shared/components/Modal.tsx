import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  icon?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  role?: "dialog" | "alertdialog";
  titleId?: string;
  panelClassName?: string;
  headerClassName?: string;
  closeButtonClassName?: string;
};

export default function Modal({
  open,
  title,
  children,
  actions,
  description,
  eyebrow,
  icon,
  onClose,
  closeLabel = "Close modal",
  role = "dialog",
  titleId = "modal-title",
  panelClassName = "border-slate-200",
  headerClassName = "border-slate-100 bg-white",
  closeButtonClassName = "border-slate-200 text-slate-700 hover:bg-slate-50",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full max-w-md overflow-hidden rounded-2xl border bg-white shadow-xl ${panelClassName}`}
      >
        <div
          className={`flex items-start justify-between gap-4 border-b p-5 ${headerClassName}`}
        >
          <div className="flex items-start gap-3">
            {icon}
            <div>
              <h2 id={titleId} className="text-sm font-bold text-slate-900">
                {title}
              </h2>
              {eyebrow}
              {description}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg border p-2 ${closeButtonClassName}`}
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {children}
          {actions && <div className="flex justify-end">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
