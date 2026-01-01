import React from "react";
import { Link } from "react-router-dom";

const QuickActionCard = ({ title, description, icon, iconBg, to, onClick }) => {
  const cardClasses =
    "flex items-center gap-4 px-5 py-4 bg-bg-tertiary rounded-xl border border-border transition-all text-text-secondary hover:border-accent-blue hover:translate-x-1 hover:text-text-primary";

  const content = (
    <>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="m-0 mb-1 text-sm text-text-primary">{title}</h3>
        <p className="m-0 text-xs">{description}</p>
      </div>
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cardClasses}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className={`${cardClasses} cursor-pointer`}>
        {content}
      </div>
    );
  }

  return <div className={cardClasses}>{content}</div>;
};

export default QuickActionCard;

