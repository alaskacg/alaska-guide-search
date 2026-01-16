import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  image: string;
  href: string;
  delay?: number;
}

const CategoryCard = ({ icon: Icon, title, description, count, image, href, delay = 0 }: CategoryCardProps) => {
  return (
    <Link to={href}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        className="group relative overflow-hidden rounded-xl bg-card border border-border/50 cursor-pointer h-full"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Icon Badge */}
          <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm border border-border/50">
            <Icon className="h-5 w-5 text-accent" />
          </div>

          {/* Count Badge */}
          <div className="absolute top-3 right-3 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 px-2.5 py-1 text-xs font-medium text-foreground">
            {count}+
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
          
          {/* Hover CTA */}
          <div className="mt-4 flex items-center gap-1.5 text-accent font-medium text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span>View guides</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
