import React from "react";

const DeleteConfirmationModal = ({ item, onClose, onConfirm, itemType = "Video" }) => {
  if (!item) return null;

  const itemName = item.title || item.originalFilename || item.name || item.email || "this item";

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-[500px] w-full bg-bg-card rounded-2xl overflow-hidden text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-[rgba(239,68,68,0.1)] rounded-full flex items-center justify-center text-accent-red">
          <svg
            width="48"
            height="48"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="m-0 mb-3 text-2xl font-semibold">Delete {itemType}?</h2>
        <p className="m-0 mb-8 text-text-secondary leading-relaxed">
          Are you sure you want to delete &quot;{itemName}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 bg-bg-tertiary text-text-primary border border-border rounded-lg py-3 px-6 cursor-pointer text-sm font-semibold transition-all hover:bg-bg-hover hover:border-border-light"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 gradient-red text-white border-none rounded-lg py-3 px-6 cursor-pointer text-sm font-semibold transition-all shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]"
            onClick={onConfirm}
          >
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

