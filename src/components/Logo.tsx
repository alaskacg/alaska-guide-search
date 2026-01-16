import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 32, text: "text-lg", gap: "gap-2.5" },
    md: { icon: 40, text: "text-xl", gap: "gap-3" },
    lg: { icon: 48, text: "text-2xl", gap: "gap-3.5" },
  };

  const s = sizes[size];

  return (
    <motion.div 
      className={`flex items-center ${s.gap}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Custom Alaska-inspired compass/mountain mark */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 48 48" 
        fill="none"
        className="flex-shrink-0"
      >
        <defs>
          {/* Deep crimson gradient */}
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(0, 72%, 55%)" />
            <stop offset="100%" stopColor="hsl(0, 72%, 40%)" />
          </linearGradient>
          {/* Subtle inner shadow */}
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feOffset dx="0" dy="1" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend in2="SourceGraphic" />
          </filter>
        </defs>
        
        {/* Outer ring - compass inspired */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Inner mountain peaks forming an abstract "A" */}
        <path
          d="M24 10L36 34H30L24 22L18 34H12L24 10Z"
          fill="url(#logoGradient)"
          filter="url(#innerShadow)"
        />
        
        {/* North star indicator */}
        <motion.circle
          cx="24"
          cy="6"
          r="2"
          fill="hsl(0, 72%, 50%)"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Compass cardinal points */}
        <circle cx="42" cy="24" r="1.5" fill="hsl(0, 10%, 50%)" />
        <circle cx="6" cy="24" r="1.5" fill="hsl(0, 10%, 50%)" />
        <circle cx="24" cy="42" r="1.5" fill="hsl(0, 10%, 50%)" />
      </svg>
      
      {showText && (
        <span className={`font-display font-medium tracking-tight ${s.text} text-foreground`}>
          AlaskaGuide
        </span>
      )}
    </motion.div>
  );
};

export default Logo;
