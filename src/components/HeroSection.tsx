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
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 25, ease: "easeOut" }}
          src={heroImage}
          alt="Alaska wilderness"
          className="w-full h-full object-cover"
        />
        {/* Layered gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-2xl">
          {/* Beta Banner */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <BetaBanner variant="hero" />
          </motion.div>

          {/* Main Headline - Clear value proposition */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight mb-6"
          >
            Find Your Perfect Alaska Guide
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-lg leading-relaxed"
          >
            Verified wilderness professionals for hunting, fishing, eco-tours, and bush flights across Alaska.
          </motion.p>

          {/* Key differentiator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center gap-3 mb-10 text-sm text-muted-foreground"
          >
            <div className="w-8 h-px bg-accent" />
            <span>Book with only <span className="text-accent font-semibold">20% down</span> — half the industry standard</span>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mb-8"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                type="text"
                placeholder="What adventure are you planning?"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-card/70 backdrop-blur-xl border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
              />
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="hero" size="lg" className="w-full sm:w-auto group">
                Search
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {["Hunting", "Fishing", "Eco-Tours", "Bush Flights", "Adventure"].map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.06 }}
                whileHover={{ y: -2, borderColor: "hsl(38 92% 50% / 0.5)" }}
                className="px-4 py-2 rounded-full bg-card/40 border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <TrustBadges />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
