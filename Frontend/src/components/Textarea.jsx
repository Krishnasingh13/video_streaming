import React from "react";

const Textarea = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  rows = 3,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || name;
  const baseClasses =
    "px-4 py-3 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm transition-colors focus:outline-none focus:border-accent-blue placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed resize-none";

  if (label) {
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
          {required && <span className="text-accent-red ml-1">*</span>}
        </label>
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${baseClasses} ${className}`}
          {...props}
        />
      </div>
    );
  }

  return (
    <textarea
      id={inputId}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};

export default Textarea;

