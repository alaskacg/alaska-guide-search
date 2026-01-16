import { Button } from "@/components/ui/button";
import TrustBadges from "./TrustBadges";
import BetaBanner from "./BetaBanner";
import heroImage from "@/assets/hero-alaska.jpg";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "easeOut" }}
          src={heroImage}
          alt="Majestic Alaska wilderness"
          className="w-full h-full object-cover"
        />
        {/* Refined gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/60" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-subtle" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Beta Banner - Subtle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <BetaBanner variant="hero" />
          </motion.div>

          {/* Main Headline - Editorial Style */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Alaska Demands
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="block text-gradient-gold"
              >
                Respect
              </motion.span>
            </h1>
          </motion.div>

          {/* Subheadline - Clean Typography */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed font-light"
          >
            Find verified wilderness guides. Book with confidence. 
            <span className="text-foreground font-normal"> Pay less upfront</span> than anywhere else.
          </motion.p>

          {/* Value Proposition - Minimal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-px flex-1 max-w-16 bg-border" />
            <p className="text-sm text-muted-foreground">
              <span className="text-accent font-semibold">20-25%</span> deposit vs industry's 50%
            </p>
          </motion.div>

          {/* Search Bar - Premium Glass Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mb-10"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="Hunting, fishing, eco-tours..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                Find Guides
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Categories - Refined Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {["Hunting", "Fishing", "Eco-Tours", "Bush Flights", "Adventure"].map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.08 }}
                whileHover={{ y: -2, backgroundColor: "hsl(var(--accent) / 0.15)" }}
                className="px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300"
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <TrustBadges />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
