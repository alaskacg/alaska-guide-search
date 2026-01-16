import { motion } from "framer-motion";
import { AlertTriangle, Shield, Thermometer, Mountain, Waves, TreePine } from "lucide-react";

interface SafetyWarning {
  icon: React.ElementType;
  title: string;
  description: string;
  severity: "warning" | "caution" | "info";
}

interface SafetyBannerProps {
  category: string;
  warnings: SafetyWarning[];
}

const severityColors = {
  warning: "border-destructive/50 bg-destructive/10 text-destructive",
  caution: "border-accent/50 bg-accent/10 text-accent",
  info: "border-glacier/50 bg-glacier/10 text-glacier",
};

const SafetyBanner = ({ category, warnings }: SafetyBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <AlertTriangle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display text-lg text-foreground">Alaska {category} Safety</h3>
          <p className="text-sm text-muted-foreground">Critical information for your adventure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warnings.map((warning, index) => (
          <motion.div
            key={warning.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${severityColors[warning.severity]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <warning.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{warning.title}</span>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">{warning.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4 text-glacier" />
        <span>All AlaskaGuide Search professionals are trained in wilderness safety protocols</span>
      </div>
    </motion.div>
  );
};

// Pre-defined safety warnings for each category
export const fishingSafetyWarnings: SafetyWarning[] = [
  {
    icon: Waves,
    title: "Unpredictable Waters",
    description: "Alaska's rivers and oceans can change rapidly. Hypothermia occurs in minutes in cold water.",
    severity: "warning",
  },
  {
    icon: Mountain,
    title: "Remote Locations",
    description: "Many fishing spots are hours from emergency services. Satellite communication is essential.",
    severity: "caution",
  },
  {
    icon: TreePine,
    title: "Bear Country",
    description: "Fish attract bears. Proper food storage and bear awareness protocols are mandatory.",
    severity: "warning",
  },
];

export const huntingSafetyWarnings: SafetyWarning[] = [
  {
    icon: Mountain,
    title: "Extreme Terrain",
    description: "Backcountry hunting requires navigating glaciers, dense brush, and unmarked wilderness.",
    severity: "warning",
  },
  {
    icon: Thermometer,
    title: "Weather Hazards",
    description: "Conditions can shift from clear to whiteout in minutes. Hypothermia is a constant threat.",
    severity: "warning",
  },
  {
    icon: TreePine,
    title: "Wildlife Encounters",
    description: "Brown bears, moose, and wolves share the hunting grounds. Expert awareness is critical.",
    severity: "caution",
  },
];

export const ecoTourSafetyWarnings: SafetyWarning[] = [
  {
    icon: TreePine,
    title: "Wildlife Distance",
    description: "Bears and moose are unpredictable. Safe viewing distances must be maintained at all times.",
    severity: "caution",
  },
  {
    icon: Mountain,
    title: "Glacier Dangers",
    description: "Crevasses, ice caves, and calving glaciers pose serious risks without proper guidance.",
    severity: "warning",
  },
  {
    icon: Thermometer,
    title: "Exposure Risk",
    description: "Even summer temperatures can cause hypothermia. Proper layering is essential.",
    severity: "info",
  },
];

export const flightSafetyWarnings: SafetyWarning[] = [
  {
    icon: Mountain,
    title: "Mountain Weather",
    description: "Alaska's mountain passes create sudden weather changes. Flights may be delayed for safety.",
    severity: "caution",
  },
  {
    icon: Waves,
    title: "Remote Landings",
    description: "Bush planes land on glaciers, gravel bars, and lakes. Conditions vary dramatically.",
    severity: "info",
  },
  {
    icon: AlertTriangle,
    title: "No Cell Service",
    description: "Most landing areas have no communication. Satellite devices are provided by our pilots.",
    severity: "caution",
  },
];

export default SafetyBanner;
