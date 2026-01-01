import React from "react";

const VideoCard = ({
  video,
  onVideoClick,
  onEdit,
  onDelete,
  getStatusBadge,
  formatDate,
  formatSize,
  isViewer = false,
}) => {
  return (
    <div className="bg-bg-card rounded-xl border border-border overflow-hidden transition-all hover:-translate-y-0.5 hover:border-border-light hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
      <div
        className="relative aspect-video bg-bg-tertiary flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => onVideoClick(video)}
      >
        {video.status === "READY" ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity hover:opacity-100 text-white">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-accent-yellow text-sm">
            <svg
              className="animate-spin"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray="31.4 31.4"
              />
            </svg>
            <span>{video.status}</span>
          </div>
        )}
        <div className="text-text-muted">
          <svg
            width="40"
            height="40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            opacity="0.3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="m-0 mb-2 text-sm capitalize font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {video.title || video.originalFilename}
            </h3>
            <div className="flex gap-4 text-xs text-text-muted mb-3">
              <span>{formatDate(video.createdAt)}</span>
              <span>{formatSize(video.size)}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <span className={getStatusBadge(video.status)}>{video.status}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isViewer) onEdit(video);
            }}
            disabled={isViewer}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-none text-sm font-medium transition-all bg-[rgba(59,130,246,0.1)] text-accent-blue border border-[rgba(59,130,246,0.2)] ${
              isViewer
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-[rgba(59,130,246,0.2)] hover:border-accent-blue"
            }`}
            title={isViewer ? "Viewers cannot edit videos" : "Edit video"}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isViewer) onDelete(video);
            }}
            disabled={isViewer}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-none text-sm font-medium transition-all bg-[rgba(239,68,68,0.1)] text-accent-red border border-[rgba(239,68,68,0.2)] ${
              isViewer
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-[rgba(239,68,68,0.2)] hover:border-accent-red"
            }`}
            title={isViewer ? "Viewers cannot delete videos" : "Delete video"}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

