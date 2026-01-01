import React from "react";

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-accent-red capitalize">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="bg-transparent border-none text-current cursor-pointer p-1 flex items-center opacity-70 transition-opacity hover:opacity-100"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;

