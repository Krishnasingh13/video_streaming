import React from "react";

const VideoPlayerModal = ({ video, onClose, onEdit, onDelete, isViewer = false }) => {
  if (!video || !video.streamUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-[900px] w-full bg-bg-card rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 border-none rounded-lg text-white cursor-pointer transition-colors hover:bg-black/70"
          onClick={onClose}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <video
          src={video.streamUrl}
          controls
          autoPlay
          className="w-full block h-[60vh] object-cover object-center"
        />
        <div className="px-5 py-5 flex justify-between items-center">
          <div>
            <h3 className="m-0 mb-2 text-lg capitalize font-medium">
              {video.title || video.originalFilename}
            </h3>
            <p className="m-0 text-sm text-text-secondary capitalize mb-4">
              {video.description || "No description"}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                if (!isViewer) {
                  onEdit(video);
                  onClose();
                }
              }}
              disabled={isViewer}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-none text-sm font-medium transition-all bg-[rgba(59,130,246,0.1)] text-accent-blue border border-[rgba(59,130,246,0.2)] ${
                isViewer
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer hover:bg-[rgba(59,130,246,0.2)] hover:border-accent-blue"
              }`}
              title={isViewer ? "Viewers cannot edit videos" : "Edit video"}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              onClick={() => {
                if (!isViewer) {
                  onDelete(video);
                  onClose();
                }
              }}
              disabled={isViewer}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-none text-sm font-medium transition-all bg-[rgba(239,68,68,0.1)] text-accent-red border border-[rgba(239,68,68,0.2)] ${
                isViewer
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer hover:bg-[rgba(239,68,68,0.2)] hover:border-accent-red"
              }`}
              title={isViewer ? "Viewers cannot delete videos" : "Delete video"}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
    </div>
  );
};

export default VideoPlayerModal;
