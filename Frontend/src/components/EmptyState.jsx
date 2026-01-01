import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({
  icon,
  title,
  message,
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && <div className="text-text-muted mb-4">{icon}</div>}
      <h3 className="m-0 mb-2 text-text-primary">{title}</h3>
      <p className="m-0 mb-6 text-text-secondary">{message}</p>
      {(actionLink || onAction) && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;

