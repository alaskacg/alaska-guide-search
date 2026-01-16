import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "lucide-react";
import MediaUploader from "@/components/guide-dashboard/MediaUploader";
import { useGuideMedia } from "@/hooks/useGuideMedia";
import { GuideProfile } from "@/hooks/useGuideProfile";

interface DashboardContext {
  profile: GuideProfile | null;
}

export default function Media() {
  const { profile } = useOutletContext<DashboardContext>();
  const { 
    media, 
    loading, 
    uploadMedia, 
    deleteMedia, 
    setCoverImage, 
    updateMediaOrder 
  } = useGuideMedia(profile?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground mb-2 flex items-center gap-2">
          <Image className="h-6 w-6 text-accent" />
          Photos & Videos
        </h1>
        <p className="text-muted-foreground">
          Showcase your adventures with high-quality photos and videos. These will appear on your public profile.
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-accent/5 border border-accent/20 rounded-xl p-6"
      >
        <h3 className="font-medium text-foreground mb-2">Tips for great media:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use high-resolution images (at least 1200x800 pixels)</li>
          <li>Show diverse activities and locations you guide</li>
          <li>Include action shots of adventures in progress</li>
          <li>Videos should be under 2 minutes for best engagement</li>
          <li>Set your best photo as the cover image</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-muted-foreground">Loading media...</p>
          </div>
        ) : (
          <MediaUploader
            media={media}
            onUpload={uploadMedia}
            onDelete={deleteMedia}
            onSetCover={setCoverImage}
            onReorder={updateMediaOrder}
          />
        )}
      </motion.div>
    </div>
  );
}
