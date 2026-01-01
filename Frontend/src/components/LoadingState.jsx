import React from "react";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
      <div className="w-10 h-10 border-3 border-border border-t-accent-blue rounded-full animate-spin"></div>
      <p className="text-text-muted">{message}</p>
    </div>
  );
};

export default LoadingState;

