'use client';

import React from 'react';
import { Star } from 'lucide-react';

export interface XPDisplayProps {
  xp: number;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ xp }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl shadow-sm text-amber-600 dark:text-amber-400 font-extrabold text-sm">
      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
      <span>{xp} XP</span>
    </div>
  );
};
