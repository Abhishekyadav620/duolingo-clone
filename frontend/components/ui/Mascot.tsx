'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface MascotProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrate';
  size?: 'sm' | 'md' | 'lg';
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]}`}
    >
      {/* Mascot Body Badge */}
      <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 border-4 border-emerald-600 shadow-lg flex items-center justify-center relative overflow-hidden">
        {/* Shine Overlay */}
        <div className="absolute top-1 left-2 w-4 h-2 bg-white/40 rounded-full rotate-[-20deg]" />

        {/* Eyes */}
        <div className="flex items-center gap-2 z-10">
          <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full translate-x-0.5 -translate-y-0.5" />
          </div>
          <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full translate-x-0.5 -translate-y-0.5" />
          </div>
        </div>

        {/* Mouth expression */}
        {mood === 'celebrate' || mood === 'excited' ? (
          <div className="absolute bottom-3.5 w-4 h-2.5 border-b-3 border-zinc-900 rounded-b-full bg-rose-400" />
        ) : mood === 'thinking' ? (
          <div className="absolute bottom-4 w-3 h-1 bg-zinc-900 rounded-full" />
        ) : (
          <div className="absolute bottom-4 w-3 h-1.5 border-b-2 border-zinc-900 rounded-b-full" />
        )}
      </div>
    </motion.div>
  );
};
