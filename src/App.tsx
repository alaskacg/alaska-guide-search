import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FishingPage from "./pages/categories/FishingPage";
import HuntingPage from "./pages/categories/HuntingPage";
import EcoToursPage from "./pages/categories/EcoToursPage";
import FlightsPage from "./pages/categories/FlightsPage";
import Auth from "./pages/Auth";
import GuideRegistration from "./pages/GuideRegistration";
import GuideDashboard from "./pages/GuideDashboard";
import Overview from "./pages/guide-dashboard/Overview";
import Profile from "./pages/guide-dashboard/Profile";
import Media from "./pages/guide-dashboard/Media";
import Availability from "./pages/guide-dashboard/Availability";
import Listings from "./pages/guide-dashboard/Listings";
import Settings from "./pages/guide-dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fishing" element={<FishingPage />} />
          <Route path="/hunting" element={<HuntingPage />} />
          <Route path="/eco-tours" element={<EcoToursPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/guide-registration" element={<GuideRegistration />} />
          <Route path="/guide-dashboard" element={<GuideDashboard />}>
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="media" element={<Media />} />
            <Route path="availability" element={<Availability />} />
            <Route path="listings" element={<Listings />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;