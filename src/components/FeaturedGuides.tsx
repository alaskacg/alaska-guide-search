import { Star, MapPin, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Top-Rated Experts
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            Featured Guides
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet some of Alaska's most experienced and highly-rated adventure guides, 
            all AI-verified and ready to create your perfect trip.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <div
              key={guide.name}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {guide.verified && (
                    <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                      <Shield className="h-3 w-3" />
                      AI Verified
                    </span>
                  )}
                  {guide.featured && (
                    <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
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
                  <span className="text-sm text-muted-foreground">
                    ({guide.reviews} reviews)
                  </span>
                </div>

                {/* Name & Specialty */}
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  {guide.name}
                </h3>
                <p className="text-secondary font-medium mb-2">
                  {guide.specialty}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {guide.location}
                </p>

                {/* Pricing */}
                <div className="flex items-end justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${guide.price}
                      <span className="text-sm font-normal text-muted-foreground">/trip</span>
                    </p>
                    <p className="text-xs text-secondary font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Only ${guide.deposit} deposit
                    </p>
                  </div>
                  <Button variant="trust" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All 429 Guides
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;
