import CategoryCard from "./CategoryCard";
import { TreePine, Fish, Target, Plane, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  const categories = [
    {
      icon: TreePine,
      title: "Eco-Tours & Wildlife",
      description: "Bear viewing, glacier hikes, and aurora expeditions — all with guides who know how to keep you safe in bear country.",
      count: 124,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    },
    {
      icon: Target,
      title: "Hunting Expeditions",
      description: "Expert-guided hunts for moose, caribou, and bear. Remote wilderness demands experienced guides who know the terrain.",
      count: 86,
      image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=600&q=80",
    },
    {
      icon: Fish,
      title: "Fishing Adventures",
      description: "World-class salmon and halibut fishing. Our guides navigate treacherous waters so you don't have to.",
      count: 152,
      image: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=600&q=80",
    },
    {
      icon: Plane,
      title: "Bush Flights & Air Tours",
      description: "Certified bush pilots for glacier landings and remote access — Alaska's only way to reach its most spectacular destinations.",
      count: 67,
      image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80",
    },
  ];

  // Letter animation for title
  const titleText = "Your Gateway to Alaska's Wild";
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.03, duration: 0.4 }
    })
  };

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header with Wave Animation */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-danger uppercase tracking-wider mb-4"
          >
            <AlertTriangle className="h-3 w-3" />
            Essential for Your Safety
          </motion.span>
          
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 overflow-hidden">
            {titleText.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={letterVariants}
                className={char === " " ? "inline" : "inline-block"}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base text-muted-foreground"
          >
            Alaska's raw beauty requires stepping off the beaten path — and off the path is where danger lives. 
            A verified guide isn't optional; it's your lifeline to adventure <em>and</em> home again.
          </motion.p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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