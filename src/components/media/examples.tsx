/**
 * Example: Complete Guide Media Management Page
 * 
 * This demonstrates how to use all three media components together
 * in a real-world scenario for managing guide photos and videos.
 */

import { useState } from 'react';
import { MediaUploader, MediaGallery } from '@/components/media';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GuideMediaPageProps {
  guideId: string;
  guideName: string;
}

export function GuideMediaPage({ guideId, guideName }: GuideMediaPageProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [galleryKey, setGalleryKey] = useState(0);

  /**
   * Handle successful media upload
   * Save URLs to database and refresh gallery
   */
  const handleMediaUpload = async (urls: string[]) => {
    try {
      // Determine media type from URL
      const mediaItems = urls.map((url) => ({
        guide_id: guideId,
        url,
        type: url.toLowerCase().match(/\.(mp4|webm|mov)$/) ? 'video' : 'image',
        order: 0, // Will be updated when user reorders
      }));

      // Insert into database
      const { error } = await supabase
        .from('guide_media')
        .insert(mediaItems);

      if (error) throw error;

      // Show success message
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 5000);

      // Refresh gallery to show new uploads
      setGalleryKey((prev) => prev + 1);

      // Switch to gallery tab to see results
      const galleryTab = document.querySelector('[value="gallery"]') as HTMLButtonElement;
      galleryTab?.click();
    } catch (error) {
      console.error('Error saving media:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Media Management</h1>
        <p className="text-muted-foreground">
          Manage photos and videos for {guideName}
        </p>
      </div>

      {/* Success Alert */}
      {uploadSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Media uploaded successfully! Your files are now in the gallery.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
              <CardDescription>
                View, edit, and organize your photos and videos. Drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaGallery
                key={galleryKey}
                guideId={guideId}
                editable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Media</CardTitle>
              <CardDescription>
                Add photos and videos to showcase your guide service.
                Images will be automatically compressed for optimal performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MediaUploader
                onUpload={handleMediaUpload}
                acceptedTypes="both"
                maxSize={50} // 50MB max
                maxFiles={20}
              />
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Great Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Use high-quality images (minimum 1200px wide)</li>
                <li>Show your guides in action with clients</li>
                <li>Capture the Alaskan scenery and wildlife</li>
                <li>Include equipment and safety gear</li>
                <li>Add videos for a more engaging experience</li>
                <li>Use descriptive captions and alt text for accessibility</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Example: Simple Video Gallery
 * 
 * Display only videos in a grid with custom video players
 */

import { useEffect, useState } from 'react';
import { VideoPlayer, MediaItem } from '@/components/media';

export function VideoGalleryExample({ guideId }: { guideId: string }) {
  const [videos, setVideos] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('guide_media')
        .select('*')
        .eq('guide_id', guideId)
        .eq('type', 'video')
        .order('order');

      if (data) {
        setVideos(data.map((item) => ({
          id: item.id,
          url: item.url,
          type: 'video',
          caption: item.caption,
          thumbnail: item.thumbnail_url,
        })));
      }
    };

    fetchVideos();
  }, [guideId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="space-y-2">
          <VideoPlayer
            src={video.url}
            thumbnail={video.thumbnail}
            className="aspect-video"
          />
          {video.caption && (
            <p className="text-sm text-muted-foreground">{video.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Example: Quick Upload Component
 * 
 * Minimal uploader for quick media additions
 */

export function QuickMediaUpload({ guideId }: { guideId: string }) {
  const handleQuickUpload = async (urls: string[]) => {
    const mediaItems = urls.map((url) => ({
      guide_id: guideId,
      url,
      type: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
    }));

    await supabase.from('guide_media').insert(mediaItems);
  };

  return (
    <div className="max-w-2xl">
      <MediaUploader
        onUpload={handleQuickUpload}
        acceptedTypes="image"
        maxSize={10}
        maxFiles={5}
      />
    </div>
  );
}
