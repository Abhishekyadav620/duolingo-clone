'use client';

import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export interface DailyGoalProps {
  currentXP: number;
  dailyGoal: number;
}

export const DailyGoal: React.FC<DailyGoalProps> = ({ currentXP, dailyGoal }) => {
  // Use modulo for daily earned XP progression or display current vs goal
  const progressXP = currentXP > 0 ? (currentXP % dailyGoal === 0 ? dailyGoal : currentXP % dailyGoal) : 0;
  const percentage = Math.min(100, Math.round((progressXP / dailyGoal) * 100));
  const remainingXP = Math.max(0, dailyGoal - progressXP);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-sm text-zinc-800 dark:text-zinc-200">
          <Target className="w-4 h-4 text-emerald-500" />
          <span>Daily Goal</span>
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold">
          {progressXP} / {dailyGoal} XP
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/50">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-between pt-1">
        {remainingXP === 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Goal completed!
          </span>
        ) : (
          <span>{remainingXP} XP remaining to hit daily goal</span>
        )}
      </div>
    </div>
  );
};
