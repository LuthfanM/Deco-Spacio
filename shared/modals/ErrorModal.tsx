import { AlertOctagon } from "lucide-react";
import Modal from "@/shared/components/Modal";

interface ErrorModalProps {
  open: boolean;
  title?: string;
  message: string | null;
  onClose: () => void;
}

export default function ErrorModal({
  open,
  title = "Something went wrong",
  message,
  onClose,
}: ErrorModalProps) {
  if (!open || !message) return null;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      role="alertdialog"
      titleId="error-modal-title"
      closeLabel="Close error modal"
      panelClassName="border-red-200"
      headerClassName="border-red-100 bg-red-50"
      closeButtonClassName="border-red-200 text-red-700 hover:bg-red-100"
      icon={
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-100">
          <AlertOctagon className="h-5 w-5 text-red-600" />
        </div>
      }
      eyebrow={
        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
          Error
        </p>
      }
      actions={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
        >
          Close
        </button>
      }
    >
      <p className="text-sm leading-relaxed text-slate-700">{message}</p>
    </Modal>
  );
}
