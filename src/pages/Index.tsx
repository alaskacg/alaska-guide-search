import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TrustSection from "@/components/TrustSection";
import FeaturedGuides from "@/components/FeaturedGuides";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <HowItWorksSection />
      <FeaturedGuides />
      <TrustSection />
      <Footer />
    </main>
  );
};

export default Index;
