'use client';

import React from 'react';
import { Gem } from 'lucide-react';

export interface GemsDisplayProps {
  gems: number;
}

export const GemsDisplay: React.FC<GemsDisplayProps> = ({ gems }) => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 rounded-2xl shadow-sm text-sky-600 dark:text-sky-400 font-extrabold text-sm">
      <Gem className="w-4 h-4 text-sky-500 fill-sky-300" />
      <span>{gems}</span>
    </div>
  );
};
