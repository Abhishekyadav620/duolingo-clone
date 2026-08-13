'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { LessonProgress } from './LessonProgress';

export interface LessonHeaderProps {
  onExit: () => void;
  title: string;
  currentExerciseIndex: number;
  totalExercises: number;
  hearts?: number;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  onExit,
  title,
  currentExerciseIndex,
  totalExercises,
  hearts = 5,
}) => {
  const [prevHearts, setPrevHearts] = useState<number>(hearts);
  const [showHeartLoss, setShowHeartLoss] = useState<boolean>(false);

  // React pattern: Adjusting state during render when props change
  if (hearts !== prevHearts) {
    setPrevHearts(hearts);
    if (hearts < prevHearts) {
      setShowHeartLoss(true);
    }
  }

  useEffect(() => {
    if (showHeartLoss) {
      const timer = setTimeout(() => setShowHeartLoss(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showHeartLoss]);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Exit Button */}
      <button
        onClick={onExit}
        aria-label="Exit lesson"
        className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Title & Progress Bar */}
      <div className="flex-1 max-w-xl mx-auto flex items-center gap-4">
        <span className="hidden sm:inline font-black text-xs text-zinc-400 uppercase tracking-wide truncate max-w-[120px]">
          {title}
        </span>
        <LessonProgress current={currentExerciseIndex} total={totalExercises} />
      </div>

      {/* Heart Counter with Loss Animation */}
      <div className="relative flex items-center shrink-0">
        <AnimatePresence>
          {showHeartLoss && (
            <motion.span
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -24, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="absolute -top-1 right-2 text-xs font-black text-rose-500 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full border border-rose-300 shadow-md"
            >
              ❤️ -1
            </motion.span>
          )}
        </AnimatePresence>

        <motion.div
          animate={showHeartLoss ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
          className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-600 dark:text-rose-400 font-extrabold text-sm"
        >
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>{hearts}</span>
        </motion.div>
      </div>
    </header>
  );
};
