"use client";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title = "Delete item",
  description = "This action cannot be undone.",
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#101216] border border-white/10 rounded-2xl p-6">
        <h4 className="text-white font-bold text-lg">{title}</h4>
        <p className="text-gray-400 text-sm mt-2">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl bg-white/5 text-gray-200">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-500/80 text-white font-bold">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

