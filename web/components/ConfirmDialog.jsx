"use client";

export function ConfirmDialog({ open, title, description, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-sm border border-rule bg-paper p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <h2 id="confirm-title" className="font-display text-lg text-ink">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-ink-soft">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-sm px-3 py-1.5 text-sm text-ink-soft hover:bg-paper-dim"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-sm bg-rust px-3 py-1.5 text-sm font-medium text-paper hover:bg-rust/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
