import React from "react";

const ProfileCard = ({ user, badge }) => {
  return (
    <div className="bg-bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center">
        <h2 className="m-0 text-base font-semibold">Your Profile</h2>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide bg-[rgba(59,130,246,0.15)] text-accent-blue">
            {badge}
          </span>
        )}
      </div>
      <div className="px-5 py-4">
        <div className="flex justify-between py-3 border-b border-border">
          <span className="text-text-muted text-sm">Email</span>
          <span className="font-medium text-sm">{user?.email || "—"}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-text-muted text-sm">Member Since</span>
          <span className="font-medium text-sm">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

