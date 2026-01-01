import React from "react";

const Button = ({
  type = "button",
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
  fullWidth = false,
  ...props
}) => {
  const baseClasses = "rounded-lg border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variantClasses = {
    primary:
      "gradient-blue text-white py-2.5 px-5 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]",
    secondary:
      "bg-bg-tertiary text-text-primary border border-border py-2.5 px-5 hover:bg-bg-hover hover:border-border-light",
    danger:
      "gradient-red text-white py-3 px-6 shadow-[0_2px_8px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.4)]",
    large:
      "gradient-blue text-white py-3.5 px-8 text-base shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

