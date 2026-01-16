import { motion } from "framer-motion";

const AuroraBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora waves */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[100%] opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--glacier) / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 60% 30%, hsl(165 60% 45% / 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 80% 50%, hsl(190 70% 40% / 0.25) 0%, transparent 50%)
          `,
        }}
      />
      
      <motion.div
        animate={{
          x: [-50, 50, 0, -50],
          y: [20, -20, 10, 20],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 left-0 w-full h-[80%] opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 30% 20%, hsl(280 50% 50% / 0.2) 0%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 70% 40%, hsl(190 60% 50% / 0.25) 0%, transparent 50%)
          `,
        }}
      />

      {/* Animated light streaks */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: "-100%", rotate: 15 + i * 5 }}
          animate={{
            opacity: [0, 0.3, 0.15, 0],
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut",
          }}
          className="absolute top-0 h-[2px] w-[40%]"
          style={{
            top: `${15 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, hsl(var(--glacier) / 0.6), hsl(165 60% 50% / 0.4), transparent)`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
};

export default AuroraBackground;
