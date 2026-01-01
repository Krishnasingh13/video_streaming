import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../layouts/DashboardLayout";
import VideoPlayerModal from "../components/VideoPlayerModal";
import UpdateVideoModal from "../components/UpdateVideoModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import VideoCard from "../components/VideoCard";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { getSocket, joinVideoRoom, leaveVideoRoom } from "../utils/socket";
import { useVideos, useVideoUpdate, useVideoDelete, useVideoStream } from "../hooks";

const MyVideosPage = () => {
  const { user } = useAuth();
  const { videos, loading, error, refetch } = useVideos();
  const { updateVideo, updating, error: updateError } = useVideoUpdate();
  const { deleteVideo, deleting, error: deleteError } = useVideoDelete();
  const { getVideoStreamUrl, revokeBlobUrl } = useVideoStream();
  
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    description: "",
  });

  const isViewer = user?.role === "VIEWER";

  // Close modals when authorization error occurs
  useEffect(() => {
    if (updateError && updateError.toLowerCase().includes("not authorised")) {
      setEditingVideo(null);
      setUpdateForm({ title: "", description: "" });
    }
  }, [updateError]);

  useEffect(() => {
    if (deleteError && deleteError.toLowerCase().includes("not authorised")) {
      setDeleteConfirm(null);
    }
  }, [deleteError]);

  // Join video rooms for processing videos and listen for updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket || videos.length === 0) return;

    // Join rooms for videos that are still processing
    const processingVideos = videos.filter(
      (v) => v.status === "PROCESSING" || v.status === "UPLOADING"
    );
    processingVideos.forEach((video) => {
      joinVideoRoom(video._id);
    });

    // Listen for processing progress updates
    const handleProgress = (payload) => {
      const video = videos.find((v) => v._id === payload.videoId);
      if (video) {
        if (payload.status === "READY") {
          // Refresh videos list when processing completes
          refetch();
          leaveVideoRoom(payload.videoId);
        }
      }
    };

    socket.on("video-processing-progress", handleProgress);

    return () => {
      socket.off("video-processing-progress", handleProgress);
      // Leave all video rooms on unmount
      processingVideos.forEach((video) => {
        leaveVideoRoom(video._id);
      });
    };
  }, [videos, refetch]);

  const handleVideoClick = async (video) => {
    if (video.status === "READY") {
      const streamUrl = await getVideoStreamUrl(video._id);
      if (streamUrl) {
        setSelectedVideo({ ...video, streamUrl });
      }
    }
  };

  const handleUpdate = (video) => {
    if (isViewer) return; // Prevent edit for viewers
    setEditingVideo(video);
    setUpdateForm({
      title: video.title || "",
      description: video.description || "",
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingVideo || isViewer) return;

    try {
      await updateVideo({
        videoId: editingVideo._id,
        title: updateForm.title,
        description: updateForm.description,
      });
      await refetch();
      setEditingVideo(null);
      setUpdateForm({ title: "", description: "" });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async (videoId) => {
    if (isViewer) return; // Prevent delete for viewers
    
    try {
      await deleteVideo(videoId);
      revokeBlobUrl(videoId);
      await refetch();
      setDeleteConfirm(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      READY: "badge-green",
      PROCESSING: "badge-yellow",
      UPLOADING: "badge-blue",
      FAILED: "badge-red",
    };
    return styles[status] || "badge-gray";
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            My Videos
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            {videos.length} video{videos.length !== 1 ? "s" : ""} in your library
          </p>
        </div>
        {!isViewer && (
          <Link
            to="/upload"
            className="gradient-blue text-white rounded-lg py-2.5 px-5 border-none cursor-pointer text-sm font-medium transition-all inline-flex items-center gap-2 shadow-[0_2px_8px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(59,130,246,0.4)]"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload New
          </Link>
        )}
      </div>

      <ErrorBanner message={error || updateError || deleteError} />

      {loading ? (
        <LoadingState message="Loading your videos..." />
      ) : videos.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          }
          title="No videos yet"
          message="Upload your first video to get started"
          actionLabel={isViewer ? undefined : "Upload Video"}
          actionLink={isViewer ? undefined : "/upload"}
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onVideoClick={handleVideoClick}
              onEdit={handleUpdate}
              onDelete={(video) => setDeleteConfirm(video)}
              getStatusBadge={getStatusBadge}
              formatDate={formatDate}
              formatSize={formatSize}
              isViewer={isViewer}
            />
          ))}
        </div>
      )}

      <UpdateVideoModal
        video={editingVideo}
        formData={updateForm}
        onClose={() => setEditingVideo(null)}
        onSubmit={handleUpdateSubmit}
        onFormChange={setUpdateForm}
      />

      <DeleteConfirmationModal
        item={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm._id)}
        itemType="Video"
      />

      {/* Video Player Modal */}
      {selectedVideo && selectedVideo.streamUrl && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onEdit={(video) => handleUpdate(video)}
          onDelete={(video) => setDeleteConfirm(video)}
          isViewer={isViewer}
        />
      )}
    </DashboardLayout>
  );
};

export default MyVideosPage;
