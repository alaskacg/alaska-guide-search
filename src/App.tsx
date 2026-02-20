import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
const FishingPage = React.lazy(() => import("./pages/categories/FishingPage"));
const HuntingPage = React.lazy(() => import("./pages/categories/HuntingPage"));
const EcoToursPage = React.lazy(() => import("./pages/categories/EcoToursPage"));
const FlightsPage = React.lazy(() => import("./pages/categories/FlightsPage"));
const Auth = React.lazy(() => import("./pages/Auth"));
const GuideRegistration = React.lazy(() => import("./pages/GuideRegistration"));
const GuideDashboard = React.lazy(() => import("./pages/GuideDashboard"));
const GuideProfile = React.lazy(() => import("./pages/GuideProfile"));
const GuideBookingPage = React.lazy(() => import("./pages/GuideBookingPage"));

const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const CancellationPolicy = React.lazy(() => import("./pages/CancellationPolicy"));
const EscrowAgreement = React.lazy(() => import("./pages/EscrowAgreement"));
const AboutUs = React.lazy(() => import("./pages/AboutUs"));
const SafetyResources = React.lazy(() => import("./pages/SafetyResources"));
const HelpCenter = React.lazy(() => import("./pages/HelpCenter"));
const ContactUs = React.lazy(() => import("./pages/ContactUs"));

const Overview = React.lazy(() => import("./pages/guide-dashboard/Overview"));
const Profile = React.lazy(() => import("./pages/guide-dashboard/Profile"));
const Media = React.lazy(() => import("./pages/guide-dashboard/Media"));
const Availability = React.lazy(() => import("./pages/guide-dashboard/Availability"));
const Listings = React.lazy(() => import("./pages/guide-dashboard/Listings"));
const Settings = React.lazy(() => import("./pages/guide-dashboard/Settings"));
const Bookings = React.lazy(() => import("./pages/guide-dashboard/Bookings"));
const Services = React.lazy(() => import("./pages/guide-dashboard/Services"));
const Reviews = React.lazy(() => import("./pages/guide-dashboard/Reviews"));
const Analytics = React.lazy(() => import("./pages/guide-dashboard/Analytics"));

const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AllBookings = React.lazy(() => import("./pages/admin/AllBookings"));
const GuideApproval = React.lazy(() => import("./pages/admin/GuideApproval"));
const RevenueAnalytics = React.lazy(() => import("./pages/admin/RevenueAnalytics"));
const DisputeManagement = React.lazy(() => import("./pages/admin/DisputeManagement"));
const PlatformSettings = React.lazy(() => import("./pages/admin/PlatformSettings"));

const NotFound = React.lazy(() => import("./pages/NotFound"));

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
            <Route path="/book/:username" element={<GuideBookingPage />} />
            
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
