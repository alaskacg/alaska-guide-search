import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, FileVideo, Loader2, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  progress: number;
  error?: string;
  uploaded?: boolean;
}

interface MediaUploaderProps {
  onUpload: (urls: string[]) => void;
  acceptedTypes?: 'image' | 'video' | 'both';
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
}

export function MediaUploader({
  onUpload,
  acceptedTypes = 'both',
  maxSize = 10,
  maxFiles = 10,
  className
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const getAcceptConfig = () => {
    if (acceptedTypes === 'image') {
      return { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] };
    }
    if (acceptedTypes === 'video') {
      return { 'video/*': ['.mp4', '.webm', '.mov'] };
    }
    return {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov']
    };
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type as any
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, { type: file.type });
    } catch (err) {
      console.error('Image compression failed:', err);
      return file; // Return original if compression fails
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError('');

    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles: MediaFile[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const type = file.type.startsWith('image') ? 'image' : 'video';
        const preview = URL.createObjectURL(file);

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          return {
            id: Math.random().toString(36),
            file,
            preview,
            type,
            progress: 0,
            error: `File too large (max ${maxSize}MB)`
          };
        }

        // Compress images
        let processedFile = file;
        if (type === 'image') {
          try {
            processedFile = await compressImage(file);
          } catch (err) {
            console.error('Compression error:', err);
          }
        }

        return {
          id: Math.random().toString(36),
          file: processedFile,
          preview,
          type,
          progress: 0
        };
      })
    );

    setFiles((prev) => [...prev, ...newFiles]);
  }, [files.length, maxFiles, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptConfig(),
    maxSize: maxSize * 1024 * 1024,
    disabled: uploading
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0 || files.some((f) => f.error)) {
      setError('Please fix errors before uploading');
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const mediaFile of files) {
        if (mediaFile.uploaded) continue;

        const fileExt = mediaFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        // Update progress
        setFiles((prev) =>
          prev.map((f) =>
            f.id === mediaFile.id ? { ...f, progress: 10 } : f
          )
        );

        const { data, error: uploadError } = await supabase.storage
          .from('guide-media')
          .upload(filePath, mediaFile.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === mediaFile.id
                ? { ...f, error: uploadError.message, progress: 0 }
                : f
            )
          );
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('guide-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);

        // Update as completed
        setFiles((prev) =>
          prev.map((f) =>
            f.id === mediaFile.id
              ? { ...f, progress: 100, uploaded: true }
              : f
          )
        );
      }

      if (uploadedUrls.length > 0) {
        onUpload(uploadedUrls);
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const hasErrors = files.some((f) => f.error);
  const allUploaded = files.length > 0 && files.every((f) => f.uploaded);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          {acceptedTypes === 'image' && 'Images only'}
          {acceptedTypes === 'video' && 'Videos only'}
          {acceptedTypes === 'both' && 'Images and videos'}
          {' • '}Max {maxSize}MB per file {' • '}Up to {maxFiles} files
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group rounded-lg overflow-hidden border bg-card"
              >
                {/* Preview */}
                <div className="aspect-square bg-muted relative">
                  {file.type === 'image' ? (
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileVideo className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}

                  {/* Remove button */}
                  {!uploading && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Uploading overlay */}
                  {uploading && file.progress > 0 && file.progress < 100 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}

                  {/* Success indicator */}
                  {file.uploaded && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          strokeWidth="2"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {file.progress > 0 && file.progress < 100 && (
                  <div className="p-2">
                    <Progress value={file.progress} className="h-1" />
                  </div>
                )}

                {/* Error message */}
                {file.error && (
                  <div className="p-2 bg-destructive/10">
                    <p className="text-xs text-destructive truncate">
                      {file.error}
                    </p>
                  </div>
                )}

                {/* File name */}
                {!file.error && (
                  <div className="p-2">
                    <p className="text-xs truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              Clear All
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={uploading || hasErrors || allUploaded}
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {allUploaded ? 'All Uploaded' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
