'use client';

import React from 'react';
import { Award, Flame, Star, CheckCircle2, Lock, BookOpen, Target, Sparkles, Trophy } from 'lucide-react';

export interface AchievementItem {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  currentProgress: number;
  totalProgress: number;
  icon: React.ElementType;
  iconColor: string;
}

interface AchievementsGridProps {
  userXp: number;
  userStreak: number;
  completedLessons: number;
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  userXp,
  userStreak,
  completedLessons,
}) => {
  const achievements: AchievementItem[] = [
    {
      id: 'first_lesson',
      name: 'First Lesson',
      description: 'Complete your first Spanish lesson',
      xpReward: 50,
      unlocked: completedLessons >= 1,
      currentProgress: Math.min(1, completedLessons),
      totalProgress: 1,
      icon: BookOpen,
      iconColor: 'text-[#1CB0F6] bg-sky-100 dark:bg-sky-950/60',
    },
    {
      id: 'hundred_xp',
      name: '100 XP Club',
      description: 'Earn 100 total XP',
      xpReward: 50,
      unlocked: userXp >= 100,
      currentProgress: Math.min(100, userXp),
      totalProgress: 100,
      icon: Star,
      iconColor: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60',
    },
    {
      id: 'seven_day_streak',
      name: '7 Day Streak',
      description: 'Maintain a 7 day learning streak',
      xpReward: 100,
      unlocked: userStreak >= 7,
      currentProgress: Math.min(7, userStreak),
      totalProgress: 7,
      icon: Flame,
      iconColor: 'text-orange-500 bg-orange-100 dark:bg-orange-950/60',
    },
    {
      id: 'lesson_master',
      name: 'Lesson Master',
      description: 'Complete 5 Spanish lessons',
      xpReward: 75,
      unlocked: completedLessons >= 5,
      currentProgress: Math.min(5, completedLessons),
      totalProgress: 5,
      icon: Trophy,
      iconColor: 'text-[#58CC02] bg-emerald-100 dark:bg-emerald-950/60',
    },
    {
      id: 'practice_champion',
      name: 'Practice Champion',
      description: 'Complete 3 practice hub sessions',
      xpReward: 50,
      unlocked: true,
      currentProgress: 3,
      totalProgress: 3,
      icon: Target,
      iconColor: 'text-purple-500 bg-purple-100 dark:bg-purple-950/60',
    },
    {
      id: 'vocabulary_builder',
      name: 'Vocabulary Builder',
      description: 'Master 20 Spanish vocabulary terms',
      xpReward: 50,
      unlocked: false,
      currentProgress: 14,
      totalProgress: 20,
      icon: Sparkles,
      iconColor: 'text-rose-500 bg-rose-100 dark:bg-rose-950/60',
    },
    {
      id: 'perfect_lesson',
      name: 'Perfect Lesson',
      description: 'Finish a lesson with 0 mistakes',
      xpReward: 100,
      unlocked: completedLessons >= 1,
      currentProgress: Math.min(1, completedLessons),
      totalProgress: 1,
      icon: Award,
      iconColor: 'text-amber-600 bg-yellow-100 dark:bg-yellow-950/60',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-[#58CC02] uppercase tracking-wider text-xs">
          <Award className="w-4 h-4" />
          <span>Achievements & Badges</span>
        </div>
        <span className="text-xs font-mono font-extrabold text-zinc-400">
          {achievements.filter((a) => a.unlocked).length} / {achievements.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const Icon = ach.icon;
          const pct = Math.min(100, Math.round((ach.currentProgress / ach.totalProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200/60 dark:border-zinc-850 opacity-80'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700/50 ${ach.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white truncate">
                    {ach.name}
                  </h4>
                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#58CC02] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full shrink-0">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-snug">
                  {ach.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-400">
                    <span>Progress</span>
                    <span>{ach.currentProgress} / {ach.totalProgress}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        ach.unlocked ? 'bg-[#58CC02]' : 'bg-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
