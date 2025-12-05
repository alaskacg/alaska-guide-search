import { Shield, Lock, CheckCircle, Award } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      label: "AI-Verified Guides",
      description: "Every guide vetted",
    },
    {
      icon: Lock,
      label: "Secure Escrow",
      description: "Funds protected",
    },
    {
      icon: CheckCircle,
      label: "Low Deposits",
      description: "Only 20-25% upfront",
    },
    {
      icon: Award,
      label: "Insurance Partners",
      description: "Trip protection available",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {badges.map((badge, index) => (
        <div
          key={badge.label}
          className="flex items-center gap-3 rounded-full bg-card/80 backdrop-blur-sm px-4 py-2.5 shadow-soft border border-border/50 animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-trust">
            <badge.icon className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{badge.label}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
