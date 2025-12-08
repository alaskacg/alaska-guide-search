import { Star, MapPin, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FeaturedGuides = () => {
  const guides = [
    {
      name: "Mike Thompson",
      specialty: "Salmon & Halibut Fishing",
      location: "Kenai Peninsula",
      rating: 4.9,
      reviews: 127,
      price: 650,
      deposit: 163,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      verified: true,
      featured: true,
    },
    {
      name: "Sarah Blackwood",
      specialty: "Bear Viewing & Eco-Tours",
      location: "Katmai National Park",
      rating: 5.0,
      reviews: 89,
      price: 895,
      deposit: 224,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      verified: true,
      featured: false,
    },
    {
      name: "Jake Reynolds",
      specialty: "Bush Pilot & Glacier Tours",
      location: "Denali Region",
      rating: 4.8,
      reviews: 156,
      price: 1200,
      deposit: 300,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      verified: true,
      featured: false,
    },
  ];

  return (
    <section id="guides" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header with Scale Animation */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-4"
          >
            <Shield className="h-3 w-3" />
            Vetted & Verified Experts
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
          >
            Your Lifeline to{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-gradient-gold"
            >
              Adventure
            </motion.span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base text-muted-foreground"
          >
            Every guide is AI-verified, background-checked, and experienced in Alaska's unforgiving terrain. 
            They don't just show you the wilderness — they bring you home safely.
          </motion.p>
        </div>

        {/* Guides Grid with Flip Animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.name}
              initial={{ opacity: 0, rotateY: -15, x: -30 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {guide.verified && (
                    <motion.span 
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      <Shield className="h-3 w-3" />
                      Verified
                    </motion.span>
                  )}
                  {guide.featured && (
                    <motion.span 
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      <Star className="h-3 w-3" />
                      Featured
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-bold text-foreground">{guide.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({guide.reviews} safe returns)
                  </span>
                </div>

                {/* Name & Specialty */}
                <h3 className="font-display text-lg font-bold text-foreground mb-1">
                  {guide.name}
                </h3>
                <p className="text-secondary font-medium text-sm mb-2">
                  {guide.specialty}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" />
                  {guide.location}
                </p>

                {/* Pricing */}
                <div className="flex items-end justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-xl font-bold text-foreground">
                      ${guide.price}
                      <span className="text-xs font-normal text-muted-foreground">/trip</span>
                    </p>
                    <p className="text-xs text-secondary font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Only ${guide.deposit} deposit (25%)
                    </p>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="trust" size="sm">
                      View Profile
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            View All 429 Verified Guides
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedGuides;