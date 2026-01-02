import { motion } from "framer-motion";
import { Sparkles, Gift, Clock, CheckCircle } from "lucide-react";

interface BetaBannerProps {
  variant?: "hero" | "compact" | "guide";
}

const BetaBanner = ({ variant = "hero" }: BetaBannerProps) => {
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/30 px-3 py-1"
      >
        <Sparkles className="h-3 w-3 text-accent" />
        <span className="text-xs font-medium text-accent">BETA</span>
      </motion.div>
    );
  }

  if (variant === "guide") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 p-6 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
            <Gift className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Beta Launch — Free Guide Listings!
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              We're currently in beta development, which means <strong className="text-accent">free listings</strong> for 
              all email-verified guides! Get your profile established now while we perfect the platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free profile creation & listing</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No subscription fees during beta</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority support & feedback</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Limited time opportunity</span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Important:</strong> After beta, subscription fees will apply. 
                Guides will need to update payment information to maintain their listings. 
                We'll provide ample notice before any fees begin.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Hero variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="inline-flex items-center gap-3 rounded-full glass px-4 py-2 mb-6 border border-accent/30"
    >
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="h-4 w-4 text-accent" />
      </motion.span>
      <span className="text-sm font-medium text-foreground">
        <span className="text-accent font-bold">BETA</span> — Free guide listings for early adopters!
      </span>
    </motion.div>
  );
};

export default BetaBanner;
