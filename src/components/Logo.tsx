import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 28, text: "text-sm", gap: "gap-2" },
    md: { icon: 36, text: "text-base", gap: "gap-2.5" },
    lg: { icon: 44, text: "text-lg", gap: "gap-3" },
  };

  const s = sizes[size];

  return (
    <motion.div 
      className={`flex items-center ${s.gap}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Abstract Geometric Mark */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 48 48" 
        fill="none"
        className="flex-shrink-0"
      >
        <defs>
          {/* Crimson gradient */}
          <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          {/* Light accent for contrast */}
          <linearGradient id="lightAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="100%" stopColor="#E5E5E5" />
          </linearGradient>
        </defs>
        
        {/* Main geometric shape - abstract A / mountain peak */}
        <path
          d="M24 6L42 38H6L24 6Z"
          fill="url(#crimsonGrad)"
        />
        
        {/* Inner cutout creating depth */}
        <path
          d="M24 18L32 34H16L24 18Z"
          fill="hsl(200 20% 6%)"
        />
        
        {/* North star accent */}
        <motion.circle
          cx="24"
          cy="12"
          r="2"
          fill="url(#lightAccent)"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-semibold tracking-tight ${s.text} text-foreground`}>
            AlaskaGuide
          </span>
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground mt-0.5">
            Search
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
