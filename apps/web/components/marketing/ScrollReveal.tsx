'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const delaySec = delay * 0.15;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ 
        duration: 0.8,
        delay: delaySec,
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 1 
      }}
    >
      {children}
    </motion.div>
  );
}
