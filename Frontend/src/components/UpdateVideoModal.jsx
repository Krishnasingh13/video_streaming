import React from "react";
import Input from "./Input";
import Textarea from "./Textarea";
import Button from "./Button";

const UpdateVideoModal = ({
  video,
  formData,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] p-8"
      onClick={onClose}
    >
      <div
        className="relative max-w-[500px] w-full bg-bg-card rounded-2xl overflow-hidden"
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
        <div className="px-6 py-6 pb-4 border-b border-border">
          <h2 className="m-0 mb-1 text-xl font-semibold">Update Video</h2>
          <p className="m-0 text-sm text-text-secondary">
            {video.title || video.originalFilename}
          </p>
        </div>
        <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-4">
          <Input
            id="update-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              onFormChange({ ...formData, title: e.target.value })
            }
            placeholder="Video title"
            label="Title"
          />
          <Textarea
            id="update-description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              onFormChange({ ...formData, description: e.target.value })
            }
            placeholder="Video description"
            label="Description"
            rows={3}
          />
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Update Video
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVideoModal;
