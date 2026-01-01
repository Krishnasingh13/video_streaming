import React from "react";
import { Link } from "react-router-dom";

const StatCard = ({ label, value, icon, color = "blue", link, onClick }) => {
  const getStatIconBg = (color) => {
    const colors = {
      blue: "bg-[rgba(59,130,246,0.15)] text-accent-blue",
      green: "bg-[rgba(16,185,129,0.15)] text-accent-green",
      yellow: "bg-[rgba(245,158,11,0.15)] text-accent-yellow",
      red: "bg-[rgba(239,68,68,0.15)] text-accent-red",
      purple: "bg-[rgba(139,92,246,0.15)] text-accent-purple",
    };
    return colors[color] || "";
  };

  const cardClasses =
    "bg-bg-card rounded-xl p-5 border border-border flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:border-border-light hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]";

  const content = (
    <>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatIconBg(color)}`}>
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      {(link || onClick) && (
        <div className="text-text-muted">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <Link to={link} className={cardClasses}>
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

export default StatCard;

