import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Video, ApiError } from "../types/api";

interface UploadVideoParams {
  file: File;
  title?: string;
  description?: string;
}

export const useVideoUpload = () => {
  const { token, API_BASE } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<Video | null>(null);

  const uploadVideo = async ({ file, title, description }: UploadVideoParams) => {
    setError("");
    setUploading(true);
    setUploadedVideo(null);

    try {
      const formData = new FormData();
      formData.append("video", file);
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

      const response = await fetch(`${API_BASE}/api/videos`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as ApiError).message || `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const video = data.video || data;
      setUploadedVideo(video);
      return video;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong while uploading.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return { uploadVideo, uploading, error, uploadedVideo };
};

