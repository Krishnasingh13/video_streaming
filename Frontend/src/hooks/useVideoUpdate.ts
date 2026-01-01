import { useState } from "react";
import { useAuth } from "./useAuth";
import type { ApiError } from "../types/api";

interface UpdateVideoParams {
  videoId: string;
  title?: string;
  description?: string;
}

export const useVideoUpdate = () => {
  const { token, API_BASE } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>("");

  const updateVideo = async ({ videoId, title, description }: UpdateVideoParams) => {
    setError("");
    setUpdating(true);

    try {
      const updateData: { title?: string; description?: string } = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;

      const res = await fetch(`${API_BASE}/api/videos/${videoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError((data as ApiError).message || "Failed to update video");
        throw new Error((data as ApiError).message || "Failed to update video");
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while updating video.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return { updateVideo, updating, error };
};

