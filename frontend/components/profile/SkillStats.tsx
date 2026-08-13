'use client';

import React from 'react';
import Link from 'next/link';
import { SkillProgressItem } from '@/types';
import { Check, Lock, Star, ChevronRight } from 'lucide-react';

export interface SkillStatsProps {
  skills: SkillProgressItem[];
}

export const SkillStats: React.FC<SkillStatsProps> = ({ skills }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <h3 className="text-base font-black text-zinc-900 dark:text-white uppercase tracking-wider">
          Skills Progression
        </h3>
        <Link href="/" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center">
          Learning Path <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((sk) => {
          return (
            <div
              key={sk.skill_id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                sk.completed
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                  : sk.status === 'in_progress'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                  : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                  {sk.title}
                </div>
                <div className="text-[10px] text-zinc-400 font-semibold uppercase truncate">
                  {sk.unit_title}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {sk.crowns > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-black text-amber-600 dark:text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {sk.crowns}
                  </span>
                )}

                {sk.completed ? (
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                ) : sk.status === 'locked' ? (
                  <span className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {sk.progress}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
