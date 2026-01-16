import { Search, Calendar, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Find Your Guide",
      description: "Browse verified guides by activity and availability.",
    },
    {
      icon: Calendar,
      step: "02",
      title: "Book with 20% Down",
      description: "Reserve with half the industry-standard deposit.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Protected Payment",
      description: "Funds held in escrow until your trip completes.",
    },
    {
      icon: Star,
      step: "04",
      title: "Adventure Safely",
      description: "Expert guidance through Alaska's wilderness.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30 noise-overlay">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 block"
          >
            How It Works
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Simple, Secure Booking
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Our vetting process lets you book with less risk—and less money upfront.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-32px)] h-px bg-border" />
              )}

              <div className="relative text-center">
                {/* Step Number */}
                <span className="text-5xl font-display text-muted/40 mb-3 block">
                  {step.step}
                </span>

                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-card border border-border/50 shadow-soft mb-5 transition-all group-hover:border-accent/50 group-hover:shadow-glow"
                >
                  <step.icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>

                {/* Content */}
                <h3 className="font-sans text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Notice */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 bg-card/50 border border-border/50 rounded-full px-5 py-2.5">
            <Shield className="h-4 w-4 text-glacier" />
            <span className="text-sm text-muted-foreground">
              Escrow protection on every booking
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
