'use client';

import React from 'react';
import { PublicExercise } from '@/types';

export interface TypeAnswerExerciseProps {
  exercise: PublicExercise;
  selectedAnswer: string;
  onSelectAnswer: (answer: string) => void;
  submitted: boolean;
  isCorrect: boolean | null;
  onCheck: () => void;
}

export const TypeAnswerExercise: React.FC<TypeAnswerExerciseProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  submitted,
  onCheck,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !submitted && selectedAnswer.trim().length > 0) {
      e.preventDefault();
      onCheck();
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto w-full">
      {/* Exercise Question Header */}
      <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight text-center sm:text-left">
        {exercise.question}
      </h2>

      {/* Controlled Input Box */}
      <div className="space-y-2 pt-2">
        <label htmlFor="type-answer-input" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Type in Spanish
        </label>
        <input
          id="type-answer-input"
          type="text"
          disabled={submitted}
          value={selectedAnswer}
          onChange={(e) => onSelectAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer here..."
          autoFocus
          className="w-full p-4 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold text-lg focus:outline-none focus:border-emerald-500 shadow-sm transition disabled:opacity-80"
        />
      </div>
    </div>
  );
};
