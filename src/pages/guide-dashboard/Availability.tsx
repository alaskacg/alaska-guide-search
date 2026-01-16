import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import AvailabilityCalendar from "@/components/guide-dashboard/AvailabilityCalendar";
import { useGuideAvailability } from "@/hooks/useGuideAvailability";
import { GuideProfile } from "@/hooks/useGuideProfile";

interface DashboardContext {
  profile: GuideProfile | null;
}

export default function Availability() {
  const { profile } = useOutletContext<DashboardContext>();
  const { 
    recurringPatterns, 
    blockedDates, 
    loading,
    setRecurringPattern,
    removeRecurringPattern,
    blockDateRange,
    unblockDateRange,
  } = useGuideAvailability(profile?.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground mb-2 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-accent" />
          Availability Calendar
        </h1>
        <p className="text-muted-foreground">
          Set your weekly schedule and block off dates when you're unavailable. 
          This helps adventurers see when you can take bookings.
        </p>
      </motion.div>

      {/* Beta Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-accent/5 border border-accent/20 rounded-xl p-6"
      >
        <h3 className="font-medium text-foreground mb-2">Beta Period</h3>
        <p className="text-sm text-muted-foreground">
          During beta, you can set up your availability calendar. Once we launch, 
          adventurers will be able to request bookings based on your available times.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-muted-foreground">Loading availability...</p>
          </div>
        ) : (
          <AvailabilityCalendar
            recurringPatterns={recurringPatterns}
            blockedDates={blockedDates}
            onSetRecurring={setRecurringPattern}
            onRemoveRecurring={removeRecurringPattern}
            onBlockDates={blockDateRange}
            onUnblockDates={unblockDateRange}
          />
        )}
      </motion.div>
    </div>
  );
}
