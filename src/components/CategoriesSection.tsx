import CategoryCard from "./CategoryCard";
import { TreePine, Fish, Target, Plane } from "lucide-react";
import { motion } from "framer-motion";

import ecoImage from "@/assets/category-eco.jpg";
import huntingImage from "@/assets/category-hunting.jpg";
import fishingImage from "@/assets/category-fishing.jpg";
import flightsImage from "@/assets/category-flights.jpg";

const CategoriesSection = () => {
  const categories = [
    {
      icon: TreePine,
      title: "Eco-Tours & Wildlife",
      description: "Bear viewing, glacier hikes, and aurora expeditions with guides who keep you safe.",
      count: 124,
      image: ecoImage,
    },
    {
      icon: Target,
      title: "Hunting Expeditions",
      description: "Guided hunts for moose, caribou, and bear in remote wilderness.",
      count: 86,
      image: huntingImage,
    },
    {
      icon: Fish,
      title: "Fishing Adventures",
      description: "World-class salmon and halibut fishing with experienced captains.",
      count: 152,
      image: fishingImage,
    },
    {
      icon: Plane,
      title: "Bush Flights",
      description: "Certified pilots for glacier landings and remote access.",
      count: 67,
      image: flightsImage,
    },
  ];

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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

        {/* Category Grid */}
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
