import { Search, Calendar, Shield, Star } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Find Your Guide",
      description: "Browse AI-verified guides by activity, location, and availability. Read reviews from real adventurers.",
    },
    {
      icon: Calendar,
      step: "02",
      title: "Book with Low Deposit",
      description: "Reserve your spot with just 20-25% down — half the industry standard. Cancel risk-free up to 90 days out.",
    },
    {
      icon: Shield,
      step: "03",
      title: "Secure Escrow Protection",
      description: "Your funds are held safely until trip completion. Both you and your guide are protected.",
    },
    {
      icon: Star,
      step: "04",
      title: "Live Your Adventure",
      description: "Experience Alaska with confidence. Funds release to guide after your incredible trip.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Simple & Secure
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            How AlaskaQuest Works
          </h2>
          <p className="text-lg text-muted-foreground">
            We've reimagined adventure booking to be safer, more affordable, and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-secondary/50 to-transparent" />
              )}

              <div className="relative bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 group-hover:-translate-y-2">
                {/* Step Number */}
                <span className="absolute -top-4 -right-2 text-6xl font-display font-bold text-muted/50">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-trust shadow-soft mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-soft">
            <Shield className="h-5 w-5 text-secondary" />
            <span className="text-foreground font-medium">
              Your deposit is protected by our Secure Escrow Guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
