import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Save, User, Briefcase, Globe, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GuideProfile, GuideProfileUpdate } from "@/hooks/useGuideProfile";

interface DashboardContext {
  profile: GuideProfile | null;
}

const serviceTypeLabels: Record<string, string> = {
  adventure: "Adventure Guide",
  eco: "Eco-Guide",
  hunting: "Hunting Guide",
  fishing: "Fishing Guide",
  pilot: "Bush Pilot",
};

export default function Profile() {
  const { profile } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || "",
    business_name: profile?.business_name || "",
    website_url: profile?.website_url || "",
    avatar_url: profile?.avatar_url || "",
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("guide-media")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("guide-media")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("guide_profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setFormData({ ...formData, avatar_url: urlData.publicUrl });
      toast({ title: "Profile photo updated" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const updates: GuideProfileUpdate = {
        display_name: formData.display_name,
        tagline: formData.tagline || null,
        bio: formData.bio || null,
        business_name: formData.business_name || null,
        website_url: formData.website_url || null,
      };

      const { error } = await supabase
        .from("guide_profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) throw error;
      toast({ title: "Profile saved successfully" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = formData.display_name
    ? formData.display_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "G";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground mb-2">Edit Profile</h1>
        <p className="text-muted-foreground">
          Customize how you appear to adventurers searching for guides.
        </p>
      </motion.div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5 text-accent" />
          Profile Photo
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="bg-accent/20 text-accent text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Change Photo"}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              JPG, PNG or WebP. Max 5MB.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6 space-y-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Basic Information
        </h2>
        
        <div>
          <Label htmlFor="display_name">Display Name *</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="How you want to be known"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g., 20+ years exploring Alaska's wilderness"
            className="mt-1"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.tagline.length}/100 characters
          </p>
        </div>

        <div>
          <Label htmlFor="bio">About You</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell adventurers about your experience, what makes your trips unique, and why they should book with you..."
            className="mt-1 min-h-[150px]"
            maxLength={2000}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.bio.length}/2000 characters
          </p>
        </div>
      </motion.div>

      {/* Business Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6 space-y-4"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-accent" />
          Business Details
        </h2>
        
        <div>
          <Label htmlFor="business_name">Business Name</Label>
          <Input
            id="business_name"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            placeholder="If operating as a business"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website_url">Website</Label>
          <Input
            id="website_url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            placeholder="https://yourwebsite.com"
            className="mt-1"
          />
        </div>
      </motion.div>

      {/* Service Info (Read-only, from application) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          Service Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Service Types</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.service_types.map((type) => (
                <span 
                  key={type} 
                  className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                >
                  {serviceTypeLabels[type] || type}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Service Areas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile?.service_areas.map((area) => (
                <span 
                  key={area} 
                  className="px-3 py-1 rounded-full bg-muted text-foreground text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Years of Experience</Label>
            <p className="text-foreground mt-1">{profile?.years_of_experience} years</p>
          </div>

          <p className="text-xs text-muted-foreground">
            To update service types or areas, please contact support.
          </p>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <Button onClick={handleSave} disabled={saving} variant="hero" size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </div>
  );
}
