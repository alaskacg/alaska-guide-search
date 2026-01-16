import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideProfile } from "@/hooks/useGuideProfile";

interface DashboardContext {
  profile: GuideProfile | null;
}

export default function Listings() {
  const { profile } = useOutletContext<DashboardContext>();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground mb-2 flex items-center gap-2">
          <FileText className="h-6 w-6 text-accent" />
          Trip Listings
        </h1>
        <p className="text-muted-foreground">
          Create and manage your guided trip offerings. Adventurers will browse these to find their perfect experience.
        </p>
      </motion.div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl text-foreground mb-3">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Trip listings functionality will be available after the beta period. 
          For now, focus on completing your profile and uploading great photos!
        </p>
        <Button variant="outline" disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Button>
      </motion.div>

      {/* Preview of what's coming */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/30 rounded-xl p-6"
      >
        <h3 className="font-medium text-foreground mb-4">What you'll be able to do:</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-xs">1</span>
            </div>
            <span>Create detailed trip listings with descriptions, pricing, and inclusions</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-xs">2</span>
            </div>
            <span>Set different trip durations (half-day, full-day, multi-day)</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-xs">3</span>
            </div>
            <span>Specify group sizes and equipment provided</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-xs">4</span>
            </div>
            <span>Link availability calendar to specific trip offerings</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
