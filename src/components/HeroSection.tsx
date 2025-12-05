import { Button } from "@/components/ui/button";
import TrustBadges from "./TrustBadges";
import heroImage from "@/assets/hero-alaska.jpg";
import { Play, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Majestic Alaska wilderness with mountains and eagle"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-secondary/30" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-card/20 backdrop-blur-sm px-4 py-2 mb-8 border border-primary-foreground/20 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
            <span className="text-sm font-medium text-primary-foreground">
              Alaska's #1 Adventure Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Your Next Great
            <span className="block text-accent">Alaska Adventure</span>
            Awaits
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Connect with AI-verified guides for hunting, fishing, eco-tours, and bush flights. 
            Book with confidence — only <strong>20-25% deposit</strong>, funds held in secure escrow until your trip.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="xl">
              Find Your Guide
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Play className="h-5 w-5" />
              Watch Stories
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <TrustBadges />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <a href="#categories" className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            <span className="text-xs font-medium">Explore</span>
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
