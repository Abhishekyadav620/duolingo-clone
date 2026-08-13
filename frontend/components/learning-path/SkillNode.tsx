'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Lock,
  Star,
  MessageSquare,
  BookOpen,
  Utensils,
  Users,
  PawPrint,
  MapPin,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { SkillProgress } from './SkillProgress';
import { SkillHierarchy } from '@/types';

// Helper function returning icon
const renderSkillIcon = (title: string) => {
  const t = title.toLowerCase();
  const className = "w-8 h-8";
  if (t.includes('greeting')) return <MessageSquare className={className} />;
  if (t.includes('word') || t.includes('common')) return <BookOpen className={className} />;
  if (t.includes('food')) return <Utensils className={className} />;
  if (t.includes('family')) return <Users className={className} />;
  if (t.includes('animal')) return <PawPrint className={className} />;
  if (t.includes('place')) return <MapPin className={className} />;
  if (t.includes('question')) return <HelpCircle className={className} />;
  if (t.includes('daily') || t.includes('life')) return <Clock className={className} />;
  return <Sparkles className={className} />;
};

export interface SkillNodeProps {
  skill: SkillHierarchy;
  onClick: (skill: SkillHierarchy) => void;
  offsetClass?: string;
}

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, onClick, offsetClass = '' }) => {
  const isCompleted = skill.completed;
  const isLocked = skill.progress === 0 && !isCompleted && skill.order > 2 && skill.id > 2;
  const isInProgress = !isCompleted && !isLocked;

  return (
    <div className={`relative flex flex-col items-center group my-3 ${offsetClass}`}>
      {/* Node Button wrapped in Progress Ring */}
      <SkillProgress progress={skill.progress}>
        <motion.button
          whileHover={isLocked ? {} : { scale: 1.08, y: -2 }}
          whileTap={isLocked ? {} : { scale: 0.94, y: 2 }}
          onClick={() => onClick(skill)}
          disabled={isLocked}
          aria-label={`Skill ${skill.title}`}
          className={`w-20 h-20 rounded-full flex items-center justify-center font-extrabold shadow-lg transition-all border-b-6 select-none cursor-pointer ${
            isCompleted
              ? 'bg-[#FFC800] border-[#E5B200] text-amber-950 shadow-amber-400/30'
              : isInProgress
              ? 'bg-[#58CC02] border-[#46A302] text-white shadow-emerald-500/40 ring-4 ring-[#58CC02]/30 animate-pulse'
              : 'bg-[#E5E5E5] dark:bg-zinc-800 border-[#CECECE] dark:border-zinc-700 text-[#AFAFAF] dark:text-zinc-500 shadow-none cursor-not-allowed'
          }`}
        >
          {isCompleted ? (
            <Check className="w-10 h-10 stroke-[3.5]" />
          ) : isLocked ? (
            <Lock className="w-7 h-7" />
          ) : (
            renderSkillIcon(skill.title)
          )}
        </motion.button>
      </SkillProgress>

      {/* Crowns Badge if crowns earned */}
      {skill.crowns > 0 && (
        <div className="absolute -top-1 right-0 bg-[#FFC800] text-amber-950 border-2 border-[#E5B200] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
          <Star className="w-3 h-3 fill-amber-950" />
          <span>{skill.crowns}</span>
        </div>
      )}

      {/* Skill Title Label */}
      <div className="mt-2 text-center">
        <span className={`text-xs font-black tracking-tight px-3 py-1 rounded-xl shadow-xs border-2 uppercase ${
          isCompleted
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
            : isInProgress
            ? 'bg-[#D7FFB8] dark:bg-emerald-950/60 text-[#3C3C3C] dark:text-emerald-200 border-[#58CC02]'
            : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700'
        }`}>
          {skill.title}
        </span>
      </div>
    </div>
  );
};
