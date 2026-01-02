import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  animated?: boolean;
}

const Logo = ({ size = "md", showText = true, animated = true }: LogoProps) => {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg", compass: 12, mountain: 10 },
    md: { icon: "h-10 w-10", text: "text-xl", compass: 16, mountain: 14 },
    lg: { icon: "h-14 w-14", text: "text-2xl", compass: 22, mountain: 18 },
  };

  const s = sizes[size];

  const LogoIcon = () => (
    <div className={`relative ${s.icon} flex items-center justify-center`}>
      {/* Outer Ring */}
      <motion.div
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-xl border-2 border-accent/30"
      />
      
      {/* Inner Gradient Background */}
      <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-forest-deep via-glacier-deep to-mountain-peak shadow-lg" />
      
      {/* Mountain Silhouette */}
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        {/* Northern Lights Effect */}
        <defs>
          <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(42 85% 50%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(160 70% 40%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(200 80% 45%)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(160 50% 15%)" />
            <stop offset="100%" stopColor="hsl(160 40% 25%)" />
          </linearGradient>
        </defs>
        
        {/* Aurora Wave */}
        <motion.path
          d="M5 12 Q10 8 15 12 Q20 16 25 10 Q30 6 35 10"
          stroke="url(#auroraGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={animated ? { pathOffset: [0, 1] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Mountain Range */}
        <path
          d="M4 32 L12 18 L16 24 L20 14 L24 22 L28 16 L36 32 Z"
          fill="url(#mountainGradient)"
        />
        
        {/* Snow Caps */}
        <path
          d="M11 20 L12 18 L13 20 M19 16 L20 14 L21 16 M27 18 L28 16 L29 18"
          stroke="hsl(0 0% 95%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Compass Star */}
        <motion.g
          animate={animated ? { rotate: [0, 360] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 8px" }}
        >
          <path
            d="M30 4 L31 7 L34 8 L31 9 L30 12 L29 9 L26 8 L29 7 Z"
            fill="hsl(42 85% 55%)"
          />
        </motion.g>
      </svg>
      
      {/* Glow Effect */}
      <motion.div
        animate={animated ? { opacity: [0.4, 0.8, 0.4] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-lg bg-accent/20 blur-sm"
      />
    </div>
  );

  return (
    <div className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogoIcon />
      </motion.div>
      
      {showText && (
        <div className={`font-display ${s.text} font-bold`}>
          <span className="text-foreground">Alaska</span>
          <span className="text-accent">Guide</span>
          <span className="text-muted-foreground text-[0.65em] ml-1 font-medium">Search</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
