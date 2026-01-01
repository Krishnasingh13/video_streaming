import React from "react";

const Select = ({
  name,
  value,
  onChange,
  options = [],
  label,
  required = false,
  disabled = false,
  id,
  className = "",
  placeholder,
  ...props
}) => {
  const inputId = id || name;
  const baseClasses =
    "px-4 py-3 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm transition-colors focus:outline-none focus:border-accent-blue disabled:opacity-50 disabled:cursor-not-allowed";

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
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${baseClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => {
            if (typeof option === "string") {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <select
      id={inputId}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => {
        if (typeof option === "string") {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        }
        return (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};

export default Select;

