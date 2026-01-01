import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminNavItems } from "../constants/constant";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <aside className="w-[260px] bg-bg-secondary border-r border-border flex flex-col sticky top-[57px] h-[calc(100vh-57px)]">
        <div className="p-6 border-b border-border flex items-center gap-3.5 bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(59,130,246,0.1)]">
          <div className="w-11 h-11 rounded-xl gradient-purple flex items-center justify-center text-white">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[0.95rem]">Admin Panel</span>
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <span className="block text-xs uppercase tracking-widest text-text-muted mb-3 pl-3">
            Management
          </span>
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary transition-all mb-1 text-sm ${
                location.pathname === item.path
                  ? "bg-[rgba(59,130,246,0.15)] text-accent-blue"
                  : "hover:bg-bg-hover hover:text-text-primary"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-accent-green">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            <span>System Active</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-y-auto bg-bg-primary">{children}</div>
    </div>
  );
};

export default AdminLayout;
