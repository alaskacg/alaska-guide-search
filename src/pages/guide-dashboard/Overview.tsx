import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Image, 
  Star, 
  Eye, 
  Clock, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GuideProfile } from "@/hooks/useGuideProfile";

interface DashboardContext {
  profile: GuideProfile | null;
}

export default function Overview() {
  const { profile } = useOutletContext<DashboardContext>();

  const stats = [
    { 
      icon: Eye, 
      label: "Profile Views", 
      value: "Coming Soon",
      description: "Tracking available soon"
    },
    { 
      icon: Calendar, 
      label: "Total Bookings", 
      value: profile?.total_bookings || 0,
      description: "Total bookings received"
    },
    { 
      icon: Star, 
      label: "Average Rating", 
      value: profile?.average_rating ? profile.average_rating.toFixed(1) : "N/A",
      description: `${profile?.total_reviews || 0} reviews`
    },
  ];

  const quickActions = [
    { 
      icon: Image, 
      label: "Add Photos & Videos", 
      path: "/guide-dashboard/media",
      description: "Showcase your adventures"
    },
    { 
      icon: Calendar, 
      label: "Set Availability", 
      path: "/guide-dashboard/availability",
      description: "Manage your schedule"
    },
    { 
      icon: CheckCircle2, 
      label: "Complete Profile", 
      path: "/guide-dashboard/profile",
      description: "Add bio and details"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl text-foreground mb-2">
              Welcome back, {profile?.display_name?.split(" ")[0] || "Guide"}!
            </h1>
            <p className="text-muted-foreground">
              Your listing is {profile?.is_active ? "active" : "inactive"} and visible to adventurers.
            </p>
          </div>
          {profile?.is_verified && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Verified Guide</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 2) }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
            <p className="font-display text-3xl text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display text-xl text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-xl p-6 hover:border-accent/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                    <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-medium text-foreground">{action.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Profile Completion Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-xl text-foreground mb-4">Profile Completion</h2>
        <div className="space-y-3">
          {[
            { label: "Add a profile photo", done: !!profile?.avatar_url },
            { label: "Write your bio", done: !!profile?.bio && profile.bio.length > 50 },
            { label: "Upload adventure photos", done: false }, // Will check media count
            { label: "Set weekly availability", done: false }, // Will check availability
            { label: "Add a tagline", done: !!profile?.tagline },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.done ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
              }`}>
                {item.done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
