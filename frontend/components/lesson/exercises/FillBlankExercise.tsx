'use client';

import React from 'react';
import { PublicExercise } from '@/types';
import { motion } from 'framer-motion';

export interface FillBlankExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  submitted,
}) => {
  const options = Array.isArray(exercise.options) ? (exercise.options as string[]) : [];

  // Replace '___' in question with highlighted target blank
  const parts = exercise.question.split('___');

  return (
    <div className="space-y-8 max-w-xl mx-auto w-full">
      {/* Sentence with Blank Highlight */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-relaxed">
          {parts[0]}
          <span className="inline-block mx-2 px-4 py-1 border-b-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-xl min-w-[80px]">
            {selectedAnswer || '___'}
          </span>
          {parts[1] || ''}
        </h2>
      </div>

      {/* Selectable Options Chips */}
      {options.length > 0 ? (
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Choose the correct word
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((option) => {
              const isSelected = selectedAnswer === option;
              return (
                <motion.button
                  key={option}
                  whileHover={submitted ? {} : { scale: 1.03 }}
                  whileTap={submitted ? {} : { scale: 0.97 }}
                  disabled={submitted}
                  onClick={() => onSelectAnswer(option)}
                  className={`p-4 rounded-2xl border-2 border-b-4 font-bold text-base transition select-none cursor-pointer text-center ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-md'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300'
                  } ${submitted ? 'cursor-not-allowed opacity-90' : ''}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Fallback Controlled Input if options array is empty */
        <div className="space-y-2">
          <label htmlFor="fill-blank-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Type the missing word
          </label>
          <input
            id="fill-blank-input"
            type="text"
            disabled={submitted}
            value={selectedAnswer}
            onChange={(e) => onSelectAnswer(e.target.value)}
            placeholder="Type word..."
            className="w-full p-4 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-lg focus:outline-none focus:border-emerald-500 disabled:opacity-80"
          />
        </div>
      )}
    </div>
  );
};
