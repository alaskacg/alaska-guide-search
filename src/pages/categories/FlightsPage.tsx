import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plane, Cloud, Mountain, Compass, Shield } from "lucide-react";
import { CategoryHero, GuideCard, FilterBar, SafetyBanner, CategoryInfo, flightSafetyWarnings } from "@/components/guides";
import { GridPattern, GlowOrbs, NoiseTexture, ParticleField } from "@/components/backgrounds";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

import guideJake from "@/assets/guide-jake.jpg";
import guideMike from "@/assets/guide-mike.jpg";
import guideSarah from "@/assets/guide-sarah.jpg";

const FlightsPage = () => {
  const stats = [
    { label: "Certified Pilots", value: "67+" },
    { label: "Flight Hours", value: "500K+" },
    { label: "Perfect Safety", value: "100%" },
    { label: "Destinations", value: "200+" },
  ];

  const guides = [
    {
      id: "fly-1",
      name: "Captain John Sterling",
      image: guideMike,
      rating: 5.0,
      reviews: 312,
      location: "Talkeetna",
      specialties: ["Denali Glacier", "Flightseeing", "Remote Drop-offs"],
      experience: 28,
      priceRange: "$350/person",
      availability: "Weather Dependent",
    },
    {
      id: "fly-2",
      name: "Captain Lisa Martinez",
      image: guideSarah,
      rating: 4.9,
      reviews: 189,
      location: "Juneau",
      specialties: ["Glacier Landings", "Bear Viewing", "Whale Watching"],
      experience: 15,
      priceRange: "$450/person",
      availability: "Available",
    },
    {
      id: "fly-3",
      name: "Captain Doug Hansen",
      image: guideJake,
      rating: 4.8,
      reviews: 267,
      location: "Fairbanks",
      specialties: ["Arctic Flights", "Aurora Flights", "Remote Access"],
      experience: 22,
      priceRange: "$500/person",
      availability: "This Week",
    },
    {
      id: "fly-4",
      name: "Captain Ryan O'Brien",
      image: guideMike,
      rating: 5.0,
      reviews: 156,
      location: "Anchorage",
      specialties: ["Float Planes", "Fishing Access", "Lodge Transfers"],
      experience: 18,
      priceRange: "$400/person",
      availability: "Available",
    },
    {
      id: "fly-5",
      name: "Captain Michelle Kim",
      image: guideSarah,
      rating: 4.9,
      reviews: 134,
      location: "Kodiak",
      specialties: ["Bear Viewing", "Island Hopping", "Remote Beaches"],
      experience: 12,
      priceRange: "$475/person",
      availability: "Limited",
    },
    {
      id: "fly-6",
      name: "Captain James Wolf",
      image: guideJake,
      rating: 4.8,
      reviews: 298,
      location: "Wrangell-St. Elias",
      specialties: ["Backcountry", "Glacier Exploration", "Multi-day"],
      experience: 25,
      priceRange: "$550/person",
      availability: "Booking Now",
    },
  ];

  const locations = ["Talkeetna", "Juneau", "Fairbanks", "Anchorage", "Kodiak", "Wrangell-St. Elias", "Valdez", "Homer"];

  const infoSections = [
    {
      title: "Flight Experiences",
      icon: Cloud,
      items: [
        "Denali flightseeing with glacier landing",
        "Remote fishing and hunting access",
        "Bear viewing flight packages",
        "Aurora borealis night flights",
        "Glacier and icefield exploration",
        "Multi-day wilderness expeditions",
      ],
    },
    {
      title: "Aircraft Types",
      icon: Plane,
      items: [
        "De Havilland Beaver - Classic bush plane",
        "Cessna 185/206 - Versatile performers",
        "Piper Super Cub - Backcountry specialist",
        "Float planes for water access",
        "Ski-equipped for glacier landings",
      ],
    },
    {
      title: "What to Expect",
      icon: BookOpen,
      items: [
        "Comprehensive safety briefing",
        "Headsets for communication and narration",
        "Window seats for all passengers",
        "Flexibility for wildlife sightings",
        "Professional photography opportunities",
      ],
    },
    {
      title: "Safety Standards",
      icon: Shield,
      items: [
        "All pilots exceed FAA minimums",
        "Aircraft maintained to highest standards",
        "Real-time weather monitoring",
        "Satellite tracking on all flights",
        "Emergency survival gear carried",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <CategoryHero
        title="Alaska Bush Flights"
        subtitle="Aviation Adventures"
        description="Access Alaska's most remote and spectacular locations with pilots who've mastered the art of bush flying. From glacier landings to remote wilderness drop-offs, experience Alaska from above and beyond."
        icon={Plane}
        stats={stats}
        backgroundElement={
          <>
            <GridPattern animated />
            <GlowOrbs primaryColor="glacier" secondaryColor="accent" />
            <ParticleField count={25} color="glacier" speed={0.6} />
            <NoiseTexture />
          </>
        }
      />

      <div className="container mx-auto px-4 py-12">
        <SafetyBanner category="Flight" warnings={flightSafetyWarnings} />

        <CategoryInfo
          title="Planning Your Alaska Flight Experience"
          sections={infoSections}
          alaskaDangerNote="Bush flying in Alaska is not like flying anywhere else in the world. Our pilots navigate mountain passes where weather can close in without warning, land on gravel bars that require split-second judgment, and touch down on glaciers where crevasses hide beneath the snow. These are skills that take years—often decades—to master. Every pilot on AlaskaGuide Search has thousands of hours in Alaskan conditions and maintains strict personal minimums that often exceed FAA requirements. They know when to fly and, more importantly, when not to. Your adventure is only worth taking if you return safely to tell the story."
        />

        <FilterBar category="flights" locations={locations} />

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
            Load More Pilots
          </button>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
};

export default FlightsPage;
