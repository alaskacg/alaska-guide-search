import { ShieldCheck, Lock, BadgePercent, Heart } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: ShieldCheck, label: "Verified Guides", color: "text-glacier" },
  { icon: Lock, label: "Secure Escrow", color: "text-forest" },
  { icon: BadgePercent, label: "Low Deposits", color: "text-accent" },
  { icon: Heart, label: "Insured", color: "text-crimson" },
];

const TrustBadges = () => (
  <div className="flex flex-wrap gap-4 md:gap-6">
    {badges.map((badge, index) => (
      <motion.div
        key={badge.label}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
        className="flex items-center gap-2 text-muted-foreground"
      >
        <badge.icon className={`h-4 w-4 ${badge.color}`} />
        <span className="text-sm font-medium">{badge.label}</span>
      </motion.div>
    ))}
  </div>
);

export default TrustBadges;
