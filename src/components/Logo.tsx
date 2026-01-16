import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { icon: 36, text: "text-lg", gap: "gap-2.5" },
    md: { icon: 44, text: "text-xl", gap: "gap-3" },
    lg: { icon: 52, text: "text-2xl", gap: "gap-3.5" },
  };

  const s = sizes[size];

  return (
    <motion.div 
      className={`flex items-center ${s.gap}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Animated Compass Logo */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 56 56" 
        fill="none"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="compassRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(0, 72%, 55%)" />
            <stop offset="100%" stopColor="hsl(0, 72%, 42%)" />
          </linearGradient>
          <linearGradient id="compassDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(200, 15%, 25%)" />
            <stop offset="100%" stopColor="hsl(200, 15%, 15%)" />
          </linearGradient>
        </defs>
        
        {/* Outer compass ring */}
        <circle
          cx="28"
          cy="28"
          r="26"
          stroke="hsl(200, 10%, 30%)"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Inner compass ring */}
        <circle
          cx="28"
          cy="28"
          r="20"
          stroke="hsl(200, 10%, 25%)"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Cardinal direction markers */}
        {/* North - emphasized */}
        <text
          x="28"
          y="10"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill="hsl(0, 72%, 50%)"
          fontFamily="system-ui"
        >
          N
        </text>
        
        {/* East */}
        <text
          x="48"
          y="30"
          textAnchor="middle"
          fontSize="6"
          fontWeight="500"
          fill="hsl(200, 10%, 45%)"
          fontFamily="system-ui"
        >
          E
        </text>
        
        {/* South */}
        <text
          x="28"
          y="52"
          textAnchor="middle"
          fontSize="6"
          fontWeight="500"
          fill="hsl(200, 10%, 45%)"
          fontFamily="system-ui"
        >
          S
        </text>
        
        {/* West */}
        <text
          x="8"
          y="30"
          textAnchor="middle"
          fontSize="6"
          fontWeight="500"
          fill="hsl(200, 10%, 45%)"
          fontFamily="system-ui"
        >
          W
        </text>
        
        {/* Tick marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={28 + 22 * Math.sin((angle * Math.PI) / 180)}
            y1={28 - 22 * Math.cos((angle * Math.PI) / 180)}
            x2={28 + 24 * Math.sin((angle * Math.PI) / 180)}
            y2={28 - 24 * Math.cos((angle * Math.PI) / 180)}
            stroke={angle === 0 ? "hsl(0, 72%, 50%)" : "hsl(200, 10%, 35%)"}
            strokeWidth={angle % 90 === 0 ? 2 : 1}
          />
        ))}
        
        {/* Animated compass needle group */}
        <motion.g
          initial={{ rotate: -45 }}
          animate={{ rotate: 0 }}
          transition={{ 
            duration: 2,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.5
          }}
          style={{ transformOrigin: "28px 28px" }}
        >
          {/* North needle (red) */}
          <path
            d="M28 10L32 28L28 24L24 28L28 10Z"
            fill="url(#compassRed)"
          />
          
          {/* South needle (dark) */}
          <path
            d="M28 46L24 28L28 32L32 28L28 46Z"
            fill="url(#compassDark)"
          />
        </motion.g>
        
        {/* Center pivot */}
        <circle cx="28" cy="28" r="3" fill="hsl(200, 10%, 20%)" />
        <circle cx="28" cy="28" r="1.5" fill="hsl(0, 72%, 50%)" />
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
