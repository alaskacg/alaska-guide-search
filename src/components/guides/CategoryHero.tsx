import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  stats: { label: string; value: string }[];
  backgroundElement: React.ReactNode;
}

const CategoryHero = ({ 
  title, 
  subtitle, 
  description, 
  icon: Icon, 
  stats,
  backgroundElement 
}: CategoryHeroProps) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      {backgroundElement}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background))_80%)]" />

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-32 pb-16 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30"
        >
          <Icon className="h-10 w-10 text-accent" />
        </motion.div>

        {/* Subtitle */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 block"
        >
          {subtitle}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          {description}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryHero;
