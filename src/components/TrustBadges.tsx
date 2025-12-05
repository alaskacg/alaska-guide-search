import { ShieldCheck, Lock, BadgePercent, Heart } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: ShieldCheck, label: "AI-Verified Guides", color: "text-trust-blue" },
  { icon: Lock, label: "Secure Escrow", color: "text-forest" },
  { icon: BadgePercent, label: "Low 20-25% Deposits", color: "text-accent" },
  { icon: Heart, label: "Insurance Partners", color: "text-crimson" },
];

const TrustBadges = () => (
  <div className="flex flex-wrap justify-center gap-4 md:gap-6">
    {badges.map((badge, index) => (
      <motion.div
        key={badge.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-border/50 hover:border-accent/50 transition-all"
      >
        <badge.icon className={`h-4 w-4 ${badge.color}`} />
        <span className="text-xs md:text-sm font-medium text-foreground">{badge.label}</span>
      </motion.div>
    ))}
  </div>
);

export default TrustBadges;