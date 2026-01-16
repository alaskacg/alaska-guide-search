import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardSidebar from "@/components/guide-dashboard/DashboardSidebar";
import DashboardHeader from "@/components/guide-dashboard/DashboardHeader";
import { useGuideProfile } from "@/hooks/useGuideProfile";

export default function GuideDashboard() {
  const navigate = useNavigate();
  const { profile, loading, error } = useGuideProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  // If no guide profile, redirect to registration
  useEffect(() => {
    if (!loading && !profile && !error) {
      navigate("/guide-registration");
    }
  }, [loading, profile, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar isVerified={profile?.is_verified ?? false} />
      <div className="ml-64">
        <DashboardHeader profile={profile} />
        <main className="p-6">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}
