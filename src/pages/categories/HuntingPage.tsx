import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Crosshair, Compass, Award, Shield } from "lucide-react";
import { CategoryHero, GuideCard, FilterBar, SafetyBanner, CategoryInfo, huntingSafetyWarnings } from "@/components/guides";
import { MountainSilhouette, ParticleField, NoiseTexture, GlowOrbs } from "@/components/backgrounds";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import guideJake from "@/assets/guide-jake.jpg";
import guideMike from "@/assets/guide-mike.jpg";
import guideSarah from "@/assets/guide-sarah.jpg";

const HuntingPage = () => {
  const stats = [
    { label: "Verified Guides", value: "86+" },
    { label: "Success Rate", value: "94%" },
    { label: "Avg Rating", value: "4.8" },
    { label: "Years Experience", value: "15+ avg" },
  ];

  const guides = [
    {
      id: "hunt-1",
      name: "Hank Williams",
      image: guideMike,
      rating: 4.9,
      reviews: 134,
      location: "Alaska Range",
      specialties: ["Dall Sheep", "Moose", "Mountain Goat"],
      experience: 22,
      priceRange: "$8,500/hunt",
      availability: "Fall 2026",
    },
    {
      id: "hunt-2",
      name: "Tom Richardson",
      image: guideJake,
      rating: 4.8,
      reviews: 89,
      location: "Brooks Range",
      specialties: ["Grizzly Bear", "Caribou", "Wolf"],
      experience: 18,
      priceRange: "$12,000/hunt",
      availability: "Booking Now",
    },
    {
      id: "hunt-3",
      name: "Rachel Adams",
      image: guideSarah,
      rating: 5.0,
      reviews: 67,
      location: "Kodiak Island",
      specialties: ["Brown Bear", "Sitka Deer", "Waterfowl"],
      experience: 14,
      priceRange: "$15,000/hunt",
      availability: "Limited",
    },
    {
      id: "hunt-4",
      name: "Steve Anderson",
      image: guideMike,
      rating: 4.7,
      reviews: 201,
      location: "Interior Alaska",
      specialties: ["Moose", "Black Bear", "Caribou"],
      experience: 30,
      priceRange: "$6,500/hunt",
      availability: "Available",
    },
    {
      id: "hunt-5",
      name: "Chris Baker",
      image: guideJake,
      rating: 4.9,
      reviews: 112,
      location: "Wrangell Mountains",
      specialties: ["Dall Sheep", "Grizzly", "Pack-in Hunts"],
      experience: 16,
      priceRange: "$9,800/hunt",
      availability: "Fall Only",
    },
    {
      id: "hunt-6",
      name: "Linda Morrison",
      image: guideSarah,
      rating: 4.8,
      reviews: 78,
      location: "Kenai Peninsula",
      specialties: ["Black Bear", "Moose", "First-timer Friendly"],
      experience: 12,
      priceRange: "$5,500/hunt",
      availability: "Available",
    },
  ];

  const locations = ["Alaska Range", "Brooks Range", "Kodiak Island", "Interior Alaska", "Wrangell Mountains", "Kenai Peninsula", "Arctic Slope"];

  const infoSections = [
    {
      title: "Available Game",
      icon: Crosshair,
      items: [
        "Dall Sheep - August through September",
        "Moose - September through October",
        "Brown/Grizzly Bear - Spring & Fall",
        "Caribou - August through September",
        "Mountain Goat - September through October",
        "Black Bear - April through June",
      ],
    },
    {
      title: "Hunt Styles Offered",
      icon: BookOpen,
      items: [
        "Fly-in base camp with spike camps",
        "Float hunting via raft or jet boat",
        "Horseback pack-in expeditions",
        "Walk-in hunts from road system",
        "Coastal boat-based hunting",
      ],
    },
    {
      title: "What's Included",
      icon: Shield,
      items: [
        "All permits and tag assistance",
        "Transportation to hunting area",
        "Quality tents, sleeping gear, and food",
        "Field processing and trophy care",
        "Emergency satellite communication",
      ],
    },
    {
      title: "Physical Requirements",
      icon: Award,
      items: [
        "Excellent physical conditioning recommended",
        "Ability to hike 5-10 miles daily with pack",
        "Mountain hunts require climbing steep terrain",
        "Weather conditions demand mental toughness",
        "Prior hunting experience preferred but not required",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <CategoryHero
        title="Alaska Hunting Expeditions"
        subtitle="Trophy Game Hunting"
        description="Alaska offers the most challenging and rewarding big game hunting on Earth. From massive brown bears to majestic Dall sheep, pursue your trophy with guides who've spent their lives mastering these wild lands."
        icon={Target}
        stats={stats}
        backgroundElement={
          <>
            <MountainSilhouette />
            <GlowOrbs primaryColor="accent" secondaryColor="forest" />
            <ParticleField count={20} color="accent" speed={0.3} />
            <NoiseTexture />
          </>
        }
      />

      <div className="container mx-auto px-4 py-12">
        <SafetyBanner category="Hunting" warnings={huntingSafetyWarnings} />

        <CategoryInfo
          title="Planning Your Alaska Hunt"
          sections={infoSections}
          alaskaDangerNote="Alaska's hunting grounds are among the most unforgiving on Earth. You'll be miles from the nearest road in terrain that can shift from stable to treacherous without warning. Hypothermia, bear encounters, and disorientation in whiteout conditions claim lives every season. Our master guides know how to read the land, the weather, and the animals. They carry emergency beacons, maintain communication protocols, and have decades of experience keeping hunters safe while achieving remarkable success rates. This is not the place for a DIY adventure—the stakes are simply too high."
        />

        <FilterBar category="hunting" locations={locations} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {guides.map((guide, index) => (
            <GuideCard key={guide.id} {...guide} delay={index * 0.1} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 rounded-full bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all">
            Load More Guides
          </button>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};

export default HuntingPage;
