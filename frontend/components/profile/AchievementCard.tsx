'use client';

import React from 'react';
import { Achievement } from '@/types';
import { Lock, Check } from 'lucide-react';

export interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <div className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
      achievement.unlocked
        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/50 text-amber-950 dark:text-amber-100 shadow-sm'
        : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-70'
    }`}>
      {/* Icon Badge */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
        achievement.unlocked
          ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md shadow-amber-400/20'
          : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
      }`}>
        {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-zinc-400" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
            {achievement.title}
          </h4>
          {achievement.unlocked ? (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              <Check className="w-3 h-3 stroke-[3]" /> Unlocked
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase text-zinc-400">
              Locked
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          {achievement.description}
        </p>
      </div>
    </div>
  );
};
