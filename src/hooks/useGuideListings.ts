import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GuideListing {
  id: string;
  guide_profile_id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: 'fishing' | 'hunting' | 'eco' | 'flights' | 'adventure';
  duration_hours: number | null;
  duration_days: number | null;
  max_group_size: number | null;
  min_group_size: number | null;
  price_per_person: number | null;
  price_per_group: number | null;
  deposit_percentage: number | null;
  difficulty_level: 'easy' | 'moderate' | 'challenging' | 'expert' | null;
  included_items: string[] | null;
  not_included_items: string[] | null;
  what_to_bring: string[] | null;
  meeting_point: string | null;
  meeting_instructions: string | null;
  cancellation_policy: string | null;
  min_age: number | null;
  physical_requirements: string | null;
  license_required: boolean | null;
  license_info: string | null;
  seasonal_availability: string[] | null;
  featured_image_url: string | null;
  gallery_images: string[] | null;
  video_url: string | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  view_count: number | null;
  booking_count: number | null;
  average_rating: number | null;
  total_reviews: number | null;
  created_at: string;
  updated_at: string;
}

export type ListingInsert = {
  guide_profile_id: string;
  user_id: string;
  title: string;
  slug: string;
  category: 'fishing' | 'hunting' | 'eco' | 'flights' | 'adventure';
  description?: string | null;
  short_description?: string | null;
  duration_hours?: number | null;
  duration_days?: number | null;
  max_group_size?: number | null;
  min_group_size?: number | null;
  price_per_person?: number | null;
  price_per_group?: number | null;
  deposit_percentage?: number | null;
  difficulty_level?: 'easy' | 'moderate' | 'challenging' | 'expert' | null;
  included_items?: string[] | null;
  not_included_items?: string[] | null;
  what_to_bring?: string[] | null;
  meeting_point?: string | null;
  meeting_instructions?: string | null;
  cancellation_policy?: string | null;
  min_age?: number | null;
  physical_requirements?: string | null;
  license_required?: boolean | null;
  license_info?: string | null;
  seasonal_availability?: string[] | null;
  featured_image_url?: string | null;
  gallery_images?: string[] | null;
  video_url?: string | null;
  is_active?: boolean | null;
  is_featured?: boolean | null;
};

export function useGuideListings(guideProfileId?: string) {
  const [listings, setListings] = useState<GuideListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!guideProfileId) {
      setLoading(false);
      return;
    }
    fetchListings();
  }, [guideProfileId]);

  const fetchListings = async () => {
    if (!guideProfileId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guide_listings")
        .select("*")
        .eq("guide_profile_id", guideProfileId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data as GuideListing[] || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listing: { title: string; category: string } & Partial<Omit<ListingInsert, 'title' | 'category' | 'guide_profile_id' | 'user_id' | 'slug'>>) => {
    if (!guideProfileId) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate slug from title
      const slug = listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'listing';

      const insertData: ListingInsert = {
        ...listing,
        guide_profile_id: guideProfileId,
        user_id: user.id,
        slug,
        title: listing.title,
        category: listing.category as ListingInsert['category'],
      };

      const { data, error } = await supabase
        .from("guide_listings")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      setListings(prev => [data as GuideListing, ...prev]);
      toast({ title: "Listing created!", description: "Your adventure listing is now live." });
      return data as GuideListing;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const updateListing = async (id: string, updates: Partial<GuideListing>) => {
    try {
      const { data, error } = await supabase
        .from("guide_listings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      setListings(prev => prev.map(l => l.id === id ? data as GuideListing : l));
      toast({ title: "Listing updated!" });
      return data as GuideListing;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return null;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("guide_listings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setListings(prev => prev.filter(l => l.id !== id));
      toast({ title: "Listing deleted" });
      return true;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateListing(id, { is_active: isActive });
  };

  return {
    listings,
    loading,
    error,
    createListing,
    updateListing,
    deleteListing,
    toggleActive,
    refetch: fetchListings,
  };
}