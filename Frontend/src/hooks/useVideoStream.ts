import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export const useVideoStream = () => {
  const { token, API_BASE } = useAuth();
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const getVideoStreamUrl = useCallback(
    async (videoId: string): Promise<string | null> => {
      if (blobUrls[videoId]) {
        return blobUrls[videoId];
      }

      setLoading((prev) => ({ ...prev, [videoId]: true }));

      try {
        const res = await fetch(`${API_BASE}/api/videos/${videoId}/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch video stream");
        }

        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        setBlobUrls((prev) => ({ ...prev, [videoId]: blobUrl }));
        return blobUrl;
      } catch (err) {
        console.error("Error fetching video stream:", err);
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [videoId]: false }));
      }
    },
    [token, API_BASE, blobUrls]
  );

  const revokeBlobUrl = useCallback((videoId: string) => {
    if (blobUrls[videoId]) {
      URL.revokeObjectURL(blobUrls[videoId]);
      setBlobUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[videoId];
        return newUrls;
      });
    }
  }, [blobUrls]);

  const revokeAllBlobUrls = useCallback(() => {
    Object.values(blobUrls).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setBlobUrls({});
  }, [blobUrls]);

  return { getVideoStreamUrl, revokeBlobUrl, revokeAllBlobUrls, loading };
};

