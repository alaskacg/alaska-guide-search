import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, Video, Star, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideMediaItem } from "@/hooks/useGuideMedia";

interface MediaUploaderProps {
  media: GuideMediaItem[];
  onUpload: (file: File, type: "photo" | "video") => Promise<{ error: string | null }>;
  onDelete: (id: string, filePath: string) => Promise<{ error: string | null }>;
  onSetCover: (id: string) => Promise<{ error: string | null }>;
  onReorder: (media: GuideMediaItem[]) => Promise<{ error: string | null }>;
  loading?: boolean;
}

export default function MediaUploader({
  media,
  onUpload,
  onDelete,
  onSetCover,
  loading,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos = media.filter(m => m.file_type === "photo");
  const videos = media.filter(m => m.file_type === "video");

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      if (!isVideo && !isImage) continue;

      await onUpload(file, isVideo ? "video" : "photo");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              Photos (JPG, PNG, WebP) and Videos (MP4, MOV, WebM) up to 50MB
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Select Files"}
          </Button>
        </div>
      </div>

      {/* Photos Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Image className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg text-foreground">Photos ({photos.length})</h3>
        </div>
        
        {photos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-square rounded-lg overflow-hidden group bg-muted"
                >
                  <img
                    src={item.file_path}
                    alt={item.title || "Guide photo"}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Cover badge */}
                  {item.is_cover_image && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Cover
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSetCover(item.id)}
                      disabled={item.is_cover_image}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Set Cover
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(item.id, item.file_path)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Videos Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg text-foreground">Videos ({videos.length})</h3>
        </div>
        
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No videos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {videos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative aspect-video rounded-lg overflow-hidden group bg-muted"
                >
                  <video
                    src={item.file_path}
                    className="w-full h-full object-cover"
                    controls
                  />
                  
                  {/* Delete button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(item.id, item.file_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
