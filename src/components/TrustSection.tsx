import { Button } from "@/components/ui/button";
import { Shield, Percent, Clock, CheckCircle, ArrowRight } from "lucide-react";

const TrustSection = () => {
  const features = [
    {
      icon: Percent,
      title: "50% Lower Deposits",
      description: "Pay only 20-25% upfront vs. the industry standard 40-50%. Keep more money in your pocket until trip time.",
      highlight: "Save $200-400",
    },
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Your funds are held securely until trip completion. Both adventurers and guides are fully protected.",
      highlight: "100% Secure",
    },
    {
      icon: Clock,
      title: "90-Day Free Cancellation",
      description: "Plans change. Cancel up to 90 days before your trip for a full refund — no questions asked.",
      highlight: "Risk-Free",
    },
  ];

  const stats = [
    { value: "4,200+", label: "Adventures Booked" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "429", label: "Verified Guides" },
    { value: "$2.1M", label: "Escrow Protected" },
  ];

  return (
    <section id="trust" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Built on Trust
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Why Adventurers Choose Us
          </h2>
          <p className="text-lg text-primary-foreground/80">
            We've disrupted the outdated booking model. Lower deposits, better protection, 
            and total peace of mind for your Alaska adventure.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge */}
              <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-6">
                {feature.highlight}
              </span>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 mb-6">
                <feature.icon className="h-7 w-7 text-accent" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-slide-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl" className="group">
            Start Your Adventure
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/60 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Travel insurance partners available at checkout
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
