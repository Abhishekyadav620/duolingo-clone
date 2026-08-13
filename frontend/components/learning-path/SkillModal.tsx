'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SkillHierarchy } from '@/types';
import { CheckCircle2, Lock, Star, Play, Sparkles } from 'lucide-react';

export interface SkillModalProps {
  skill: SkillHierarchy | null;
  isOpen: boolean;
  onClose: () => void;
  nextLessonId?: number | null;
  previousSkillTitle?: string;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  skill,
  isOpen,
  onClose,
  nextLessonId = 1,
  previousSkillTitle = 'the previous skill',
}) => {
  const router = useRouter();

  if (!skill) return null;

  const isCompleted = skill.completed;
  const isLocked = skill.progress === 0 && !isCompleted && skill.order > 2 && skill.id > 2;

  const handleStartLesson = () => {
    onClose();
    if (nextLessonId) {
      router.push(`/lesson/${nextLessonId}`);
    } else {
      router.push(`/lesson/${skill.id}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skill.title}>
      <div className="space-y-6 text-center">
        {/* Status Graphic / Banner */}
        {isCompleted ? (
          <div className="flex flex-col items-center justify-center p-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
            <CheckCircle2 className="w-14 h-14 text-amber-500 mb-2" />
            <span className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-wide">
              Skill Mastered!
            </span>
            <div className="flex items-center gap-1 mt-2 text-amber-500 font-bold">
              {[...Array(Math.max(1, skill.crowns))].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
          </div>
        ) : isLocked ? (
          <div className="flex flex-col items-center justify-center p-6 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl">
            <Lock className="w-14 h-14 text-zinc-400 dark:text-zinc-500 mb-2" />
            <span className="text-sm font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
              Locked Skill
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Complete {previousSkillTitle} to unlock this skill.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl">
            <Sparkles className="w-14 h-14 text-emerald-500 mb-2 animate-bounce-short" />
            <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              In Progress ({skill.progress}%)
            </span>
            <div className="w-full h-2.5 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Skill Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          {skill.description}
        </p>

        {/* Action Button */}
        <div className="pt-2">
          {isCompleted ? (
            <Button variant="secondary" fullWidth size="lg" onClick={handleStartLesson}>
              <Play className="w-5 h-5 mr-2 fill-white" />
              Practice (+{skill.xp_reward} XP)
            </Button>
          ) : isLocked ? (
            <Button variant="locked" fullWidth size="lg" disabled>
              <Lock className="w-5 h-5 mr-2" />
              Locked
            </Button>
          ) : (
            <Button variant="primary" fullWidth size="lg" onClick={handleStartLesson}>
              <Play className="w-5 h-5 mr-2 fill-white" />
              {skill.progress > 0 ? 'Continue Lesson' : 'Start Lesson'} (+{skill.xp_reward} XP)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
