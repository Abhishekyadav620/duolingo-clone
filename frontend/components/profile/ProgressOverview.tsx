'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

export interface ProgressOverviewProps {
  completedSkills: number;
  totalSkills: number;
  completedLessons: number;
  totalLessons: number;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  completedSkills,
  totalSkills,
  completedLessons,
  totalLessons,
}) => {
  const skillPct = totalSkills > 0 ? Math.min(100, Math.round((completedSkills / totalSkills) * 100)) : 0;
  const lessonPct = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
      <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <span>Your Learning Progress</span>
      </h3>

      <div className="space-y-5">
        {/* Skills Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-700 dark:text-zinc-300">Skills Mastered</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              {completedSkills} / {totalSkills} skills ({skillPct}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${skillPct}%` }}
            />
          </div>
        </div>

        {/* Lessons Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-700 dark:text-zinc-300">Lessons Completed</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">
              {completedLessons} / {totalLessons} lessons ({lessonPct}%)
            </span>
          </div>
          <div className="w-full h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${lessonPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
