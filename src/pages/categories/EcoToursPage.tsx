import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TreePine, Camera, Mountain, Binoculars, Snowflake } from "lucide-react";
import { CategoryHero, GuideCard, FilterBar, SafetyBanner, CategoryInfo, ecoTourSafetyWarnings } from "@/components/guides";
import { AuroraBackground, ParticleField, NoiseTexture } from "@/components/backgrounds";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import guideJake from "@/assets/guide-jake.jpg";
import guideMike from "@/assets/guide-mike.jpg";
import guideSarah from "@/assets/guide-sarah.jpg";

const EcoToursPage = () => {
  const stats = [
    { label: "Expert Naturalists", value: "124+" },
    { label: "Tour Types", value: "20+" },
    { label: "Wildlife Success", value: "98%" },
    { label: "Perfect Safety Record", value: "100%" },
  ];

  const guides = [
    {
      id: "eco-1",
      name: "Dr. Emily Walsh",
      image: guideSarah,
      rating: 5.0,
      reviews: 234,
      location: "Denali Region",
      specialties: ["Wildlife Biology", "Bear Viewing", "Photography"],
      experience: 15,
      priceRange: "$350/day",
      availability: "Available",
    },
    {
      id: "eco-2",
      name: "Marcus Green",
      image: guideMike,
      rating: 4.9,
      reviews: 178,
      location: "Glacier Bay",
      specialties: ["Glacier Tours", "Whale Watching", "Kayaking"],
      experience: 12,
      priceRange: "$425/day",
      availability: "This Week",
    },
    {
      id: "eco-3",
      name: "Jennifer Liu",
      image: guideSarah,
      rating: 4.8,
      reviews: 156,
      location: "Katmai National Park",
      specialties: ["Brown Bear", "Salmon Runs", "Photography"],
      experience: 10,
      priceRange: "$750/day",
      availability: "Limited",
    },
    {
      id: "eco-4",
      name: "David Nakamura",
      image: guideJake,
      rating: 4.9,
      reviews: 289,
      location: "Fairbanks",
      specialties: ["Northern Lights", "Dog Sledding", "Winter Tours"],
      experience: 18,
      priceRange: "$300/night",
      availability: "Winter Season",
    },
    {
      id: "eco-5",
      name: "Amanda Ross",
      image: guideSarah,
      rating: 5.0,
      reviews: 145,
      location: "Kenai Fjords",
      specialties: ["Marine Wildlife", "Glaciers", "Sea Kayaking"],
      experience: 14,
      priceRange: "$400/day",
      availability: "Available",
    },
    {
      id: "eco-6",
      name: "Robert Kimura",
      image: guideMike,
      rating: 4.7,
      reviews: 198,
      location: "Arctic Circle",
      specialties: ["Arctic Wildlife", "Indigenous Culture", "Expeditions"],
      experience: 20,
      priceRange: "$550/day",
      availability: "Summer Only",
    },
  ];

  const locations = ["Denali Region", "Glacier Bay", "Katmai National Park", "Fairbanks", "Kenai Fjords", "Arctic Circle", "Prince William Sound"];

  const infoSections = [
    {
      title: "Wildlife Experiences",
      icon: Binoculars,
      items: [
        "Brown bear viewing at salmon streams",
        "Whale watching (humpback, orca, gray)",
        "Bald eagle and seabird colonies",
        "Moose, caribou, and Dall sheep",
        "Marine life: sea otters, seals, sea lions",
        "Arctic wildlife: polar bears, musk ox",
      ],
    },
    {
      title: "Glacier Adventures",
      icon: Mountain,
      items: [
        "Guided glacier hiking and ice climbing",
        "Kayaking among calving glaciers",
        "Helicopter glacier landings",
        "Ice cave explorations (seasonal)",
        "Multi-day glacier expeditions",
      ],
    },
    {
      title: "Seasonal Highlights",
      icon: Snowflake,
      items: [
        "Summer: Midnight sun, wildlife, fishing",
        "Fall: Aurora borealis, fall colors",
        "Winter: Northern lights, dog sledding",
        "Spring: Whale migrations, bear emergence",
      ],
    },
    {
      title: "Photography Support",
      icon: Camera,
      items: [
        "Guides understand lighting and positioning",
        "Extended time at key wildlife locations",
        "Tripod-friendly viewing platforms",
        "Dawn and dusk excursions available",
        "Photo editing workshops available",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <CategoryHero
        title="Alaska Eco-Tours & Wildlife"
        subtitle="Nature Experiences"
        description="Witness Alaska's incredible wildlife and landscapes with naturalist guides who know exactly where to find the magic. From brown bears fishing for salmon to the dancing northern lights, experience nature at its most spectacular."
        icon={TreePine}
        stats={stats}
        backgroundElement={
          <>
            <AuroraBackground />
            <ParticleField count={40} color="glacier" speed={0.4} />
            <NoiseTexture />
          </>
        }
      />

      <div className="container mx-auto px-4 py-12">
        <SafetyBanner category="Eco-Tour" warnings={ecoTourSafetyWarnings} />

        <CategoryInfo
          title="Planning Your Alaska Wildlife Adventure"
          sections={infoSections}
          alaskaDangerNote="Alaska's wilderness is breathtaking but unforgiving. Brown bears, while magnificent to observe, are powerful predators that require proper distance and behavior protocols. Glaciers contain hidden crevasses that can be fatal without proper training. Even summer temperatures can cause hypothermia when combined with wind and rain. Our naturalist guides are experts in wildlife behavior, terrain navigation, and safety protocols. They know the difference between a bear that's comfortable with your presence and one that's showing stress signals. That knowledge can mean the difference between an amazing photo and a dangerous encounter."
        />

        <FilterBar category="eco-tour" locations={locations} />

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

export default EcoToursPage;
