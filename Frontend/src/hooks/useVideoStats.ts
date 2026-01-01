import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import type { VideoStats, Video } from "../types/api";

export const useVideoStats = () => {
  const { token, API_BASE } = useAuth();
  const [stats, setStats] = useState<VideoStats>({
    total: 0,
    ready: 0,
    processing: 0,
    flagged: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const videos = data.data || [];
          setStats({
            total: videos.length,
            ready: videos.filter((v: Video) => v.status === "READY").length,
            processing: videos.filter(
              (v: Video) => v.status === "PROCESSING" || v.status === "UPLOADING"
            ).length,
            flagged: videos.filter((v: Video) => v.sensitivityStatus === "FLAGGED")
              .length,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, [token, API_BASE]);

  return stats;
};

