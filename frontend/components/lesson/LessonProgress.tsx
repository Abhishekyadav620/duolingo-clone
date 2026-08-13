'use client';

import React from 'react';

export interface LessonProgressProps {
  current: number; // 0-based or 1-based index
  total: number;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({ current, total }) => {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="flex-1 flex items-center gap-3">
      <div className="flex-1 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-300/40 dark:border-zinc-700/40">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono font-bold text-zinc-400 shrink-0">
        {current} / {total}
      </span>
    </div>
  );
};
