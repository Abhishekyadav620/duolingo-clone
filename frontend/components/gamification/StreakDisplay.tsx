'use client';

import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-2xl shadow-sm text-orange-600 dark:text-orange-400 font-extrabold text-sm">
      <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
      <span>{streak}</span>
    </div>
  );
};
