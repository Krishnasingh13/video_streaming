import React from "react";
import Button from "./Button";

const VideoTable = ({ videos, onDelete, getStatusBadge, formatDate, formatSize }) => {
  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Video
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Uploader
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Status
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Size
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Uploaded
            </th>
            <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted bg-bg-tertiary border-b border-border">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video._id} className="hover:bg-bg-hover">
              <td className="px-5 py-4 text-sm border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-muted shrink-0">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {video.title || video.originalFilename}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm border-b border-border text-text-secondary text-xs">
                {video.uploadUser?.email || video.uploadUser?._id || "—"}
              </td>
              <td className="px-5 py-4 text-sm border-b border-border">
                <span className={getStatusBadge(video.status)}>{video.status}</span>
              </td>
              <td className="px-5 py-4 text-sm border-b border-border text-text-secondary text-xs">
                {formatSize(video.size)}
              </td>
              <td className="px-5 py-4 text-sm border-b border-border text-text-secondary text-xs">
                {formatDate(video.createdAt)}
              </td>
              <td className="px-5 py-4 text-sm border-b border-border">
                <button
                  onClick={() => onDelete(video)}
                  className="p-2 bg-transparent border border-[rgba(239,68,68,0.2)] rounded-md text-accent-red cursor-pointer transition-all hover:bg-[rgba(239,68,68,0.1)] hover:border-accent-red"
                  title="Delete video"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;

