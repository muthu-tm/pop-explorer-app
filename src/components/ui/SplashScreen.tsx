"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroVideo() {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    // Optional: auto-hide after 3.5 seconds if video doesn't emit `ended`
    const timer = setTimeout(() => setShowVideo(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <video
            src="/qproof_brand_light.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setShowVideo(false)}
            className="w-full h-full object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
