import { motion } from "framer-motion";
import { useMemo } from "react";

interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
}

const ParticleField = ({ count = 50, color = "glacier", speed = 1 }: ParticleFieldProps) => {
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: (15 + Math.random() * 20) / speed,
      delay: Math.random() * 5,
    }));
  }, [count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: "110%",
            opacity: 0,
          }}
          animate={{
            y: "-10%",
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `hsl(var(--${color}))`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(var(--${color}) / 0.5)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
