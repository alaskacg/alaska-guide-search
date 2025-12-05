import CategoryCard from "./CategoryCard";
import { TreePine, Fish, Target, Plane } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      icon: TreePine,
      title: "Eco-Tours & Wildlife",
      description: "Immerse yourself in Alaska's pristine wilderness. Bear viewing, glacier hikes, aurora expeditions, and sustainable nature experiences.",
      count: 124,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    },
    {
      icon: Target,
      title: "Hunting Expeditions",
      description: "Expert-guided hunts for moose, caribou, Dall sheep, and brown bear. Fully outfitted camps with experienced wilderness guides.",
      count: 86,
      image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=600&q=80",
    },
    {
      icon: Fish,
      title: "Fishing Adventures",
      description: "World-class salmon, halibut, and trout fishing. Remote fly-in lodges, charter boats, and guided river expeditions.",
      count: 152,
      image: "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=600&q=80",
    },
    {
      icon: Plane,
      title: "Bush Flights & Air Tours",
      description: "Scenic flightseeing, bush pilot charters, glacier landings, and remote access flights to Alaska's most spectacular destinations.",
      count: 67,
      image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=600&q=80",
    },
  ];

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Choose Your Adventure
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            Explore Alaska's Finest Guides
          </h2>
          <p className="text-lg text-muted-foreground">
            From pristine wilderness eco-tours to thrilling hunting expeditions — 
            find your perfect Alaska experience with verified local experts.
          </p>
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
