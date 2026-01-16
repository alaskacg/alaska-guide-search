import { Star, MapPin, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import guideMike from "@/assets/guide-mike.jpg";
import guideSarah from "@/assets/guide-sarah.jpg";
import guideJake from "@/assets/guide-jake.jpg";

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
      image: guideMike,
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
      image: guideSarah,
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
      image: guideJake,
      verified: true,
      featured: false,
    },
  ];

  return (
    <section id="guides" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 block"
          >
            Featured Guides
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Meet Your Experts
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Every guide is verified, background-checked, and experienced in Alaska's terrain.
          </motion.p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group bg-card rounded-xl overflow-hidden border border-border/50"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {guide.verified && (
                    <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border/50">
                      <Shield className="h-3 w-3 text-glacier" />
                      Verified
                    </span>
                  )}
                  {guide.featured && (
                    <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-foreground">{guide.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({guide.reviews} reviews)
                  </span>
                </div>

                {/* Name & Specialty */}
                <h3 className="font-display text-lg text-foreground mb-1">
                  {guide.name}
                </h3>
                <p className="text-accent font-medium text-sm mb-2">
                  {guide.specialty}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3 w-3" />
                  {guide.location}
                </p>

                {/* Pricing */}
                <div className="flex items-end justify-between pt-4 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">From</p>
                    <p className="text-lg font-bold text-foreground">
                      ${guide.price}
                      <span className="text-xs font-normal text-muted-foreground">/trip</span>
                    </p>
                    <p className="text-xs text-glacier font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      ${guide.deposit} deposit
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:border-accent group-hover:text-accent transition-colors">
                    View Profile
                  </Button>
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
          transition={{ delay: 0.4 }}
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
