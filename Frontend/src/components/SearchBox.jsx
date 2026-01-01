import React from "react";

const SearchBox = ({ value, onChange, placeholder = "Search...", onRefresh, className = "" }) => {
  return (
    <div className={`flex gap-4 mb-6 flex-wrap ${className}`}>
      <div className="flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2.5 bg-bg-card border border-border rounded-lg text-text-muted">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent border-none text-text-primary text-sm focus:outline-none placeholder:text-text-muted"
        />
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="bg-bg-tertiary text-text-primary border border-border rounded-lg py-2.5 px-5 cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 hover:bg-bg-hover hover:border-border-light"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      )}
    </div>
  );
};

export default SearchBox;

