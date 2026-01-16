import { Button } from "@/components/ui/button";
import { Shield, Percent, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const TrustSection = () => {
  const features = [
    {
      icon: Percent,
      title: "Lower Deposits",
      description: "Pay just 20-25% upfront instead of the industry standard 50%. Our vetting protects both parties.",
      highlight: "Save Hundreds",
    },
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Your funds are held securely until your trip completes. Full protection on every booking.",
      highlight: "100% Secure",
    },
    {
      icon: Clock,
      title: "Flexible Cancellation",
      description: "Cancel up to 90 days out for a full refund. Alaska weather is unpredictable—we get it.",
      highlight: "Risk-Free",
    },
  ];

  const stats = [
    { value: "4,200+", label: "Adventures Completed" },
    { value: "98%", label: "Safe Return Rate" },
    { value: "429", label: "Verified Guides" },
    { value: "$2.1M", label: "Escrow Protected" },
  ];

  return (
    <section id="trust" className="py-24 bg-card relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-glacier rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 block"
          >
            Why Choose Us
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Book with Confidence
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            We protect your investment so you can focus on the adventure.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-background rounded-xl p-7 border border-border/50"
            >
              {/* Badge */}
              <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-5">
                {feature.highlight}
              </span>

              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-5">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>

              {/* Content */}
              <h3 className="font-sans text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.08 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button variant="hero" size="lg" className="group">
            Find Your Guide
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-glacier" />
            Travel insurance available at checkout
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
