# Media Management Components

Professional media management components for the Alaska Guide Search platform.

## Components

### MediaUploader

Drag-and-drop uploader with automatic compression and Supabase Storage integration.

**Features:**
- Drag-and-drop file upload
- Photo & video support
- Automatic client-side image compression
- Real-time upload progress
- Preview thumbnails
- Multiple file support
- File size validation
- Error handling

**Usage:**
```tsx
import { MediaUploader } from '@/components/media';

function MyComponent() {
  const handleUpload = (urls: string[]) => {
    console.log('Uploaded files:', urls);
    // Save URLs to your database
  };

  return (
    <MediaUploader
      onUpload={handleUpload}
      acceptedTypes="both" // 'image' | 'video' | 'both'
      maxSize={10} // MB
      maxFiles={10}
    />
  );
}
```

**Props:**
- `onUpload: (urls: string[]) => void` - Callback when files are uploaded
- `acceptedTypes?: 'image' | 'video' | 'both'` - File types to accept (default: 'both')
- `maxSize?: number` - Max file size in MB (default: 10)
- `maxFiles?: number` - Max number of files (default: 10)
- `className?: string` - Additional CSS classes

### MediaGallery

Beautiful, interactive media gallery with filtering, editing, and reordering.

**Features:**
- Grid layout with responsive design
- Lightbox for full-screen viewing
- Filter by type (photo/video)
- Edit captions and alt text
- Delete media with confirmation
- Drag-and-drop reordering (when editable)
- Lazy loading for performance
- Video thumbnails with play overlay

**Usage:**
```tsx
import { MediaGallery } from '@/components/media';

function GuidePage({ guideId }: { guideId: string }) {
  return (
    <MediaGallery
      guideId={guideId}
      editable={true} // Enable edit/delete/reorder
    />
  );
}
```

**Props:**
- `guideId: string` - ID of the guide to load media for
- `editable?: boolean` - Enable edit/delete/reorder features (default: false)
- `className?: string` - Additional CSS classes

**Database Schema:**
The component expects a `guide_media` table with:
```sql
CREATE TABLE guide_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID NOT NULL REFERENCES guides(id),
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'image' or 'video'
  caption TEXT,
  alt_text TEXT,
  thumbnail_url TEXT, -- For video thumbnails
  order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### VideoPlayer

Custom HTML5 video player with full controls and keyboard shortcuts.

**Features:**
- Custom UI with shadcn/ui styling
- Play/pause, skip forward/back
- Volume control with slider
- Fullscreen support
- Progress bar with seek
- Keyboard shortcuts
- Loading states
- Thumbnail/poster support
- Auto-hide controls

**Usage:**
```tsx
import { VideoPlayer } from '@/components/media';

function VideoSection() {
  return (
    <VideoPlayer
      src="https://example.com/video.mp4"
      thumbnail="https://example.com/thumbnail.jpg"
      autoPlay={false}
      loop={false}
      muted={false}
    />
  );
}
```

**Props:**
- `src: string` - Video URL
- `thumbnail?: string` - Poster/thumbnail image URL
- `autoPlay?: boolean` - Auto-play on load (default: false)
- `loop?: boolean` - Loop playback (default: false)
- `muted?: boolean` - Start muted (default: false)
- `className?: string` - Additional CSS classes

**Keyboard Shortcuts:**
- `Space` or `K` - Play/pause
- `←` - Skip back 10 seconds
- `→` - Skip forward 10 seconds
- `F` - Toggle fullscreen
- `M` - Toggle mute
- `↑` - Increase volume
- `↓` - Decrease volume

## Storage Setup

### Supabase Storage Bucket

Create a storage bucket named `guide-media`:

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('guide-media', 'guide-media', true);

-- Set up storage policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'guide-media');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'guide-media'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'guide-media'
  AND auth.uid() IS NOT NULL
);
```

## Complete Example

```tsx
import { useState } from 'react';
import { MediaUploader, MediaGallery, VideoPlayer } from '@/components/media';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function GuideMediaManager({ guideId }: { guideId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpload = async (urls: string[]) => {
    // Save to database
    for (const url of urls) {
      await supabase.from('guide_media').insert({
        guide_id: guideId,
        url,
        type: url.includes('video') ? 'video' : 'image',
      });
    }
    
    // Refresh gallery
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Tabs defaultValue="gallery">
      <TabsList>
        <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="gallery">
        <MediaGallery key={refreshKey} guideId={guideId} editable />
      </TabsContent>

      <TabsContent value="upload">
        <MediaUploader
          onUpload={handleUpload}
          acceptedTypes="both"
          maxSize={50}
          maxFiles={20}
        />
      </TabsContent>
    </Tabs>
  );
}
```

## Dependencies

Required packages (already installed):
- `react-dropzone` - Drag-and-drop file uploads
- `browser-image-compression` - Client-side image compression
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` - Drag-and-drop reordering
- `@supabase/supabase-js` - Supabase integration
- `lucide-react` - Icons
- shadcn/ui components

## Notes

- Images are automatically compressed to max 1MB and 1920px width
- Videos are uploaded as-is (consider server-side processing for large files)
- Lazy loading is implemented for performance with large galleries
- All components use TypeScript for type safety
- Error handling is built-in for network failures
- Components are fully responsive and accessible
