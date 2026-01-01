import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardNavItems } from '../constants/constant';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <aside className="w-[260px] bg-bg-secondary border-r border-border flex flex-col sticky top-[57px] h-[calc(100vh-57px)]">
        <div className="p-6 border-b border-border flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl gradient-blue flex items-center justify-center font-semibold text-lg text-white">
            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[0.95rem]">{user?.name || 'User'}</span>
            <span className="text-xs text-text-muted uppercase tracking-wider">{user?.role || 'Member'}</span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <span className="block text-xs uppercase tracking-widest text-text-muted mb-3 pl-3">Main Menu</span>
          {dashboardNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-text-secondary transition-all mb-1 text-sm ${
                location.pathname === item.path 
                  ? 'bg-[rgba(59,130,246,0.15)] text-accent-blue' 
                  : 'hover:bg-bg-hover hover:text-text-primary'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg text-sm text-text-secondary">
            <span className="flex items-center">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <span>Quick Upload</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-8 overflow-y-auto bg-bg-primary">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
