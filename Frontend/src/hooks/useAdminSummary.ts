import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import type { AdminSummary } from "../types/api";

export const useAdminSummary = () => {
  const { token, API_BASE } = useAuth();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token, API_BASE]);

  return { summary, loading, error };
};

