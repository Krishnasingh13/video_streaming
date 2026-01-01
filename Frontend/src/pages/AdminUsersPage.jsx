import { useState, useMemo } from "react";
import AdminLayout from "../layouts/AdminLayout";
import SearchBox from "../components/SearchBox";
import UserTable from "../components/UserTable";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useAdminUsers, useAdminUserRoleUpdate } from "../hooks";

const AdminUsersPage = () => {
  const { users, loading, error, refetch } = useAdminUsers();
  const {
    updateUserRole,
    updating,
    error: updateError,
  } = useAdminUserRoleUpdate();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await refetch();
      setEditingUser(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const canEditRole = (user) => {
    return user.role === "VIEWER" || user.role === "EDITOR";
  };

  const getRoleBadge = (role) => {
    const styles = {
      ADMIN: "badge-red",
      EDITOR: "badge-blue",
      VIEWER: "badge-gray",
      USER: "badge-blue",
    };
    return styles[role] || "badge-gray";
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            User Management
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <SearchBox
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        onRefresh={refetch}
      />

      <ErrorBanner message={error || updateError} onClose={() => {}} />

      {loading ? (
        <LoadingState message="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={
            <svg
              width="64"
              height="64"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          title={searchTerm ? "No users found" : "No users yet"}
          message={
            searchTerm
              ? "Try adjusting your search"
              : "Users will appear here once they register"
          }
        />
      ) : (
        <UserTable
          users={filteredUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          onUpdateRole={handleUpdateRole}
          updating={updating}
          canEditRole={canEditRole}
          getRoleBadge={getRoleBadge}
          formatDate={formatDate}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsersPage;
