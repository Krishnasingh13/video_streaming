import { useState } from "react";
import { useAuth } from "./useAuth";
import type { ApiError } from "../types/api";

export const useVideoDelete = () => {
  const { token, API_BASE } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");

  const deleteVideo = async (videoId: string) => {
    setError("");
    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/api/videos/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Failed to delete video");
        throw new Error((data as ApiError).message || "Failed to delete video");
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while deleting video.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return { deleteVideo, deleting, error };
};

