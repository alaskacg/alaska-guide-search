import { Button } from "@/components/ui/button";
import { Shield, Percent, Clock, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const TrustSection = () => {
  const features = [
    {
      icon: Percent,
      title: "Save on Deposits",
      description: "Alaskan outfitters typically require 50% upfront. Our vetting protects both parties, so you pay just 20-25% — keeping hundreds in your pocket.",
      highlight: "Industry: 50% → Us: 25%",
    },
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Your funds are held securely until your trip is complete. No risk of losing money to unverified operators.",
      highlight: "100% Protected",
    },
    {
      icon: Clock,
      title: "90-Day Free Cancellation",
      description: "Alaska weather is unpredictable. Cancel up to 90 days out for a full refund — because plans change.",
      highlight: "Risk-Free Booking",
    },
  ];

  const stats = [
    { value: "4,200+", label: "Adventures Completed Safely" },
    { value: "98%", label: "Return Home Rate" },
    { value: "429", label: "Verified Guides" },
    { value: "$2.1M", label: "Escrow Protected" },
  ];

  return (
    <section id="trust" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" 
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Slide-In Animation */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-4"
          >
            <AlertTriangle className="h-3 w-3" />
            Your Safety, Your Investment
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-2xl md:text-3xl font-bold mb-4"
          >
            A Guide Isn't Optional —{" "}
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-accent"
            >
              It's Essential
            </motion.span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-primary-foreground/80"
          >
            Alaska's wilderness doesn't forgive mistakes. An experienced guide is the difference between 
            the adventure of a lifetime and becoming a cautionary tale. Your money is well spent — and protected.
          </motion.p>
        </div>

        {/* Features Grid with Hover Lift */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors"
            >
              {/* Badge */}
              <motion.span 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-6"
              >
                {feature.highlight}
              </motion.span>

              {/* Icon */}
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 mb-6"
              >
                <feature.icon className="h-7 w-7 text-accent" />
              </motion.div>

              {/* Content */}
              <h3 className="font-display text-lg font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats with Bounce Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-xs text-primary-foreground/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="hero" size="xl" className="group">
              Find Your Guide Today
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          <p className="mt-4 text-xs text-primary-foreground/60 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Travel insurance partners available at checkout
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;