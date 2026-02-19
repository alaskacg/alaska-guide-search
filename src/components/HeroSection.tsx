import { Button } from "@/components/ui/button";
import TrustBadges from "./TrustBadges";
import heroImage from "@/assets/hero-alaska.jpg";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AuroraBackground, ParticleField, NoiseTexture } from "./backgrounds";

const HeroSection = () => {
  const categoryLinks = [
    { name: "Hunting", href: "/hunting" },
    { name: "Fishing", href: "/fishing" },
    { name: "Eco-Tours", href: "/eco-tours" },
    { name: "Bush Flights", href: "/flights" },
  ];

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
        {/* Centered radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.8)_70%)]" />
      </div>

      {/* Animated Effects Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <AuroraBackground />
        <ParticleField count={40} color="glacier" speed={0.4} />
        <NoiseTexture />
      </div>

      {/* Centered Content */}
      <div className="relative container mx-auto px-4 pt-28 pb-20 flex flex-col items-center text-center">
        <div className="max-w-3xl">
          {/* Main Headline - Clear value proposition */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6"
          >
            Find Your Perfect Alaska Guide
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed"
          >
            Alaska's #1 Adventure Booking Platform — verified wilderness professionals for hunting, fishing, eco-tours, and bush flights.
          </motion.p>

          {/* Key differentiator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-10 text-sm text-muted-foreground"
          >
            <div className="w-8 h-px bg-accent" />
            <span>Book with only <span className="text-accent font-semibold">25% down</span> — half the industry standard</span>
            <div className="w-8 h-px bg-accent" />
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
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

          {/* Quick Categories - Now with Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categoryLinks.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.06 }}
              >
                <Link to={category.href}>
                  <motion.span
                    whileHover={{ y: -2, borderColor: "hsl(0 72% 50% / 0.5)" }}
                    className="inline-block px-4 py-2 rounded-full bg-card/40 border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {category.name}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex justify-center"
          >
            <TrustBadges />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
