import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  image: string;
  delay?: number;
}

const CategoryCard = ({ icon: Icon, title, description, count, image, delay = 0 }: CategoryCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Icon Badge */}
        <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-card/90 backdrop-blur-sm shadow-soft group-hover:bg-gradient-trust transition-colors duration-300">
          <Icon className="h-6 w-6 text-secondary group-hover:text-primary-foreground transition-colors" />
        </div>

        {/* Count Badge */}
        <div className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-soft">
          {count}+ Guides
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        
        {/* Hover CTA */}
        <div className="mt-4 flex items-center gap-2 text-secondary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Explore guides</span>
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
