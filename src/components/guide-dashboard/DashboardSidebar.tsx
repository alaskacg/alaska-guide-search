import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Image, 
  FileText, 
  Settings,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import Logo from "@/components/Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/guide-dashboard" },
  { icon: User, label: "Profile", path: "/guide-dashboard/profile" },
  { icon: Image, label: "Media", path: "/guide-dashboard/media" },
  { icon: Calendar, label: "Availability", path: "/guide-dashboard/availability" },
  { icon: FileText, label: "Listings", path: "/guide-dashboard/listings" },
  { icon: Settings, label: "Settings", path: "/guide-dashboard/settings" },
];

interface DashboardSidebarProps {
  isVerified?: boolean;
}

export default function DashboardSidebar({ isVerified = true }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-50">
      <div className="p-6 border-b border-border">
        <Link to="/">
          <Logo size="md" />
        </Link>
      </div>

      {/* Beta Notice */}
      <div className="mx-4 mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-foreground">Beta Period</p>
            <p className="text-muted-foreground mt-1">
              Free listings during beta. Bookings will be enabled after launch.
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link 
          to="/guide/preview" 
          target="_blank"
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm">Preview Public Page</span>
        </Link>
      </div>
    </aside>
  );
}
