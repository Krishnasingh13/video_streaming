import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import type { Video, ApiError } from "../types/api";

export const useAdminVideos = () => {
  const { token, API_BASE } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchVideos = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Failed to load videos");
        setLoading(false);
        return;
      }

      setVideos(data.data || data || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading videos.");
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, refetch: fetchVideos };
};

