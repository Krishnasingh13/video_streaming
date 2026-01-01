import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";
import ErrorBanner from "../components/ErrorBanner";
import { getSocket, joinVideoRoom, leaveVideoRoom } from "../utils/socket";
import { useVideoUpload } from "../hooks";

const VideoUploadPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploadVideo, uploading, error, uploadedVideo } = useVideoUpload();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);

  const isViewer = user?.role === "VIEWER";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      } else {
        // Error will be shown via ErrorBanner from hook
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!file) {
      return;
    }

    if (isViewer) {
      return; // Prevent upload for viewers
    }

    setUploadProgress(0);

    try {
      const video = await uploadVideo({ file, title, description });
      
      // Success - join video room for processing updates
      if (video?._id) {
        setCurrentVideoId(video._id);
        joinVideoRoom(video._id);
      }
      
      setStatus("Upload successful! Your video is now being processed.");
      setFile(null);
      setTitle("");
      setDescription("");
      setUploadProgress(0);
      
      // Navigate to my videos page after successful upload
      setTimeout(() => {
        navigate("/my-videos");
      }, 1500);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Listen for video processing progress
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !currentVideoId) return;

    const handleProgress = (payload) => {
      if (payload.videoId === currentVideoId) {
        if (payload.progress !== undefined) {
          setUploadProgress(payload.progress);
        }
        if (payload.status === "READY") {
          setStatus("Video processing complete! Your video is ready to play.");
          setUploadProgress(100);
          // Leave room after processing is complete
          setTimeout(() => {
            leaveVideoRoom(currentVideoId);
            setCurrentVideoId(null);
          }, 2000);
        }
      }
    };

    socket.on("video-processing-progress", handleProgress);

    return () => {
      socket.off("video-processing-progress", handleProgress);
      if (currentVideoId) {
        leaveVideoRoom(currentVideoId);
      }
    };
  }, [currentVideoId]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isViewer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="text-text-muted mb-4">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="m-0 mb-2 text-text-primary">Access Restricted</h3>
          <p className="m-0 mb-6 text-text-secondary">
            Viewers cannot upload videos. Please contact an administrator to upgrade your account.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            Upload Video
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            Upload a new video for processing and streaming
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        {status && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-6 text-sm bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] text-accent-green w-3/4">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{status}</span>
          </div>
        )}

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="w-3/4 flex flex-col gap-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all bg-bg-card ${
              dragActive
                ? "border-accent-blue bg-[rgba(59,130,246,0.05)]"
                : file
                ? "border-solid border-accent-green bg-[rgba(16,185,129,0.05)]"
                : "border-border hover:border-accent-blue hover:bg-[rgba(59,130,246,0.05)]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-[rgba(16,185,129,0.15)] flex items-center justify-center text-accent-green">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="m-0 text-text-primary font-medium">{file.name}</p>
                <p className="m-0 text-sm text-text-muted">{formatFileSize(file.size)}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[rgba(59,130,246,0.15)] to-[rgba(139,92,246,0.15)] rounded-2xl flex items-center justify-center text-accent-blue">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="m-0 text-text-secondary">
                  <span className="text-accent-blue font-medium">Click to upload</span> or drag and
                  drop
                </p>
                <p className="m-0 text-sm text-text-muted">MP4, MOV, AVI, WebM (max 500MB)</p>
              </div>
            )}
          </div>

          {(uploading || uploadProgress > 0) && (
            <div className="flex flex-col gap-2">
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden relative">
                <div
                  className="h-full gradient-blue rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              {uploadProgress > 0 && (
                <p className="text-xs text-text-muted text-center">
                  {uploadProgress < 100 ? `Processing: ${uploadProgress}%` : "Processing complete!"}
                </p>
              )}
            </div>
          )}

          <Input
            label="Title (optional)"
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title"
          />

          <Textarea
            label="Description (optional)"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            rows={4}
          />

          <Button
            type="submit"
            isLoading={uploading}
            disabled={!file || uploading}
            fullWidth
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default VideoUploadPage;
