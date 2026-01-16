import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesUpdate } from "@/integrations/supabase/types";

export type GuideProfile = Tables<"guide_profiles">;
export type GuideProfileUpdate = TablesUpdate<"guide_profiles">;

export function useGuideProfile() {
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: GuideProfileUpdate) => {
    if (!profile) return { error: "No profile found" };

    try {
      const { error: updateError } = await supabase
        .from("guide_profiles")
        .update(updates)
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, ...updates } as GuideProfile);
      toast({ title: "Profile updated successfully" });
      return { error: null };
    } catch (err: any) {
      toast({ title: "Error updating profile", description: err.message, variant: "destructive" });
      return { error: err.message };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}
