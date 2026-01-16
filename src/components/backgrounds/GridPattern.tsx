import { motion } from "framer-motion";

interface GridPatternProps {
  animated?: boolean;
}

const GridPattern = ({ animated = true }: GridPatternProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated glow lines */}
      {animated && (
        <>
          <motion.div
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 h-full w-[1px]"
            style={{
              background: `linear-gradient(180deg, transparent, hsl(var(--accent) / 0.5), transparent)`,
              boxShadow: `0 0 20px 2px hsl(var(--accent) / 0.3)`,
            }}
          />
          <motion.div
            animate={{
              y: ["-100%", "200%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
            className="absolute left-0 w-full h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(var(--glacier) / 0.5), transparent)`,
              boxShadow: `0 0 20px 2px hsl(var(--glacier) / 0.3)`,
            }}
          />
        </>
      )}

      {/* Corner gradients */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-accent/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-glacier/5 to-transparent" />
    </div>
  );
};

export default GridPattern;
