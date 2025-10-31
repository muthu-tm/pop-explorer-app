'use client';

import { motion } from 'framer-motion';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5, duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
