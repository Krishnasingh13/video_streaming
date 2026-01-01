import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import type { User, ApiError } from "../types/api";

export const useAdminUsers = () => {
  const { token, API_BASE } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Failed to load users");
        setLoading(false);
        return;
      }

      setUsers(data.users || data || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};

