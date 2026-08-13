'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export interface HeartsDisplayProps {
  hearts: number;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({ hearts }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-sm text-rose-600 dark:text-rose-400 font-extrabold text-sm">
      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
      <span>{hearts}</span>
    </div>
  );
};
