import { motion } from "framer-motion";

interface GlowOrbsProps {
  primaryColor?: string;
  secondaryColor?: string;
}

const GlowOrbs = ({ primaryColor = "accent", secondaryColor = "glacier" }: GlowOrbsProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary large orb */}
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--${primaryColor}) / 0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Secondary orb */}
      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--${secondaryColor}) / 0.12) 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />

      {/* Small accent orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 30 * (i + 1), -20 * (i + 1), 0],
            y: [0, -40 * (i + 1), 20 * (i + 1), 0],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: 10 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          className="absolute w-[200px] h-[200px] rounded-full"
          style={{
            top: `${20 + i * 25}%`,
            left: `${30 + i * 20}%`,
            background: `radial-gradient(circle, hsl(var(--${i % 2 === 0 ? primaryColor : secondaryColor}) / 0.1) 0%, transparent 70%)`,
            filter: "blur(30px)",
          }}
        />
      ))}
    </div>
  );
};

export default GlowOrbs;
