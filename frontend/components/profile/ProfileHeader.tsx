'use client';

import React from 'react';
import { UserResponse } from '@/types';
import { Flame, Star, Gem, Heart, ShieldCheck } from 'lucide-react';

export interface ProfileHeaderProps {
  user: UserResponse;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const initial = (user.username || 'L')[0].toUpperCase();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        {/* Custom SVG/CSS Avatar Badge */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-400 border-4 border-white dark:border-zinc-800 shadow-xl flex items-center justify-center text-white font-black text-4xl select-none">
            {initial}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 border-2 border-white dark:border-zinc-800 rounded-full p-1 shadow">
            <ShieldCheck className="w-5 h-5 text-amber-950" />
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              {user.name || user.username}
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
              Spanish Learner
            </span>
          </div>
          <p className="text-sm font-mono font-semibold text-zinc-400">
            @{user.username}
          </p>
        </div>

        {/* Gamification Stats Quick Row */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 rounded-xl text-orange-600 dark:text-orange-400 font-extrabold text-xs">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>{user.streak}d</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400 font-extrabold text-xs">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{user.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl text-sky-600 dark:text-sky-400 font-extrabold text-xs">
            <Gem className="w-4 h-4 fill-sky-400" />
            <span>{user.gems}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400 font-extrabold text-xs">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>{user.hearts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
