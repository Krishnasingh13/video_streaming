export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface Video {
  _id: string;
  title?: string;
  description?: string;
  originalFilename?: string;
  status: "READY" | "PROCESSING" | "UPLOADING" | "FAILED";
  sensitivityStatus?: string;
  size?: number;
  createdAt?: string;
  uploadUser?: User;
  [key: string]: unknown;
}

export interface VideoStats {
  total: number;
  ready: number;
  processing: number;
  flagged: number;
}

export interface AdminSummary {
  totalUsers?: number;
  totalVideos?: number;
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  [key: string]: unknown;
}

