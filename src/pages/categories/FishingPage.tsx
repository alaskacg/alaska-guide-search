import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Fish, Anchor, Ship, Award } from "lucide-react";
import { CategoryHero, GuideCard, FilterBar, SafetyBanner, CategoryInfo, fishingSafetyWarnings } from "@/components/guides";
import { WavePattern, ParticleField, NoiseTexture } from "@/components/backgrounds";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen } from "lucide-react";

import guideJake from "@/assets/guide-jake.jpg";
import guideMike from "@/assets/guide-mike.jpg";
import guideSarah from "@/assets/guide-sarah.jpg";

const FishingPage = () => {
  const stats = [
    { label: "Verified Guides", value: "152+" },
    { label: "Species Available", value: "15+" },
    { label: "Avg Rating", value: "4.9" },
    { label: "Trips Completed", value: "3,400+" },
  ];

  const guides = [
    {
      id: "fish-1",
      name: "Captain Mike Donovan",
      image: guideMike,
      rating: 4.9,
      reviews: 287,
      location: "Kenai Peninsula",
      specialties: ["King Salmon", "Halibut", "Combat Fishing"],
      experience: 18,
      priceRange: "$450/day",
      availability: "Next Week",
    },
    {
      id: "fish-2",
      name: "Jake Thompson",
      image: guideJake,
      rating: 4.8,
      reviews: 156,
      location: "Bristol Bay",
      specialties: ["Fly Fishing", "Rainbow Trout", "Sockeye"],
      experience: 12,
      priceRange: "$650/day",
      availability: "Available",
    },
    {
      id: "fish-3",
      name: "Sarah Chen",
      image: guideSarah,
      rating: 5.0,
      reviews: 89,
      location: "Kodiak Island",
      specialties: ["Deep Sea", "Halibut", "Lingcod"],
      experience: 8,
      priceRange: "$550/day",
      availability: "This Month",
    },
    {
      id: "fish-4",
      name: "Captain Bill Morrison",
      image: guideMike,
      rating: 4.7,
      reviews: 342,
      location: "Homer",
      specialties: ["Charter Fishing", "Family Trips", "Halibut"],
      experience: 25,
      priceRange: "$400/day",
      availability: "Available",
    },
    {
      id: "fish-5",
      name: "Erik Johanssen",
      image: guideJake,
      rating: 4.9,
      reviews: 178,
      location: "Sitka",
      specialties: ["Salmon", "Rockfish", "Multi-day"],
      experience: 15,
      priceRange: "$750/day",
      availability: "Next Month",
    },
    {
      id: "fish-6",
      name: "Maria Santos",
      image: guideSarah,
      rating: 4.8,
      reviews: 112,
      location: "Juneau",
      specialties: ["Fly Fishing", "Photography", "Eco-tours"],
      experience: 10,
      priceRange: "$500/day",
      availability: "Available",
    },
  ];

  const locations = ["Kenai Peninsula", "Bristol Bay", "Kodiak Island", "Homer", "Sitka", "Juneau", "Ketchikan"];

  const infoSections = [
    {
      title: "Target Species",
      icon: Fish,
      items: [
        "King (Chinook) Salmon - May through July",
        "Sockeye (Red) Salmon - June through August", 
        "Silver (Coho) Salmon - August through September",
        "Halibut - May through September",
        "Rainbow Trout & Steelhead - Year-round",
      ],
    },
    {
      title: "What to Expect",
      icon: BookOpen,
      items: [
        "All fishing licenses and permits included",
        "Quality rods, reels, and tackle provided",
        "Fish cleaning and vacuum packing available",
        "Transportation to fishing locations",
        "Hot meals and beverages on most charters",
      ],
    },
    {
      title: "Recommended Gear",
      icon: Anchor,
      items: [
        "Waterproof boots and rain gear",
        "Layered clothing for changing weather",
        "Polarized sunglasses and sunscreen",
        "Camera for trophy photos",
        "Motion sickness medication if prone",
      ],
    },
    {
      title: "Our Guide Standards",
      icon: Award,
      items: [
        "USCG licensed captains for all charters",
        "Current first aid and CPR certification",
        "Coast Guard inspected vessels",
        "Emergency communication equipment",
        "Local knowledge spanning decades",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <CategoryHero
        title="Alaska Fishing Guides"
        subtitle="World-Class Fishing"
        description="From trophy king salmon to barn-door halibut, Alaska's waters hold legendary fishing opportunities. Our verified guides know exactly where and when to find them."
        icon={Fish}
        stats={stats}
        backgroundElement={
          <>
            <WavePattern color="glacier" layers={4} />
            <ParticleField count={30} color="glacier" speed={0.5} />
            <NoiseTexture />
          </>
        }
      />

      <div className="container mx-auto px-4 py-12">
        {/* Safety Banner */}
        <SafetyBanner category="Fishing" warnings={fishingSafetyWarnings} />

        {/* Category Information */}
        <CategoryInfo
          title="Planning Your Alaska Fishing Adventure"
          sections={infoSections}
          alaskaDangerNote="Alaska's waters are deceptively dangerous. Frigid temperatures mean hypothermia can set in within minutes of water exposure. Remote fishing locations often have no cell service and limited emergency access. Weather can shift from calm to treacherous in moments. Our experienced guides carry satellite communication, emergency flotation devices, and have extensive training in cold-water rescue procedures. They know the waters, the weather patterns, and how to keep you safe while delivering an unforgettable fishing experience."
        />

        {/* Filter Bar */}
        <FilterBar category="fishing" locations={locations} />

        {/* Guide Grid */}
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

        {/* Load More */}
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

export default FishingPage;
