import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { ApiError } from "../types/api";

export const useAdminUserRoleUpdate = () => {
  const { token, API_BASE } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>("");

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Failed to update user role");
        throw new Error((data as ApiError).message || "Failed to update user role");
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while updating user role.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return { updateUserRole, updating, error };
};

