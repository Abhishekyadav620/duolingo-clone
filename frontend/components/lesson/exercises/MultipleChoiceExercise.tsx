'use client';

import React from 'react';
import { PublicExercise } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface MultipleChoiceExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  correctAnswer?: string;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  submitted,
  isCorrect,
  correctAnswer,
}) => {
  const options = Array.isArray(exercise.options) ? (exercise.options as string[]) : [];

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Question Heading */}
      <h2 className="text-2xl sm:text-3xl font-black text-[#3C3C3C] dark:text-white tracking-tight text-center sm:text-left">
        {exercise.question}
      </h2>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3.5 pt-2">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectChoice =
            correctAnswer && option.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

          let cardStyle =
            'bg-white dark:bg-zinc-900 border-[#E5E5E5] dark:border-zinc-800 border-b-[#CECECE] text-[#3C3C3C] dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850';
          let badgeStyle =
            'bg-[#F7F7F7] dark:bg-zinc-800 text-zinc-500 border-[#E5E5E5] dark:border-zinc-700';
          let statusIcon = null;

          if (submitted) {
            if (isSelected && isCorrect === false) {
              cardStyle =
                'bg-rose-50 dark:bg-rose-950/80 border-[#FF4B4B] border-b-rose-700 text-[#FF4B4B] dark:text-rose-200 shadow-md';
              badgeStyle = 'bg-[#FF4B4B] text-white border-rose-700';
              statusIcon = <XCircle className="w-6 h-6 text-[#FF4B4B] shrink-0" />;
            } else if (isCorrectChoice || (isSelected && isCorrect === true)) {
              cardStyle =
                'bg-emerald-50 dark:bg-emerald-950/80 border-[#58CC02] border-b-emerald-700 text-[#58CC02] dark:text-emerald-200 shadow-md';
              badgeStyle = 'bg-[#58CC02] text-white border-emerald-700';
              statusIcon = <CheckCircle2 className="w-6 h-6 text-[#58CC02] shrink-0" />;
            }
          } else if (isSelected) {
            cardStyle =
              'bg-sky-50 dark:bg-sky-950/60 border-[#1CB0F6] border-b-[#0092DF] text-[#1CB0F6] dark:text-sky-300 shadow-md';
            badgeStyle = 'bg-[#1CB0F6] text-white border-[#0092DF]';
          }

          return (
            <motion.button
              key={option}
              whileHover={submitted ? {} : { scale: 1.01, y: -2 }}
              whileTap={submitted ? {} : { scale: 0.98, y: 2 }}
              disabled={submitted}
              onClick={() => onSelectAnswer(option)}
              className={`flex items-center gap-4 p-4 sm:p-5 rounded-3xl border-2 border-b-4 font-black text-base sm:text-lg transition-all select-none cursor-pointer text-left w-full ${cardStyle} ${
                submitted ? 'cursor-not-allowed' : ''
              }`}
            >
              <span
                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono text-sm font-black border-2 shrink-0 ${badgeStyle}`}
              >
                {index + 1}
              </span>
              <span className="flex-1">{option}</span>
              {statusIcon}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
