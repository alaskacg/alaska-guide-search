import CategoryCard from "./CategoryCard";
import { TreePine, Fish, Target, Plane } from "lucide-react";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  const categories = [
    {
      icon: TreePine,
      title: "Eco-Tours & Wildlife",
      description: "Bear viewing, glacier hikes, and aurora expeditions with guides who keep you safe.",
      count: 124,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    },
    {
      icon: Target,
      title: "Hunting Expeditions",
      description: "Guided hunts for moose, caribou, and bear in remote wilderness.",
      count: 86,
      image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=600&q=80",
    },
    {
      icon: Fish,
      title: "Fishing Adventures",
      description: "World-class salmon and halibut fishing with experienced captains.",
      count: 152,
      image: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=600&q=80",
    },
    {
      icon: Plane,
      title: "Bush Flights",
      description: "Certified pilots for glacier landings and remote access.",
      count: 67,
      image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80",
    },
  ];

  return (
    <section id="categories" className="py-24 bg-background noise-overlay">
      <div className="container mx-auto px-4">
        {/* Section Header - Clean & Minimal */}
        <div className="max-w-2xl mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-accent uppercase tracking-widest mb-4 block"
          >
            Categories
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl text-foreground mb-4"
          >
            Your Gateway to Alaska
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Every adventure type covered by verified professionals.
          </motion.p>
        </div>

        {/* Category Grid - Refined Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.title}
              {...category}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
