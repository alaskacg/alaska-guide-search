import { motion } from "framer-motion";

const MountainSilhouette = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Back mountain layer */}
      <motion.svg
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        viewBox="0 0 1440 400"
        className="absolute bottom-0 left-0 w-full h-auto opacity-10"
        preserveAspectRatio="none"
      >
        <motion.path
          animate={{
            d: [
              "M0,400 L0,280 Q180,200 360,260 T720,220 T1080,250 T1440,200 L1440,400 Z",
              "M0,400 L0,290 Q180,210 360,250 T720,230 T1080,240 T1440,210 L1440,400 Z",
              "M0,400 L0,280 Q180,200 360,260 T720,220 T1080,250 T1440,200 L1440,400 Z",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          fill="hsl(var(--muted))"
        />
      </motion.svg>

      {/* Mid mountain layer */}
      <motion.svg
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        viewBox="0 0 1440 350"
        className="absolute bottom-0 left-0 w-full h-auto opacity-20"
        preserveAspectRatio="none"
      >
        <path
          d="M0,350 L0,250 L200,180 L350,220 L500,150 L650,200 L800,120 L950,180 L1100,100 L1250,160 L1440,80 L1440,350 Z"
          fill="hsl(var(--card))"
        />
        {/* Snow caps */}
        <path
          d="M500,150 L520,165 L480,165 Z M800,120 L830,145 L770,145 Z M1100,100 L1130,125 L1070,125 Z"
          fill="hsl(var(--foreground) / 0.15)"
        />
      </motion.svg>

      {/* Front mountain layer */}
      <motion.svg
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        viewBox="0 0 1440 300"
        className="absolute bottom-0 left-0 w-full h-auto opacity-40"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 L0,220 L150,180 L300,240 L450,160 L600,210 L750,140 L900,190 L1050,130 L1200,170 L1350,100 L1440,150 L1440,300 Z"
          fill="hsl(var(--background))"
        />
      </motion.svg>

      {/* Animated fog */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-full h-1/3"
        style={{
          background: `linear-gradient(180deg, transparent, hsl(var(--background) / 0.8))`,
        }}
      />
    </div>
  );
};

export default MountainSilhouette;
