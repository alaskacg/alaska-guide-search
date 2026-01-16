import { motion } from "framer-motion";
import { Star, MapPin, Shield, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface GuideCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  experience: number;
  priceRange: string;
  isVerified?: boolean;
  availability?: string;
  delay?: number;
}

const GuideCard = ({
  id,
  name,
  image,
  rating,
  reviews,
  location,
  specialties,
  experience,
  priceRange,
  isVerified = true,
  availability = "Available",
  delay = 0,
}: GuideCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative bg-card rounded-xl border border-border/50 overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        
        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium">
            <Shield className="h-3.5 w-3.5 text-glacier" />
            <span className="text-foreground">Verified</span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm border-accent/30 text-accent">
            <Calendar className="h-3 w-3 mr-1" />
            {availability}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews})</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
          <span className="text-border">•</span>
          <span>{experience}+ years</span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="font-semibold text-foreground">{priceRange}</p>
          </div>
          <Button variant="outline" size="sm" asChild className="group/btn">
            <Link to={`/guide/${id}`}>
              View Profile
              <motion.span 
                className="ml-1"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
              >
                →
              </motion.span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default GuideCard;
