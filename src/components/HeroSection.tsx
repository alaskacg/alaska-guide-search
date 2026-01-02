import { Button } from "@/components/ui/button";
import TrustBadges from "./TrustBadges";
import BetaBanner from "./BetaBanner";
import heroImage from "@/assets/hero-alaska.jpg";
import { ChevronDown, Search, Compass } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src={heroImage}
          alt="Majestic Alaska wilderness with mountains and eagle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/70 via-transparent to-secondary/30" />
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 1080) + 10,
              opacity: 0 
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Beta Banner */}
          <BetaBanner variant="hero" />

          {/* Headline - Smaller, Display Font */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight"
          >
            <motion.span
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block"
            >
              Don't Become a Statistic
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="block text-gradient-gold text-2xl md:text-3xl lg:text-4xl mt-2"
            >
              Explore Alaska Safely
            </motion.span>
          </motion.h1>

          {/* Subheadline - Safety Focus */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed"
          >
            Alaska's breathtaking beauty lies beyond the beaten path — but so do its dangers. 
            An experienced, verified guide isn't a luxury; it's <strong className="text-accent">essential</strong> for your safety and success.
          </motion.p>

          {/* Low Deposit Value Prop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="glass rounded-xl p-4 mb-8 max-w-xl mx-auto border border-accent/20"
          >
            <p className="text-sm text-muted-foreground">
              <span className="text-accent font-semibold">Industry standard: 50% deposit.</span>{" "}
              Our rigorous vetting protects both parties, so we require only{" "}
              <span className="text-accent font-bold">20-25% down</span> — saving you money while providing peace of mind.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="What adventure are you looking for?"
                className="w-full pl-12 pr-4 py-4 rounded-xl glass border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                <Compass className="h-5 w-5 mr-2" />
                Find Your Guide
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {["Hunting", "Fishing", "Eco-Tours", "Bush Flights", "Adventure"].map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.1, backgroundColor: "hsl(42 85% 50%)" }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full glass text-sm font-medium text-foreground hover:text-accent-foreground transition-all"
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <TrustBadges />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a 
            href="#categories" 
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-medium">Explore</span>
            <ChevronDown className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;