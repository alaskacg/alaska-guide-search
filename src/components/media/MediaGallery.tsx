import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit3, GripVertical, Play, X, ZoomIn, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
  alt?: string;
  thumbnail?: string;
  order?: number;
}

interface MediaGalleryProps {
  guideId: string;
  editable?: boolean;
  className?: string;
}

interface SortableItemProps {
  item: MediaItem;
  editable: boolean;
  onEdit: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  onView: (item: MediaItem) => void;
}

function SortableItem({ item, editable, onEdit, onDelete, onView }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group rounded-lg overflow-hidden border bg-card',
        isDragging && 'opacity-50 z-50'
      )}
    >
      {/* Media Display */}
      <div
        className="aspect-square bg-muted relative cursor-pointer"
        onClick={() => onView(item)}
      >
        {item.type === 'image' ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <img
              src={item.url}
              alt={item.alt || 'Media'}
              className={cn(
                'w-full h-full object-cover transition-opacity',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full relative">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.alt || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={item.url}
                className="w-full h-full object-cover"
                preload="metadata"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="h-12 w-12 text-white" fill="white" />
            </div>
          </div>
        )}

        {/* Hover overlay with zoom icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ZoomIn className="h-8 w-8 text-white" />
        </div>

        {/* Type badge */}
        <Badge
          variant="secondary"
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {item.type}
        </Badge>
      </div>

      {/* Caption */}
      {item.caption && (
        <div className="p-2 border-t">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.caption}
          </p>
        </div>
      )}

      {/* Editable controls */}
      {editable && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function MediaGallery({ guideId, editable = false, className }: MediaGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch media items
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guide_media')
        .select('*')
        .eq('guide_id', guideId)
        .order('order', { ascending: true });

      if (error) throw error;

      const mediaItems: MediaItem[] = (data || []).map((item) => ({
        id: item.id,
        url: item.url,
        type: item.type,
        caption: item.caption,
        alt: item.alt_text,
        thumbnail: item.thumbnail_url,
        order: item.order,
      }));

      setItems(mediaItems);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  }, [guideId]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  // Apply filter
  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.type === filter));
    }
  }, [items, filter]);

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update order in database
    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      for (const update of updates) {
        await supabase
          .from('guide_media')
          .update({ order: update.order })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      fetchMedia(); // Revert on error
    }
  };

  // Handle edit
  const handleEdit = async (caption: string, alt: string) => {
    if (!editItem) return;

    try {
      const { error } = await supabase
        .from('guide_media')
        .update({ caption, alt_text: alt })
        .eq('id', editItem.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, caption, alt } : item
        )
      );
      setEditItem(null);
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // Delete from storage
      const item = items.find((i) => i.id === deleteId);
      if (item) {
        const path = item.url.split('/').pop();
        if (path) {
          await supabase.storage.from('guide-media').remove([`media/${path}`]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('guide_media')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">No media items yet</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        {/* Filter */}
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList>
              <TabsTrigger value="all">
                All ({items.length})
              </TabsTrigger>
              <TabsTrigger value="image">
                Photos ({items.filter((i) => i.type === 'image').length})
              </TabsTrigger>
              <TabsTrigger value="video">
                Videos ({items.filter((i) => i.type === 'video').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Gallery Grid */}
        {editable ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredItems} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    editable={editable}
                    onEdit={setEditItem}
                    onDelete={setDeleteId}
                    onView={setLightboxItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                editable={false}
                onEdit={setEditItem}
                onDelete={setDeleteId}
                onView={setLightboxItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={!!lightboxItem} onOpenChange={() => setLightboxItem(null)}>
        <DialogContent className="max-w-4xl p-0">
          {lightboxItem && (
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10"
                onClick={() => setLightboxItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              {lightboxItem.type === 'image' ? (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.alt || 'Media'}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              ) : (
                <video
                  src={lightboxItem.url}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[85vh]"
                />
              )}
              {lightboxItem.caption && (
                <div className="p-4 border-t">
                  <p className="text-sm">{lightboxItem.caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEdit(
                formData.get('caption') as string,
                formData.get('alt') as string
              );
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                name="caption"
                defaultValue={editItem?.caption}
                placeholder="Add a caption..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                name="alt"
                defaultValue={editItem?.alt}
                placeholder="Describe the image for accessibility..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
