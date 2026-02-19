import React, { Suspense } from "react";
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
import GuideProfile from "./pages/GuideProfile";
import GuideBookingPage from "./pages/GuideBookingPage";

// Lazy-loaded pages
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const CancellationPolicy = React.lazy(() => import("./pages/CancellationPolicy"));
const EscrowAgreement = React.lazy(() => import("./pages/EscrowAgreement"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const SafetyResources = React.lazy(() => import("./pages/SafetyResources"));
const HelpCenter = React.lazy(() => import("./pages/HelpCenter"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));

// Guide Dashboard Pages
import Overview from "./pages/guide-dashboard/Overview";
import Profile from "./pages/guide-dashboard/Profile";
import Media from "./pages/guide-dashboard/Media";
import Availability from "./pages/guide-dashboard/Availability";
import Listings from "./pages/guide-dashboard/Listings";
import Settings from "./pages/guide-dashboard/Settings";
import Bookings from "./pages/guide-dashboard/Bookings";
import Services from "./pages/guide-dashboard/Services";
import Reviews from "./pages/guide-dashboard/Reviews";
import Analytics from "./pages/guide-dashboard/Analytics";

// Admin Dashboard
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllBookings from "./pages/admin/AllBookings";
import GuideApproval from "./pages/admin/GuideApproval";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";
import DisputeManagement from "./pages/admin/DisputeManagement";
import PlatformSettings from "./pages/admin/PlatformSettings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/fishing" element={<FishingPage />} />
            <Route path="/hunting" element={<HuntingPage />} />
            <Route path="/eco-tours" element={<EcoToursPage />} />
            <Route path="/flights" element={<FlightsPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Legal & Info Pages */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cancellation-policy" element={<CancellationPolicy />} />
            <Route path="/escrow" element={<EscrowAgreement />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/safety" element={<SafetyResources />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Guide Registration & Booking */}
            <Route path="/guide-registration" element={<GuideRegistration />} />
            <Route path="/guide/:guideId" element={<GuideProfile />} />
            <Route path="/guide/:username" element={<GuideBookingPage />} />
            
            {/* Guide Dashboard */}
            <Route path="/guide-dashboard" element={<GuideDashboard />}>
              <Route index element={<Overview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="services" element={<Services />} />
              <Route path="media" element={<Media />} />
              <Route path="availability" element={<Availability />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="listings" element={<Listings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AllBookings />} />
              <Route path="bookings" element={<AllBookings />} />
              <Route path="guide-approval" element={<GuideApproval />} />
              <Route path="revenue" element={<RevenueAnalytics />} />
              <Route path="disputes" element={<DisputeManagement />} />
              <Route path="settings" element={<PlatformSettings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;