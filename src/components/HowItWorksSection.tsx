import { Search, Calendar, Shield, Star, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Find Your Guide",
      description: "Browse AI-verified guides by activity, location, and availability. Each guide is thoroughly vetted for your safety.",
    },
    {
      icon: Calendar,
      step: "02",
      title: "Book with Confidence",
      description: "Reserve with just 20-25% down — while others require 50%. Our vetting means lower risk for everyone.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Secure Escrow",
      description: "Funds are held safely until trip completion. You're protected, your guide is protected.",
    },
    {
      icon: Star,
      step: "04",
      title: "Return Home Safe",
      description: "Experience Alaska's wilderness with an expert by your side. Come back with stories, not statistics.",
    },
  ];

  // Staggered card animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header with Typewriter Effect */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-4"
          >
            <TrendingDown className="h-3 w-3" />
            Half the Deposit, Double the Protection
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
          >
            Booking Made{" "}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-gradient-gold"
            >
              Smarter
            </motion.span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-muted-foreground"
          >
            The Alaskan industry standard demands 50% upfront. Our thorough vetting of both guides and clients 
            means we can accept far less — <strong className="text-accent">saving you hundreds</strong> while delivering industry-leading peace of mind.
          </motion.p>
        </div>

        {/* Steps with 3D Card Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }}
                  className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent origin-left" 
                />
              )}

              <div className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-2">
                {/* Step Number */}
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.3, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  className="absolute -top-4 -right-2 text-6xl font-display font-bold text-muted/50"
                >
                  {step.step}
                </motion.span>

                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-trust shadow-soft mb-6 transition-transform"
                >
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-lg font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-soft">
            <Shield className="h-5 w-5 text-secondary" />
            <span className="text-foreground font-medium text-sm">
              Your deposit is protected by Secure Escrow — funds release only after your trip
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;