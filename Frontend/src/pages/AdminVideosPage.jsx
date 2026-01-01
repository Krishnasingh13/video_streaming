import React, { useState, useMemo } from "react";
import AdminLayout from "../layouts/AdminLayout";
import SearchBox from "../components/SearchBox";
import VideoTable from "../components/VideoTable";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useAdminVideos, useAdminVideoDelete } from "../hooks";

const AdminVideosPage = () => {
  const { videos, loading, error, refetch } = useAdminVideos();
  const { deleteVideo, deleting, error: deleteError } = useAdminVideoDelete();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    sensitivity: "",
    search: "",
  });

  const filteredVideos = useMemo(() => {
    const searchLower = filters.search.toLowerCase();
    return videos.filter(
      (video) =>
        !filters.search ||
        video.title?.toLowerCase().includes(searchLower) ||
        video.originalFilename?.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower) ||
        video.uploadUser?.email?.toLowerCase().includes(searchLower)
    );
  }, [videos, filters.search]);

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

  const handleDelete = async (videoId) => {
    try {
      await deleteVideo(videoId);
      await refetch();
      setDeleteConfirm(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[1.75rem] font-bold m-0 mb-1 text-text-primary">
            Video Management
          </h1>
          <p className="m-0 text-text-secondary text-[0.95rem]">
            {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}{" "}
            {filters.search ? "found" : "in the system"}
          </p>
        </div>
      </div>

      <SearchBox
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        placeholder="Search videos..."
        onRefresh={refetch}
      />

      <ErrorBanner message={error || deleteError} />

      {loading ? (
        <LoadingState message="Loading videos..." />
      ) : filteredVideos.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          }
          title={filters.search ? "No videos found" : "No videos yet"}
          message={
            filters.search
              ? "Try adjusting your search"
              : "Try adjusting your filters or wait for users to upload videos"
          }
        />
      ) : (
        <VideoTable
          videos={filteredVideos}
          onDelete={(video) => setDeleteConfirm(video)}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
          formatSize={formatSize}
        />
      )}

      <DeleteConfirmationModal
        item={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm._id)}
        itemType="Video"
      />
    </AdminLayout>
  );
};

export default AdminVideosPage;
