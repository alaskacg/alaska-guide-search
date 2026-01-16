import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizes = {
    sm: { container: "h-9", text: "text-base", subtext: "text-[10px]" },
    md: { container: "h-11", text: "text-lg", subtext: "text-[11px]" },
    lg: { container: "h-14", text: "text-xl", subtext: "text-xs" },
  };

  const s = sizes[size];

  return (
    <motion.div 
      className="flex items-center gap-2.5"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Minimalist Icon Mark */}
      <div className={`${s.container} aspect-square relative flex items-center justify-center`}>
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
          {/* Mountain silhouette with clean lines */}
          <defs>
            <linearGradient id="mountainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(158 45% 22%)" />
              <stop offset="100%" stopColor="hsl(160 50% 35%)" />
            </linearGradient>
            <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(45 100% 96%)" />
              <stop offset="100%" stopColor="hsl(160 30% 70%)" />
            </linearGradient>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(42 100% 65%)" />
              <stop offset="100%" stopColor="hsl(32 90% 50%)" />
            </linearGradient>
          </defs>
          
          {/* Main mountain */}
          <path
            d="M4 40 L24 10 L44 40 Z"
            fill="url(#mountainGrad)"
          />
          
          {/* Snow cap */}
          <path
            d="M24 10 L20 18 L24 16 L28 18 Z"
            fill="url(#peakGrad)"
          />
          
          {/* North star */}
          <motion.g
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="38" cy="12" r="2" fill="url(#starGrad)" />
            <path
              d="M38 8 L38 16 M34 12 L42 12"
              stroke="hsl(42 100% 65%)"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.6"
            />
          </motion.g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col -space-y-0.5">
          <span className={`font-sans font-bold tracking-tight ${s.text} text-foreground leading-tight`}>
            Alaska<span className="text-accent">Guide</span>
          </span>
          <span className={`font-sans font-medium tracking-[0.2em] uppercase ${s.subtext} text-muted-foreground`}>
            Search
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
