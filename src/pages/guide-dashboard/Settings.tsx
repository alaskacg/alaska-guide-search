import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Bell, Shield, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GuideProfile } from "@/hooks/useGuideProfile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DashboardContext {
  profile: GuideProfile | null;
}

export default function Settings() {
  const { profile } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(profile?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  const handleToggleActive = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("guide_profiles")
        .update({ is_active: !isActive })
        .eq("id", profile.id);

      if (error) throw error;

      setIsActive(!isActive);
      toast({ 
        title: isActive ? "Profile hidden" : "Profile visible",
        description: isActive 
          ? "Your profile is now hidden from search results." 
          : "Your profile is now visible to adventurers."
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl text-foreground mb-2 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-accent" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account preferences and visibility settings.
        </p>
      </motion.div>

      {/* Visibility Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          Profile Visibility
        </h2>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active" className="text-foreground">Show in search results</Label>
            <p className="text-sm text-muted-foreground mt-1">
              When enabled, adventurers can find and view your profile.
            </p>
          </div>
          <Switch
            id="active"
            checked={isActive}
            onCheckedChange={handleToggleActive}
            disabled={saving}
          />
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent" />
          Notifications
        </h2>
        
        <div className="space-y-4 opacity-50">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Email notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Receive booking requests and messages via email.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Marketing emails</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Tips and updates about the platform.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>

          <p className="text-xs text-muted-foreground italic">
            Notification preferences coming after beta.
          </p>
        </div>
      </motion.div>

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="font-display text-lg text-foreground mb-4">Account</h2>
        
        <div className="space-y-4">
          <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Deactivate Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate your guide account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will hide your profile from search results and cancel any pending bookings. 
                  You can reactivate at any time by signing back in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={async () => {
                    await supabase
                      .from("guide_profiles")
                      .update({ is_active: false })
                      .eq("id", profile?.id);
                    await supabase.auth.signOut();
                    navigate("/");
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Deactivate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>
    </div>
  );
}
