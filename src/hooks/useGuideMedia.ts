import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GuideMediaItem {
  id: string;
  guide_profile_id: string;
  user_id: string;
  file_path: string;
  file_type: "photo" | "video";
  title: string | null;
  description: string | null;
  display_order: number;
  is_cover_image: boolean;
  created_at: string;
  updated_at: string;
}

export function useGuideMedia(guideProfileId: string | undefined) {
  const [media, setMedia] = useState<GuideMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMedia = useCallback(async () => {
    if (!guideProfileId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("guide_media")
        .select("*")
        .eq("guide_profile_id", guideProfileId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setMedia((data || []) as GuideMediaItem[]);
    } catch (err: any) {
      toast({ title: "Error loading media", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [guideProfileId, toast]);

  const uploadMedia = async (file: File, fileType: "photo" | "video") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !guideProfileId) return { error: "Not authenticated" };

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    try {
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("guide-media")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("guide-media")
        .getPublicUrl(fileName);

      // Create media record
      const { data: mediaData, error: insertError } = await supabase
        .from("guide_media")
        .insert({
          guide_profile_id: guideProfileId,
          user_id: user.id,
          file_path: urlData.publicUrl,
          file_type: fileType,
          display_order: media.length,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setMedia([...media, mediaData as GuideMediaItem]);
      toast({ title: `${fileType === "photo" ? "Photo" : "Video"} uploaded successfully` });
      return { error: null, data: mediaData };
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const deleteMedia = async (mediaId: string, filePath: string) => {
    try {
      // Extract file name from URL for deletion
      const fileName = filePath.split("/guide-media/")[1];
      if (fileName) {
        await supabase.storage.from("guide-media").remove([fileName]);
      }

      const { error } = await supabase
        .from("guide_media")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;

      setMedia(media.filter(m => m.id !== mediaId));
      toast({ title: "Media deleted" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  const updateMediaOrder = async (orderedMedia: GuideMediaItem[]) => {
    try {
      const updates = orderedMedia.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("guide_media")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }

      setMedia(orderedMedia);
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const setCoverImage = async (mediaId: string) => {
    try {
      // Unset all cover images first
      await supabase
        .from("guide_media")
        .update({ is_cover_image: false })
        .eq("guide_profile_id", guideProfileId);

      // Set new cover image
      await supabase
        .from("guide_media")
        .update({ is_cover_image: true })
        .eq("id", mediaId);

      setMedia(media.map(m => ({ ...m, is_cover_image: m.id === mediaId })));
      toast({ title: "Cover image updated" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { media, loading, uploadMedia, deleteMedia, updateMediaOrder, setCoverImage, refetch: fetchMedia };
}
