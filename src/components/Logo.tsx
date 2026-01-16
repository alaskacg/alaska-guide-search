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
      {/* Abstract Geometric Mark - Northern Lights + Mountain abstraction */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 48 48" 
        fill="none"
        className="flex-shrink-0"
      >
        <defs>
          {/* Aurora gradient */}
          <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          {/* Warm accent */}
          <linearGradient id="warmAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        
        {/* Main geometric shape - abstract A / mountain peak */}
        <path
          d="M24 6L42 38H6L24 6Z"
          fill="url(#aurora)"
          opacity="0.9"
        />
        
        {/* Inner cutout creating depth */}
        <path
          d="M24 18L32 34H16L24 18Z"
          fill="hsl(200 20% 6%)"
        />
        
        {/* North star / compass point */}
        <motion.circle
          cx="24"
          cy="12"
          r="2.5"
          fill="url(#warmAccent)"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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
