/**
 * Media Management Type Definitions
 */

// Database types
export interface GuideMediaRow {
  id: string;
  guide_id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string | null;
  alt_text?: string | null;
  thumbnail_url?: string | null;
  order: number;
  created_at: string;
  updated_at?: string | null;
}

// Component types
export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  alt?: string;
  thumbnail?: string;
  order?: number;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  error?: string;
  uploaded?: boolean;
}

// Uploader types
export type AcceptedMediaType = 'image' | 'video' | 'both';

export interface MediaUploaderProps {
  onUpload: (urls: string[]) => void;
  acceptedTypes?: AcceptedMediaType;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
}

// Gallery types
export type MediaFilter = 'all' | 'image' | 'video';

export interface MediaGalleryProps {
  guideId: string;
  editable?: boolean;
  className?: string;
  onItemsChange?: (items: MediaItem[]) => void;
}

// Video player types
export interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

export interface VideoPlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFullscreen: () => void;
}

// Storage types
export interface StorageUploadOptions {
  bucket: string;
  path: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface StorageUploadResult {
  url: string;
  path: string;
  error?: string;
}

// Compression types
export interface ImageCompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
}

// Events
export interface MediaUploadEvent {
  files: File[];
  urls: string[];
  timestamp: Date;
}

export interface MediaDeleteEvent {
  id: string;
  url: string;
  timestamp: Date;
}

export interface MediaEditEvent {
  id: string;
  caption?: string;
  alt?: string;
  timestamp: Date;
}

export interface MediaReorderEvent {
  items: MediaItem[];
  timestamp: Date;
}
