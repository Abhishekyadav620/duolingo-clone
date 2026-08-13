'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Mascot } from '../ui/Mascot';
import { Star, CheckCircle2, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { LessonCompletionResponse } from '@/types';

export interface LessonCompleteProps {
  title: string;
  totalExercises: number;
  completionData?: LessonCompletionResponse | null;
  defaultXpReward?: number;
  onFinish: () => void;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({
  title,
  totalExercises,
  completionData,
  defaultXpReward = 20,
  onFinish,
}) => {
  const xpEarned = completionData ? completionData.xp_earned : defaultXpReward;
  const streak = completionData ? completionData.streak : 1;
  const perfect = completionData ? completionData.perfect : false;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-50/40 dark:bg-zinc-950 font-sans relative overflow-hidden">
      {/* Background Floating Particle Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/5 text-amber-400 opacity-30 text-3xl animate-bounce">✨</div>
        <div className="absolute top-1/3 right-1/4 text-emerald-400 opacity-30 text-2xl animate-pulse">🎉</div>
        <div className="absolute bottom-1/4 left-1/3 text-sky-400 opacity-30 text-3xl animate-bounce">⭐</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative z-10"
      >
        {/* Mascot Celebration */}
        <div className="flex justify-center pt-2">
          <Mascot mood="celebrate" size="lg" />
        </div>

        {/* Title & Optional Perfect Badge */}
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Lesson Complete!
          </h1>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">
            {title}
          </p>
          {perfect && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-black px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Perfect Bonus +10 XP!
              </span>
            </div>
          )}
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-3 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-lg font-black text-emerald-800 dark:text-emerald-300">
              {totalExercises}
            </div>
            <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Exercises
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-3 text-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black text-amber-800 dark:text-amber-300">
              +{xpEarned} XP
            </div>
            <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase">
              XP Earned
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-3 text-center">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-400 mx-auto mb-1" />
            <div className="text-lg font-black text-orange-800 dark:text-orange-300">
              {streak}
            </div>
            <div className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase">
              Streak
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-medium">
          Great work! Your progress has been saved to your learner profile.
        </p>

        {/* Finish CTA */}
        <div className="pt-2">
          <Button variant="primary" size="lg" fullWidth onClick={onFinish}>
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
