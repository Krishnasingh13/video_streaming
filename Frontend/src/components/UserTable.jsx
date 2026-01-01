import React from "react";
import Select from "./Select";
import Button from "./Button";

const UserTable = ({
  users,
  editingUser,
  setEditingUser,
  onUpdateRole,
  updating,
  canEditRole,
  getRoleBadge,
  formatDate,
}) => {
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              User
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Role
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Joined
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-bg-hover">
              <td className="px-5 py-4 text-sm border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg gradient-blue flex items-center justify-center font-semibold text-sm text-white shrink-0">
                    {(user.name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name || "Unnamed"}</span>
                    <span className="text-xs text-text-muted">{user.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 text-sm border-b border-border">
                {editingUser?._id === user._id ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      options={[
                        { value: "VIEWER", label: "VIEWER" },
                        { value: "EDITOR", label: "EDITOR" },
                      ]}
                      disabled={updating}
                      className="px-3 py-1.5 text-sm font-medium"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => onUpdateRole(user._id, editingUser.role)}
                        className="p-2 bg-transparent border border-[rgba(16,185,129,0.2)] rounded-md text-accent-green cursor-pointer transition-all hover:bg-[rgba(16,185,129,0.2)] disabled:opacity-50"
                        disabled={updating}
                        title="Save"
                      >
                        {updating ? (
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24">
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
                        ) : (
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="p-2 bg-transparent border border-[rgba(156,163,175,0.2)] rounded-md text-text-secondary cursor-pointer transition-all hover:bg-[rgba(156,163,175,0.2)] hover:text-text-primary disabled:opacity-50"
                        disabled={updating}
                        title="Cancel"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <span className={getRoleBadge(user.role)}>{user.role}</span>
                    {canEditRole(user) && (
                      <button
                        onClick={() => setEditingUser({ ...user })}
                        className="bg-transparent border-none text-text-muted cursor-pointer p-1 rounded transition-all flex items-center opacity-0 group-hover:opacity-100 hover:bg-bg-hover hover:text-accent-blue"
                        title="Edit role"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                    {!canEditRole(user) && (
                      <span
                        className="text-text-muted opacity-50 flex items-center"
                        title="Cannot edit ADMIN roles"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </td>
              <td className="px-5 py-4 text-sm border-b border-border text-text-secondary text-xs">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-5 py-4 text-sm border-b border-border">
                <button
                  className="p-2 bg-transparent border border-border rounded-md text-text-secondary cursor-pointer transition-all hover:bg-bg-hover hover:text-text-primary"
                  title="View details"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

