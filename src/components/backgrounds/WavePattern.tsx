import { motion } from "framer-motion";

interface WavePatternProps {
  color?: string;
  layers?: number;
}

const WavePattern = ({ color = "glacier", layers = 3 }: WavePatternProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(layers)].map((_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 w-[200%]"
          style={{
            opacity: 0.1 - i * 0.02,
            zIndex: layers - i,
          }}
          preserveAspectRatio="none"
        >
          <motion.path
            animate={{
              d: [
                `M0,${160 + i * 30} C320,${220 + i * 20} 640,${100 + i * 20} 960,${180 + i * 25} C1280,${260 + i * 15} 1440,${140 + i * 30} 1440,${140 + i * 30} L1440,320 L0,320 Z`,
                `M0,${180 + i * 25} C320,${120 + i * 30} 640,${200 + i * 15} 960,${140 + i * 20} C1280,${180 + i * 25} 1440,${200 + i * 20} 1440,${200 + i * 20} L1440,320 L0,320 Z`,
                `M0,${160 + i * 30} C320,${220 + i * 20} 640,${100 + i * 20} 960,${180 + i * 25} C1280,${260 + i * 15} 1440,${140 + i * 30} 1440,${140 + i * 30} L1440,320 L0,320 Z`,
              ],
              x: [0, -720, 0],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            fill={`hsl(var(--${color}) / ${0.3 - i * 0.08})`}
          />
        </motion.svg>
      ))}
    </div>
  );
};

export default WavePattern;
